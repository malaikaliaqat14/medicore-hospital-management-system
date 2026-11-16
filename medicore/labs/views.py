from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser
from users.permissions import IsClinicAdmin, IsDoctor, IsPatient
from .models import ExternalLab
from .serializers import LabReportSerializer

class LabReportViewSet(viewsets.ModelViewSet):
    serializer_class = LabReportSerializer
    parser_classes   = [MultiPartParser]

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'create', 'update', 'partial_update']:
            from users.permissions import IsDoctorOrPatient
            return [IsDoctorOrPatient()]
        return [IsClinicAdmin()]

    def get_queryset(self):
        qs = ExternalLab.objects.filter(clinic_id=self.request.clinic_id)
        if self.request.user.role == 'PATIENT':
            qs = qs.filter(patient=self.request.user)
        else:
            patient_id = self.request.query_params.get('patient')
            if patient_id:
                qs = qs.filter(patient_id=patient_id)
        return qs

    def perform_create(self, serializer):
        kwargs = {'clinic_id': self.request.clinic_id}
        if self.request.user.role == 'PATIENT':
            kwargs['patient'] = self.request.user
        serializer.save(**kwargs)
