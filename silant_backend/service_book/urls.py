from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (MachineViewSet, ServiceViewSet, ClaimViewSet, ReferenceViewSet,
                    ReferencesForMachineAPIView, ReferencesForServiceAPIView, ReferencesForClaimAPIView)


router = DefaultRouter()
router.register(r'machines', MachineViewSet, basename='machines')
router.register(r'services', ServiceViewSet, basename='services')
router.register(r'claims', ClaimViewSet, basename='claims')
router.register(r'reference', ReferenceViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('references/machines/', ReferencesForMachineAPIView.as_view(), name='references_for_machines'),
    path('references/services/', ReferencesForServiceAPIView.as_view(), name='references_for_services'),
    path('references/claims/', ReferencesForClaimAPIView.as_view(), name='references_for_claims'),
]
