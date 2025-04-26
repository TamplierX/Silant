from django.contrib import admin
from .models import Reference, Machine, Service, Claim


@admin.register(Reference)
class ReferenceAdmin(admin.ModelAdmin):
    list_display = ('entity_name', 'name', 'description')
    search_fields = ('entity_name', 'name', 'description')
    list_filter = ('entity_name',)


@admin.register(Machine)
class MachineAdmin(admin.ModelAdmin):
    list_display = ('serial_number', 'model_technique', 'client', 'service_company')
    search_fields = ('serial_number', 'model_technique__name',
                     'client__user__username', 'service_company__user__username')
    list_filter = ('model_technique', 'client', 'service_company')


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('type_of_service', 'service_date', 'mileage', 'work_order_number',
                    'organization', 'machine', 'service_company')
    search_fields = ('type_of_service__name', 'work_order_number', 'organization__name',
                     'machine__serial_number', 'service_company__user__username')
    list_filter = ('type_of_service', 'organization', 'machine', 'service_company')


@admin.register(Claim)
class ClaimAdmin(admin.ModelAdmin):
    list_display = ('failure_date', 'mileage', 'fault_node', 'restoration_date',
                    'downtime', 'machine', 'service_company')
    search_fields = ('fault_node__name', 'machine__serial_number', 'service_company__user__username')
    list_filter = ('fault_node', 'restoration_method', 'machine', 'service_company')
    readonly_fields = ('downtime',)
