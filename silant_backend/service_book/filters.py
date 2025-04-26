from django_filters import FilterSet
from django_filters.fields import ModelChoiceField
from .models import Machine, Service, Claim


class MachineFilter(FilterSet):
    class Meta:
        model = Machine
        fields = {
            'model_technique': ['exact'],
            'engine_model': ['exact'],
            'transmission_model': ['exact'],
            'driving_bridge_model': ['exact'],
            'controlled_bridge_model': ['exact'],
            'shipment_date': ['gte', 'lte'],
            'client': ['exact'],
            'service_company': ['exact'],
        }
        filter_overrides = {
            ModelChoiceField: {
                'extra': lambda f: {
                    'lookup_expr': 'exact',
                },
            },
        }


class ServiceFilter(FilterSet):
    class Meta:
        model = Service
        fields = {
            'type_of_service': ['exact'],
            'service_date': ['gte', 'lte'],
            'machine': ['exact'],
            'service_company': ['exact'],
        }
        filter_overrides = {
            ModelChoiceField: {
                'extra': lambda f: {
                    'lookup_expr': 'exact',
                },
            },
        }


class ClaimFilter(FilterSet):
    class Meta:
        model = Claim
        fields = {
            'fault_node': ['exact'],
            'restoration_method': ['exact'],
            'failure_date': ['gte', 'lte'],
            'machine': ['exact'],
            'service_company': ['exact'],
        }
        filter_overrides = {
            ModelChoiceField: {
                'extra': lambda f: {
                    'lookup_expr': 'exact',
                },
            },
        }
