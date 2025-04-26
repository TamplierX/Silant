from rest_framework import permissions


class IsAuthenticatedOrReadOnlyLimited(permissions.BasePermission):
    """
    Позволяет всем пользователям выполнять безопасные запросы.
    Пользователи без авторизации могут видеть только ограниченные поля в конкретной модели.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated


class IsServiceCompany(permissions.BasePermission):
    """
    Позволяет сервисным организациям выполнять безопасные запросы, создавать и редактировать данные.
    """
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return request.user.groups.filter(name='Сервисная организация').exists()
        return False


class IsManager(permissions.BasePermission):
    """
    Позволяет менеджерам выполнять любые действия.
    """
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return request.user.groups.filter(name='Менеджер').exists()
        return False
