from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet, ServiceCompanyViewSet, UserProfileView, get_users_without_groups
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


router = DefaultRouter()
router.register(r'client', ClientViewSet)
router.register(r'service_company', ServiceCompanyViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('users/', get_users_without_groups, name='users-without-groups')
]
