from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from users.permissions import IsDoctorOrPatient
from appointments.models import Appointment
from appointments.serializers import AppointmentSerializer
from .models import Consultation
from .serializers import ConsultationSerializer

class ConsultationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsDoctorOrPatient]
    serializer_class   = ConsultationSerializer

    def get_queryset(self):
        qs = Consultation.objects.all().select_related('appointment__patient')
        if self.request.user.role == 'DOCTOR':
            return qs.filter(appointment__doctor__user=self.request.user)
        elif self.request.user.role == 'PATIENT':
            return qs.filter(appointment__patient=self.request.user)
        return qs.none()

    @action(detail=False, methods=['get'])
    def for_appointment(self, request):
        appt_id = request.query_params.get('appointment')
        if not appt_id:
            return Response({'error': 'appointment ID required'}, status=400)
            
        from django.shortcuts import get_object_or_404
        
        if request.user.role == 'DOCTOR':
            appt = get_object_or_404(Appointment, id=appt_id, doctor__user=request.user)
        else:
            appt = get_object_or_404(Appointment, id=appt_id, patient=request.user)
        
        consultation, created = Consultation.objects.get_or_create(
            appointment=appt,
            defaults={'clinic': appt.clinic}
        )
        return Response(self.get_serializer(consultation).data)

    @action(detail=False, methods=['get'])
    def patient_history(self, request):
        """Returns chronological past visits and clinical encounters for a patient across all visits."""
        patient_id = request.query_params.get('patient')
        if not patient_id:
            return Response({'error': 'patient ID required'}, status=400)

        if request.user.role == 'PATIENT' and str(request.user.id) != str(patient_id):
            return Response({'error': 'Unauthorized'}, status=403)

        from appointments.models import Appointment
        appts = Appointment.objects.filter(
            patient_id=patient_id
        ).select_related('doctor__user', 'clinic', 'patient').order_by('-scheduled_at')

        results = []
        for appt in appts:
            c = getattr(appt, 'consultation', None)
            results.append({
                'id': c.id if c else f'appt-{appt.id}',
                'appointment': appt.id,
                'patient_name': appt.patient.name,
                'patient_email': appt.patient.email,
                'doctor_name': appt.doctor.user.name,
                'scheduled_at': appt.scheduled_at,
                'token_number': appt.token_number,
                'appointment_status': appt.status,
                'vitals': c.vitals if c else {},
                'notes': c.notes if c else '',
                'prescription': c.prescription if c else '',
                'diagnosis': c.diagnosis if c else '',
                'lab_ordered': c.lab_ordered if c else False,
                'lab_test_details': c.lab_test_details if c else '',
                'created_at': c.created_at if c else appt.created_at,
                'has_consultation': c is not None,
            })
        return Response(results)

    @action(detail=False, methods=['get'])
    def queue(self, request):
        """Active appointments for the logged-in doctor."""
        appts = Appointment.objects.filter(
            doctor__user=request.user,
            status__in=['BOOKED', 'CHECK_IN', 'IN_PROGRESS']
        ).select_related('patient').order_by('scheduled_at')
        return Response(AppointmentSerializer(appts, many=True).data)
