from django.contrib import admin
from .models import Client, ServiceCompany, Manager


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('user',)
    search_fields = ('user__username',)


@admin.register(ServiceCompany)
class ServiceCompanyAdmin(admin.ModelAdmin):
    list_display = ('user',)
    search_fields = ('user__username',)


@admin.register(Manager)
class ManagerAdmin(admin.ModelAdmin):
    list_display = ('user',)
    search_fields = ('user__username',)
