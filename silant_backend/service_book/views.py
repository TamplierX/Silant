from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiParameter, inline_serializer, OpenApiResponse, OpenApiExample
from rest_framework import serializers

from .models import Machine, Service, Claim, Reference
from .serializers import MachineSerializer, ServiceSerializer, ClaimSerializer, ReferenceSerializer
from .filters import MachineFilter, ServiceFilter, ClaimFilter
from account.permissions import IsAuthenticatedOrReadOnlyLimited, IsServiceCompany, IsManager
from account.models import Client, ServiceCompany
from account.serializers import ClientSerializer, ServiceCompanySerializer


class MachineViewSet(viewsets.ModelViewSet):
    serializer_class = MachineSerializer
    filterset_class = MachineFilter
    lookup_field = 'serial_number'

    def get_queryset(self):
        queryset = Machine.objects.all().order_by('-shipment_date')
        user = self.request.user
        if self.action == 'retrieve':
            queryset = Machine.objects.all()
        elif user.groups.filter(name='Клиент').exists():
            queryset = queryset.filter(client__user=user)
        elif user.groups.filter(name='Сервисная организация').exists():
            queryset = queryset.filter(service_company__user=user)
        return queryset

    def get_permissions(self):
        if self.action == 'retrieve':
            permission_classes = [IsAuthenticatedOrReadOnlyLimited]
        elif self.action == 'list':
            permission_classes = [IsAuthenticated]
        elif self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsManager | IsAdminUser]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]


class ReferencesForMachineAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Получение справочных данных для машин",
        description="Возвращает все необходимые справочные данные для работы с машинами. "
                    "Включает модели техники, двигателей, трансмиссий, мостов, а также список клиентов и сервисных компаний.",
        responses={
            200: OpenApiResponse(
                response={
                    "type": "object",
                    "properties": {
                        "model_technique": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/Reference"
                            },
                            "description": "Модели техники"
                        },
                        "engine_model": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/Reference"
                            },
                            "description": "Модели двигателей"
                        },
                        "transmission_model": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/Reference"
                            },
                            "description": "Модели трансмиссий"
                        },
                        "driving_bridge_model": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/Reference"
                            },
                            "description": "Модели ведущих мостов"
                        },
                        "controlled_bridge_model": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/Reference"
                            },
                            "description": "Модели управляемых мостов"
                        },
                        "client": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/Client"
                            },
                            "description": "Список клиентов"
                        },
                        "service_company": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/ServiceCompany"
                            },
                            "description": "Список сервисных компаний"
                        }
                    }
                },
                description="Успешный ответ со справочными данными",
                examples=[
                    OpenApiExample(
                        "Пример успешного ответа",
                        value={
                            "model_technique": [
                                {"id": 1, "name": "Трактор X", "description": "Модель 2023 года"}
                            ],
                            "engine_model": [
                                {"id": 1, "name": "Дизель 4.4L", "description": "Турбированный"}
                            ],
                            "transmission_model": [
                                {"id": 1, "name": "Автомат 6-ст", "description": "6-ступенчатый автомат"}
                            ],
                            "driving_bridge_model": [
                                {"id": 1, "name": "Мост 123", "description": "Полноприводный"}
                            ],
                            "controlled_bridge_model": [
                                {"id": 1, "name": "Мост 456", "description": "Управляемый"}
                            ],
                            "client": [
                                {"id": 1, "name": "ООО Агротех", "description": "Сельхозпредприятие"}
                            ],
                            "service_company": [
                                {"id": 1, "name": "Сервис Центр", "description": "Официальный дилер"}
                            ]
                        }
                    )
                ]
            ),
            401: OpenApiResponse(
                description="Пользователь не авторизован",
                examples=[
                    OpenApiExample(
                        "Пример ошибки",
                        value={"detail": "Учетные данные не были предоставлены."}
                    )
                ]
            ),
            403: OpenApiResponse(
                description="Доступ запрещен"
            )
        },
    )
    def get(self, request):
        references = {
            'model_technique': Reference.objects.filter(entity_name='model_technique'),
            'engine_model': Reference.objects.filter(entity_name='engine_model'),
            'transmission_model': Reference.objects.filter(entity_name='transmission_model'),
            'driving_bridge_model': Reference.objects.filter(entity_name='driving_bridge_model'),
            'controlled_bridge_model': Reference.objects.filter(entity_name='controlled_bridge_model'),
            'client': Client.objects.all(),
            'service_company': ServiceCompany.objects.all()
        }

        serialized_data = {
            'model_technique': ReferenceSerializer(references['model_technique'], many=True).data,
            'engine_model': ReferenceSerializer(references['engine_model'], many=True).data,
            'transmission_model': ReferenceSerializer(references['transmission_model'], many=True).data,
            'driving_bridge_model': ReferenceSerializer(references['driving_bridge_model'], many=True).data,
            'controlled_bridge_model': ReferenceSerializer(references['controlled_bridge_model'], many=True).data,
            'client': ClientSerializer(references['client'], many=True).data,
            'service_company': ServiceCompanySerializer(references['service_company'], many=True).data
        }

        return Response(serialized_data, status=status.HTTP_200_OK)


class ServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer
    filterset_class = ServiceFilter

    def get_queryset(self):
        queryset = Service.objects.all().order_by('-service_date')
        user = self.request.user
        if user.is_authenticated:
            if user.groups.filter(name='Клиент').exists():
                queryset = queryset.filter(machine__client__user=user)
            elif user.groups.filter(name='Сервисная организация').exists():
                queryset = queryset.filter(machine__service_company__user=user)
        return queryset

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'create', 'update', 'partial_update']:
            permission_classes = [IsAuthenticated]
        elif self.action == 'destroy':
            permission_classes = [IsManager | IsAdminUser]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]


class ReferencesForServiceAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Получение справочных данных для ТО",
        description="Возвращает справочные данные, необходимые для работы с ТО. "
                    "Клиенты получают только свои машины и связанные сервисные компании. "
                    "Сервисные компании получают только свои машины и организации.",
        responses={
            200: OpenApiResponse(
                response={
                    "type": "object",
                    "properties": {
                        "type_of_service": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/Reference"
                            }
                        },
                        "organization": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/Reference"
                            }
                        },
                        "machine": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/Machine"
                            }
                        },
                        "service_company": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/ServiceCompany"
                            }
                        }
                    }
                },
                description="Успешный ответ со справочными данными",
                examples=[
                    OpenApiExample(
                        "Пример ответа для клиента",
                        value={
                            "type_of_service": [
                                {"id": 1, "name": "ТО-1", "description": "Первое техническое обслуживание"}
                            ],
                            "organization": [
                                {"id": 1, "name": "Сервисный центр 1", "description": "Официальный сервис"}
                            ],
                            "machine": [
                                {"serial_number": "MACH001", "model_technique": {"id": 1, "name": "Модель X"}}
                            ],
                            "service_company": [
                                {"id": 1, "name": "Сервисная компания А"}
                            ]
                        }
                    )
                ]
            ),
            401: OpenApiResponse(
                description="Пользователь не авторизован"
            ),
            403: OpenApiResponse(
                description="Доступ запрещен"
            )
        },
    )
    def get(self, request):
        user = request.user
        references = {
            'type_of_service': Reference.objects.filter(entity_name='type_of_service'),
            'organization': Reference.objects.filter(entity_name='organization'),
        }

        if user.groups.filter(name='Клиент').exists():
            references['machine'] = Machine.objects.filter(client__user=user)
            references['service_company'] = ServiceCompany.objects.filter(
                id__in=references['machine'].values('service_company')
            )
        elif user.groups.filter(name='Сервисная организация').exists():
            references['service_company'] = ServiceCompany.objects.filter(user=user)
            references['machine'] = Machine.objects.filter(
                service_company__in=references['service_company']
            )
        else:
            references['machine'] = Machine.objects.all()
            references['service_company'] = ServiceCompany.objects.all()

        serialized_data = {
            'type_of_service': ReferenceSerializer(references['type_of_service'], many=True).data,
            'organization': ReferenceSerializer(references['organization'], many=True).data,
            'machine': MachineSerializer(references['machine'], many=True, context={'request': request}).data,
            'service_company': ServiceCompanySerializer(references['service_company'], many=True).data
        }

        return Response(serialized_data, status=status.HTTP_200_OK)


class ClaimViewSet(viewsets.ModelViewSet):
    serializer_class = ClaimSerializer
    filterset_class = ClaimFilter

    def get_queryset(self):
        queryset = Claim.objects.all().order_by('-failure_date')
        user = self.request.user
        if user.is_authenticated:
            if user.groups.filter(name='Клиент').exists():
                queryset = queryset.filter(machine__client__user=user)
            elif user.groups.filter(name='Сервисная организация').exists():
                queryset = queryset.filter(machine__service_company__user=user)
        return queryset

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticated]
        elif self.action in ['create', 'update', 'partial_update']:
            permission_classes = [IsServiceCompany | IsManager | IsAdminUser]
        elif self.action == 'destroy':
            permission_classes = [IsManager | IsAdminUser]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]


class ReferencesForClaimAPIView(APIView):
    @extend_schema(
        summary="Получение справочных данных для рекламаций",
        description="Возвращает все необходимые справочные данные для работы с рекламациями. "
                    "Включает узлы отказа, методы восстановления, список машин и сервисных компаний.",
        responses={
            200: OpenApiResponse(
                response={
                    "type": "object",
                    "properties": {
                        "fault_node": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/Reference"
                            },
                            "description": "Список возможных узлов отказа"
                        },
                        "restoration_method": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/Reference"
                            },
                            "description": "Список методов восстановления"
                        },
                        "machine": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/Machine"
                            },
                            "description": "Список машин"
                        },
                        "service_company": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/ServiceCompany"
                            },
                            "description": "Список сервисных компаний"
                        }
                    }
                },
                description="Успешный ответ со справочными данными",
                examples=[
                    OpenApiExample(
                        "Пример успешного ответа",
                        value={
                            "fault_node": [
                                {"id": 1, "name": "Двигатель", "description": "Проблемы с двигателем"},
                                {"id": 2, "name": "Трансмиссия", "description": "Проблемы с коробкой передач"}
                            ],
                            "restoration_method": [
                                {"id": 1, "name": "Ремонт", "description": "Локальный ремонт"},
                                {"id": 2, "name": "Замена", "description": "Полная замена узла"}
                            ],
                            "machine": [
                                {"serial_number": "MACH001", "model_technique": {"id": 1, "name": "Модель X"}}
                            ],
                            "service_company": [
                                {"id": 1, "name": "ТехСервис", "description": "Официальный сервисный центр"}
                            ]
                        },
                        response_only=True
                    )
                ]
            ),
            401: OpenApiResponse(
                description="Пользователь не авторизован",
                examples=[
                    OpenApiExample(
                        "Пример ошибки аутентификации",
                        value={"detail": "Учетные данные не были предоставлены."},
                        status_codes=['401']
                    )
                ]
            ),
            403: OpenApiResponse(
                description="Доступ запрещен",
                examples=[
                    OpenApiExample(
                        "Пример ошибки доступа",
                        value={"detail": "У вас нет прав доступа к этому ресурсу."},
                        status_codes=['403']
                    )
                ]
            )
        },
    )
    def get(self, request):
        references = {
            'fault_node': Reference.objects.filter(entity_name='fault_node'),
            'restoration_method': Reference.objects.filter(entity_name='restoration_method'),
            'machine': Machine.objects.all(),
            'service_company': ServiceCompany.objects.all()
        }

        serialized_data = {
            'fault_node': ReferenceSerializer(references['fault_node'], many=True).data,
            'restoration_method': ReferenceSerializer(references['restoration_method'], many=True).data,
            'machine': MachineSerializer(references['machine'], many=True, context={'request': request}).data,
            'service_company': ServiceCompanySerializer(references['service_company'], many=True).data
        }

        return Response(serialized_data, status=status.HTTP_200_OK)

    def get_permissions(self):
        permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]


class ReferenceViewSet(viewsets.ModelViewSet):
    queryset = Reference.objects.all()
    serializer_class = ReferenceSerializer

    def get_permissions(self):
        if self.action == 'retrieve':
            permission_classes = [IsAuthenticatedOrReadOnlyLimited]
        elif self.action in ['list', 'create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsManager | IsAdminUser]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]
