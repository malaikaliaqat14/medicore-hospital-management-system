from rest_framework import viewsets
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from users.permissions import IsClinicAdmin
from ..models import Clinic, Doctor
from ..serializers import (
    ClinicSerializer,
    DoctorSerializer,
    ClinicDoctorCreateSerializer,
    ClinicReceptionistCreateSerializer
)

class ClinicDirectoryView(ListAPIView):
    """Public / Authenticated directory of clinics for patient discovery and booking."""
    permission_classes = [AllowAny]
    serializer_class = ClinicSerializer
    queryset = Clinic.objects.filter(is_active=True).order_by('name')

class ClinicDoctorViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsClinicAdmin()]

    def get_serializer_class(self):
        if self.action == 'create':
            return ClinicDoctorCreateSerializer
        return DoctorSerializer

    def get_queryset(self):
        clinic_id = (
            self.request.query_params.get('clinic_id') or
            getattr(self.request, 'clinic_id', None) or
            getattr(self.request.user, 'clinic_id', None)
        )
        if clinic_id:
            return Doctor.objects.filter(clinic_id=clinic_id).select_related('user', 'clinic')
        return Doctor.objects.all().select_related('user', 'clinic')

from users.models import User
from users.serializers import UserSerializer

class ClinicPatientViewSet(viewsets.ModelViewSet):
    permission_classes = [IsClinicAdmin]

    def get_serializer_class(self):
        if self.action == 'create':
            from ..serializers import ClinicPatientCreateSerializer
            return ClinicPatientCreateSerializer
        return UserSerializer

    from rest_framework.decorators import action
    from rest_framework.response import Response

    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        patient = self.get_object()
        from consultations.models import Consultation
        from consultations.serializers import ConsultationSerializer
        consultations = Consultation.objects.filter(appointment__patient=patient).order_by('-created_at')
        return Response(ConsultationSerializer(consultations, many=True).data)

    def get_queryset(self):
        return User.objects.filter(clinic_id=self.request.clinic_id, role='PATIENT')

class ClinicReceptionistViewSet(viewsets.ModelViewSet):
    permission_classes = [IsClinicAdmin]

    def get_serializer_class(self):
        if self.action == 'create':
            return ClinicReceptionistCreateSerializer
        return UserSerializer

    def get_queryset(self):
        return User.objects.filter(clinic_id=self.request.clinic_id, role='RECEPTIONIST')

from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count

class ClinicAnalyticsView(APIView):
    permission_classes = [IsClinicAdmin]

    def get(self, request):
        clinic = request.clinic_id
        from invoices.models import DigitalInvoice
        from consultations.models import Consultation
        from django.utils import timezone
        
        now = timezone.now()
        monthly_earnings = []
        for i in range(5, -1, -1):
            m = now.month - i
            y = now.year
            if m <= 0:
                m += 12
                y -= 1
            total = DigitalInvoice.objects.filter(clinic_id=clinic, created_at__year=y, created_at__month=m).aggregate(total=Sum('total'))['total'] or 0
            monthly_earnings.append({'month': f"{y}-{m:02d}", 'revenue': total})

        doctor_revenue = []
        for doc in Doctor.objects.filter(clinic_id=clinic):
            total = DigitalInvoice.objects.filter(clinic_id=clinic, consultation__appointment__doctor=doc).aggregate(total=Sum('total'))['total'] or 0
            doctor_revenue.append({'doctor': doc.user.name, 'revenue': total})
            
        diseases = Consultation.objects.filter(clinic_id=clinic).exclude(diagnosis='').values('diagnosis').annotate(count=Count('id')).order_by('-count')[:10]
        
        return Response({
            'monthly_earnings': monthly_earnings,
            'doctor_revenue': doctor_revenue,
            'diseases': list(diseases)
        })
