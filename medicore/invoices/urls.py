from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DigitalInvoiceViewSet

router = DefaultRouter()
router.register('invoices', DigitalInvoiceViewSet, basename='invoice')

urlpatterns = [path('', include(router.urls))]
