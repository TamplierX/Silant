from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Client, ServiceCompany, Manager
from drf_spectacular.utils import extend_schema_field
from typing import Optional, Dict, Any


User = get_user_model()


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'


class ServiceCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCompany
        fields = '__all__'


class ManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manager
        fields = '__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    client = serializers.SerializerMethodField()
    service_company = serializers.SerializerMethodField()
    manager = serializers.SerializerMethodField()
    profile_type = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'profile_type', 'client', 'service_company', 'manager']

    @extend_schema_field(ClientSerializer(many=False, required=False))
    def get_client(self, obj: User) -> Optional[Dict[str, Any]]:
        if hasattr(obj, 'client'):
            return ClientSerializer(obj.client).data
        return None

    @extend_schema_field(ServiceCompanySerializer(many=False, required=False))
    def get_service_company(self, obj: User) -> Optional[Dict[str, Any]]:
        if hasattr(obj, 'servicecompany'):
            return ServiceCompanySerializer(obj.servicecompany).data
        return None

    @extend_schema_field(ManagerSerializer(many=False, required=False))
    def get_manager(self, obj: User) -> Optional[Dict[str, Any]]:
        if hasattr(obj, 'manager'):
            return ManagerSerializer(obj.manager).data
        return None

    @extend_schema_field(serializers.CharField(allow_null=True))
    def get_profile_type(self, obj: User) -> Optional[str]:
        if hasattr(obj, 'client'):
            return 'client'
        elif hasattr(obj, 'servicecompany'):
            return 'service_company'
        elif hasattr(obj, 'manager'):
            return 'manager'
        return None
