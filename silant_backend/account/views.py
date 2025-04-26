from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample

from .models import Client, ServiceCompany
from .serializers import ClientSerializer, ServiceCompanySerializer, UserProfileSerializer
from .permissions import IsManager


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all().order_by('name')
    serializer_class = ClientSerializer
    permission_classes = [IsManager | IsAdminUser]


class ServiceCompanyViewSet(viewsets.ModelViewSet):
    queryset = ServiceCompany.objects.all().order_by('name')
    serializer_class = ServiceCompanySerializer
    permission_classes = [IsManager | IsAdminUser]


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Профиль пользователя",
        description="Получение данных профиля (клиент, сервисная компания или менеджер).",
        responses={
            200: UserProfileSerializer,
            401: OpenApiResponse(description="Требуется авторизация"),
        },
        examples=[
            OpenApiExample(
                "Пример ответа",
                value={
                    "id": 1,
                    "username": "user1",
                    "profile_type": "client",
                    "client": {
                        "name": "ООО Ромашка",
                        "description": "Клиент с 2020 года"
                    },
                    "service_company": None,
                    "manager": None
                },
                response_only=True,
            ),
        ],
    )
    def get(self, request):
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)

@extend_schema(
    summary="Получить пользователей без групп",
    description="Возвращает список пользователей, не принадлежащих ни к одной группе. Доступно только менеджерам и администраторам.",
    responses={
        200: OpenApiResponse(
            description="Успешный запрос",
            response={
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "integer"},
                        "username": {"type": "string"},
                    },
                },
            },
        ),
        403: OpenApiResponse(
            description="Доступ запрещен (требуются права менеджера или администратора)",
        ),
    },
)
@api_view(['GET'])
@permission_classes([IsManager | IsAdminUser])
def get_users_without_groups(request):
    users_without_groups = User.objects.filter(groups__isnull=True)
    user_data = [{'id': user.id, 'username': user.username} for user in users_without_groups]
    return Response(user_data)
