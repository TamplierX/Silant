from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import Group
from .models import Client, ServiceCompany, Manager


@receiver(post_save, sender=Client)
def add_client_to_group(sender, instance, created, **kwargs):
    if created:
        client_group, _ = Group.objects.get_or_create(name='Клиент')
        instance.user.groups.add(client_group)


@receiver(post_save, sender=ServiceCompany)
def add_service_company_to_group(sender, instance, created, **kwargs):
    if created:
        service_company_group, _ = Group.objects.get_or_create(name='Сервисная организация')
        instance.user.groups.add(service_company_group)


@receiver(post_save, sender=Manager)
def add_manager_to_group(sender, instance, created, **kwargs):
    if created:
        manager_group, _ = Group.objects.get_or_create(name='Менеджер')
        instance.user.groups.add(manager_group)

