from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views.admin_views import ClinicViewSet, AdminUserViewSet

router = DefaultRouter()
router.register('clinics', ClinicViewSet, basename='admin-clinic')
router.register('users',   AdminUserViewSet, basename='admin-user')

urlpatterns = [path('', include(router.urls))]
