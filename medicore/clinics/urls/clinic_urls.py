from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views.clinic_views import (
    ClinicDoctorViewSet,
    ClinicPatientViewSet,
    ClinicReceptionistViewSet,
    ClinicAnalyticsView,
    ClinicDirectoryView
)

router = DefaultRouter()
router.register('doctors', ClinicDoctorViewSet, basename='clinic-doctor')
router.register('patients', ClinicPatientViewSet, basename='clinic-patient')
router.register('receptionists', ClinicReceptionistViewSet, basename='clinic-receptionist')

urlpatterns = [
    path('directory/', ClinicDirectoryView.as_view(), name='clinic-directory'),
    path('analytics/', ClinicAnalyticsView.as_view(), name='clinic-analytics'),
    path('', include(router.urls))
]
