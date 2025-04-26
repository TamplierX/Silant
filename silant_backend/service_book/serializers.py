from rest_framework import serializers
from .models import Reference, Machine, Service, Claim


class ReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reference
        fields = '__all__'


class MachineSerializer(serializers.ModelSerializer):
    model_technique_name = serializers.ReadOnlyField(source='model_technique.name')
    model_technique_description = serializers.ReadOnlyField(source='model_technique.description')
    engine_model_name = serializers.ReadOnlyField(source='engine_model.name')
    engine_model_description = serializers.ReadOnlyField(source='engine_model.description')
    transmission_model_name = serializers.ReadOnlyField(source='transmission_model.name')
    transmission_model_description = serializers.ReadOnlyField(source='transmission_model.description')
    driving_bridge_model_name = serializers.ReadOnlyField(source='driving_bridge_model.name')
    driving_bridge_model_description = serializers.ReadOnlyField(source='driving_bridge_model.description')
    controlled_bridge_model_name = serializers.ReadOnlyField(source='controlled_bridge_model.name')
    controlled_bridge_model_description = serializers.ReadOnlyField(source='controlled_bridge_model.description')
    client_name = serializers.ReadOnlyField(source='client.name')
    service_company_name = serializers.ReadOnlyField(source='service_company.name')
    service_company_description = serializers.ReadOnlyField(source='service_company.description')

    class Meta:
        model = Machine
        fields = '__all__'
        read_only_fields = ['model_technique_name', 'model_technique_description', 'engine_model_name',
                            'engine_model_description', 'transmission_model_name', 'transmission_model_description',
                            'driving_bridge_model_name', 'driving_bridge_model_description',
                            'controlled_bridge_model_name', 'controlled_bridge_model_description', 'client_name',
                            'service_company_name', 'service_company_description']
        extra_kwargs = {
            'supply_contract': {'allow_null': True},
            'recipient': {'allow_null': True},
            'delivery_address': {'allow_null': True},
            'client': {'allow_null': True},
            'service_company': {'allow_null': True}
        }

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            # Ограничиваем поля для неавторизованных пользователей
            limited_fields = ['serial_number', 'model_technique_name', 'model_technique_description',
                              'engine_model_name', 'engine_model_description', 'engine_serial_number',
                              'transmission_model_name', 'transmission_model_description', 'transmission_serial_number',
                              'driving_bridge_model_name', 'driving_bridge_model_description',
                              'driving_bridge_serial_number', 'controlled_bridge_model_name',
                              'controlled_bridge_model_description', 'controlled_bridge_serial_number',
                              'model_technique', 'engine_model', 'transmission_model',
                              'driving_bridge_model', 'controlled_bridge_model'
                              ]
            for field in set(representation.keys()) - set(limited_fields):
                del representation[field]
        else:
            user = request.user
            is_related = False

            if hasattr(user, 'client') and instance.client and user.client == instance.client:
                is_related = True

            if (hasattr(user, 'servicecompany') and instance.service_company and
                    user.servicecompany == instance.service_company):
                is_related = True

            is_manager = hasattr(user, 'manager')

            if not (is_related or is_manager or user.is_staff or user.is_superuser):
                limited_fields = ['serial_number', 'model_technique_name', 'model_technique_description',
                                  'engine_model_name', 'engine_model_description', 'engine_serial_number',
                                  'transmission_model_name', 'transmission_model_description',
                                  'transmission_serial_number',
                                  'driving_bridge_model_name', 'driving_bridge_model_description',
                                  'driving_bridge_serial_number', 'controlled_bridge_model_name',
                                  'controlled_bridge_model_description', 'controlled_bridge_serial_number',
                                  'model_technique', 'engine_model', 'transmission_model',
                                  'driving_bridge_model', 'controlled_bridge_model'
                                  ]
                for field in set(representation.keys()) - set(limited_fields):
                    del representation[field]
        return representation


class ServiceSerializer(serializers.ModelSerializer):
    type_of_service_name = serializers.ReadOnlyField(source='type_of_service.name')
    type_of_service_description = serializers.ReadOnlyField(source='type_of_service.description')
    organization_name = serializers.ReadOnlyField(source='organization.name')
    organization_description = serializers.ReadOnlyField(source='organization.description')
    machine_model_technique_name = serializers.ReadOnlyField(source='machine.model_technique.name')
    machine_serial_number = serializers.ReadOnlyField(source='machine.serial_number')
    service_company_name = serializers.ReadOnlyField(source='service_company.name')

    class Meta:
        model = Service
        fields = '__all__'
        read_only_fields = ['type_of_service_name', 'organization_name', 'machine_serial_number',
                            'machine_model_technique_name', 'service_company_name']


class ClaimSerializer(serializers.ModelSerializer):
    fault_node_name = serializers.ReadOnlyField(source='fault_node.name')
    fault_node_description = serializers.ReadOnlyField(source='fault_node.description')
    restoration_method_name = serializers.ReadOnlyField(source='restoration_method.name')
    restoration_method_description = serializers.ReadOnlyField(source='restoration_method.description')
    machine_model_technique_name = serializers.ReadOnlyField(source='machine.model_technique.name')
    machine_serial_number = serializers.ReadOnlyField(source='machine.serial_number')
    service_company_name = serializers.ReadOnlyField(source='service_company.name')
    downtime = serializers.IntegerField(read_only=True)

    class Meta:
        model = Claim
        fields = [
            'id',
            'failure_date',
            'mileage',
            'fault_node',
            'failure_description',
            'restoration_method',
            'spare_parts_used',
            'restoration_date',
            'machine',
            'service_company',
            'downtime',
            'fault_node_name',
            'fault_node_description',
            'restoration_method_name',
            'restoration_method_description',
            'machine_model_technique_name',
            'machine_serial_number',
            'service_company_name'
        ]
        read_only_fields = ['fault_node_name', 'fault_node_description', 'restoration_method_name',
                            'restoration_method_description',  'machine_model_technique_name', 'machine_serial_number',
                            'service_company_name', 'downtime']
