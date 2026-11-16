from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import DigitalInvoice
from .serializers import DigitalInvoiceSerializer

class DigitalInvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = DigitalInvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = DigitalInvoice.objects.select_related(
            'consultation__appointment__patient',
            'consultation__appointment__doctor__user'
        )
        clinic_id = getattr(self.request, 'clinic_id', None) or self.request.user.clinic_id
        if clinic_id:
            qs = qs.filter(clinic_id=clinic_id)

        if getattr(self.request.user, 'role', None) == 'PATIENT':
            qs = qs.filter(consultation__appointment__patient=self.request.user)
        elif getattr(self.request.user, 'role', None) == 'DOCTOR':
            qs = qs.filter(consultation__appointment__doctor__user=self.request.user)
        return qs
