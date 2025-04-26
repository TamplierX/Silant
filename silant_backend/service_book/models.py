from django.db import models
from django.utils.functional import cached_property
from account.models import Client, ServiceCompany


class Reference(models.Model):
    ENTITY_CHOICES = [
        ('model_technique', 'Модель техники'),
        ('engine_model', 'Модель двигателя'),
        ('transmission_model', 'Модель трансмиссии'),
        ('driving_bridge_model', 'Модель ведущего моста'),
        ('controlled_bridge_model', 'Модель управляемого моста'),
        ('type_of_service', 'Вид ТО'),
        ('fault_node', 'Узел отказа'),
        ('restoration_method', 'Способ восстановления'),
        ('organization', 'Организация, проводившая ТО'),
    ]

    entity_name = models.CharField(
        max_length=255,
        choices=ENTITY_CHOICES,
        verbose_name='Название справочника'
    )
    name = models.CharField(max_length=255, verbose_name='Название')
    description = models.TextField(blank=True, null=True, verbose_name='Описание')

    class Meta:
        unique_together = ('entity_name', 'name')
        ordering = ('-entity_name',)

    def __str__(self):
        return self.name


class Machine(models.Model):
    serial_number = models.CharField(max_length=255,
                                     unique=True,
                                     primary_key=True,
                                     verbose_name='Зав. № машины')
    model_technique = models.ForeignKey(Reference,
                                        on_delete=models.PROTECT,
                                        related_name='machines_model_technique',
                                        verbose_name='Модель техники',
                                        limit_choices_to={'entity_name': 'model_technique'})
    engine_model = models.ForeignKey(Reference,
                                     on_delete=models.PROTECT,
                                     related_name='machines_engine_model',
                                     verbose_name='Модель двигателя',
                                     limit_choices_to={'entity_name': 'engine_model'})
    engine_serial_number = models.CharField(max_length=255, verbose_name='Зав. № двигателя')
    transmission_model = models.ForeignKey(Reference,
                                           on_delete=models.PROTECT,
                                           related_name='machines_transmission_model',
                                           verbose_name='Модель трансмиссии',
                                           limit_choices_to={'entity_name': 'transmission_model'})
    transmission_serial_number = models.CharField(max_length=255, verbose_name='Зав. № трансмиссии')
    driving_bridge_model = models.ForeignKey(Reference,
                                             on_delete=models.PROTECT,
                                             related_name='machines_driving_bridge_model',
                                             verbose_name='Модель ведущего моста',
                                             limit_choices_to={'entity_name': 'driving_bridge_model'})
    driving_bridge_serial_number = models.CharField(max_length=255,
                                                    verbose_name='Зав. № ведущего моста')
    controlled_bridge_model = models.ForeignKey(Reference,
                                                on_delete=models.PROTECT,
                                                related_name='machines_controlled_bridge_model',
                                                verbose_name='Модель управляемого моста',
                                                limit_choices_to={'entity_name': 'controlled_bridge_model'})
    controlled_bridge_serial_number = models.CharField(max_length=255,
                                                       verbose_name='Зав. № управляемого моста')
    supply_contract = models.CharField(max_length=255,
                                       verbose_name='Договор поставки №, дата',
                                       null=True,
                                       blank=True)
    shipment_date = models.DateField(verbose_name='Дата отгрузки с завода',)
    recipient = models.CharField(max_length=255,
                                 verbose_name='Грузополучатель (конечный потребитель)',
                                 null=True,
                                 blank=True)
    delivery_address = models.CharField(max_length=255,
                                        verbose_name='Адрес поставки (эксплуатации)',
                                        null=True,
                                        blank=True)
    equipment = models.TextField(verbose_name='Комплектация (доп. опции)',
                                 blank=True,
                                 default='Стандарт')
    client = models.ForeignKey(Client,
                               on_delete=models.PROTECT,
                               verbose_name='Клиент',
                               null=True,
                               blank=True)
    service_company = models.ForeignKey(ServiceCompany,
                                        on_delete=models.PROTECT,
                                        verbose_name='Сервисная компания',
                                        null=True,
                                        blank=True)

    class Meta:
        ordering = ('-shipment_date',)

    def __str__(self):
        return f'{self.model_technique}, зав.№ {self.serial_number}'


class Service(models.Model):
    type_of_service = models.ForeignKey(Reference,
                                        on_delete=models.PROTECT,
                                        related_name='services_type_of_service',
                                        verbose_name='Вид ТО',
                                        limit_choices_to={'entity_name': 'type_of_service'})
    service_date = models.DateField(verbose_name='Дата проведения ТО')
    mileage = models.DecimalField(max_digits=10,
                                  decimal_places=2,
                                  verbose_name='Наработка, м/час')
    work_order_number = models.CharField(max_length=255,
                                         verbose_name='№ заказ-наряда')
    work_order_date = models.DateField(verbose_name='Дата заказ-наряда')
    organization = models.ForeignKey(Reference,
                                     on_delete=models.PROTECT,
                                     related_name='services_organization',
                                     verbose_name='Организация, проводившая ТО',
                                     limit_choices_to={'entity_name': 'organization'})
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE,
                                related_name='services',
                                verbose_name='Машина')
    service_company = models.ForeignKey(ServiceCompany,
                                        on_delete=models.PROTECT,
                                        verbose_name='Сервисная компания')

    class Meta:
        ordering = ('-service_date',)

    def __str__(self):
        return f'{self.machine.__str__()} | {self.type_of_service}'


class Claim(models.Model):
    failure_date = models.DateField(verbose_name='Дата отказа')
    mileage = models.DecimalField(max_digits=10,
                                  decimal_places=2,
                                  verbose_name='Наработка, м/час')
    fault_node = models.ForeignKey(Reference,
                                   on_delete=models.PROTECT,
                                   related_name='claims_fault_node',
                                   verbose_name='Узел отказа',
                                   limit_choices_to={'entity_name': 'fault_node'})
    failure_description = models.TextField(verbose_name='Описание отказа')
    restoration_method = models.ForeignKey(Reference,
                                           on_delete=models.PROTECT,
                                           related_name='claims_restoration_method',
                                           verbose_name='Способ восстановления',
                                           limit_choices_to={'entity_name': 'restoration_method'})
    spare_parts_used = models.TextField(verbose_name='Используемые запасные части',
                                        blank=True,
                                        null=True)
    restoration_date = models.DateField(verbose_name='Дата восстановления')
    machine = models.ForeignKey(Machine,
                                on_delete=models.CASCADE,
                                related_name='claims',
                                verbose_name='Машина')
    service_company = models.ForeignKey(ServiceCompany,
                                        on_delete=models.PROTECT,
                                        verbose_name='Сервисная компания')

    class Meta:
        ordering = ('-failure_date',)

    def __str__(self):
        return f'Рекламация по {self.machine.__str__()}'

    @cached_property
    def downtime(self):
        if self.restoration_date and self.failure_date:
            return (self.restoration_date - self.failure_date).days
        return None
