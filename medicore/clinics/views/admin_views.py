from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from users.permissions import IsSuperAdmin
from ..models import Clinic, Doctor
from ..serializers import ClinicSerializer, DoctorSerializer
from users.models import User
from users.serializers import UserSerializer, RegisterSerializer
from appointments.models import Appointment

class ClinicViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSuperAdmin]
    queryset           = Clinic.objects.all()
    serializer_class   = ClinicSerializer

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        clinic = self.get_object()
        clinic.is_active = not clinic.is_active
        clinic.save()
        return Response({'is_active': clinic.is_active})

    @action(detail=True, methods=['get'])
    def doctors(self, request, pk=None):
        clinic = self.get_object()
        doctors = Doctor.objects.filter(clinic=clinic).select_related('user')
        data = []
        for d in doctors:
            total_patients = Appointment.objects.filter(doctor=d).values('patient').distinct().count()
            total_appointments = Appointment.objects.filter(doctor=d).count()
            data.append({
                'id': d.id,
                'user_id': d.user.id,
                'name': d.user.name,
                'email': d.user.email,
                'specialty': d.specialty,
                'registration_number': d.registration_number,
                'consultation_fee': str(d.consultation_fee),
                'schedule': d.schedule,
                'is_available': d.is_available,
                'created_at': d.created_at,
                'total_patients': total_patients,
                'total_appointments': total_appointments,
            })
        return Response(data)

    @action(detail=True, methods=['get'])
    def patients(self, request, pk=None):
        clinic = self.get_object()
        patient_ids = set(User.objects.filter(clinic=clinic, role='PATIENT').values_list('id', flat=True))
        appt_patient_ids = set(Appointment.objects.filter(clinic=clinic).values_list('patient_id', flat=True))
        all_patient_ids = patient_ids.union(appt_patient_ids)
        patients = User.objects.filter(id__in=all_patient_ids).order_by('-created_at')
        data = []
        for p in patients:
            total_appts = Appointment.objects.filter(clinic=clinic, patient=p).count()
            latest_appt = Appointment.objects.filter(clinic=clinic, patient=p).order_by('-scheduled_at').first()
            data.append({
                'id': p.id,
                'name': p.name,
                'email': p.email,
                'created_at': p.created_at,
                'is_active': p.is_active,
                'total_appointments': total_appts,
                'latest_appointment': latest_appt.scheduled_at if latest_appt else None,
                'latest_status': latest_appt.status if latest_appt else None,
            })
        return Response(data)

    @action(detail=True, methods=['get', 'post'])
    def admins(self, request, pk=None):
        clinic = self.get_object()
        if request.method == 'POST':
            name = request.data.get('name', '').strip()
            email = request.data.get('email', '').strip()
            password = request.data.get('password', '').strip()

            if not email:
                return Response({'email': ['Email is required.']}, status=status.HTTP_400_BAD_REQUEST)
            if not password or len(password) < 6:
                return Response({'password': ['Password must be at least 6 characters.']}, status=status.HTTP_400_BAD_REQUEST)
            if User.objects.filter(email=email).exists():
                return Response({'email': ['A user with this email already exists.']}, status=status.HTTP_400_BAD_REQUEST)

            admin_user = User.objects.create_user(
                email=email,
                name=name or f"{clinic.name} Admin",
                password=password,
                role='CLINIC_ADMIN',
                clinic=clinic
            )
            return Response({
                'id': admin_user.id,
                'name': admin_user.name,
                'email': admin_user.email,
                'is_active': admin_user.is_active,
                'created_at': admin_user.created_at,
                'message': 'Clinic Admin provisioned successfully.'
            }, status=status.HTTP_201_CREATED)

        admins = User.objects.filter(clinic=clinic, role='CLINIC_ADMIN').order_by('-created_at')
        data = [{
            'id': u.id,
            'name': u.name,
            'email': u.email,
            'is_active': u.is_active,
            'created_at': u.created_at,
        } for u in admins]
        return Response(data)

    @action(detail=True, methods=['post'], url_path='add-admin')
    def add_admin(self, request, pk=None):
        return self.admins(request, pk)

    @action(detail=False, methods=['get'], url_path='doctor-patients/(?P<doctor_id>[^/.]+)')
    def doctor_patients(self, request, doctor_id=None):
        doctor = get_object_or_404(Doctor.objects.select_related('user', 'clinic'), id=doctor_id)
        appointments = Appointment.objects.filter(doctor=doctor).select_related('patient', 'consultation').order_by('-scheduled_at')

        appts_data = []
        for a in appointments:
            diagnosis = ''
            notes = a.notes or ''
            if hasattr(a, 'consultation') and a.consultation:
                diagnosis = a.consultation.diagnosis or ''
                if a.consultation.notes:
                    notes = a.consultation.notes
            appts_data.append({
                'appointment_id': a.id,
                'patient_id': a.patient.id,
                'patient_name': a.patient.name,
                'patient_email': a.patient.email,
                'scheduled_at': a.scheduled_at,
                'token_number': a.token_number,
                'status': a.status,
                'notes': notes,
                'diagnosis': diagnosis,
                'created_at': a.created_at,
            })

        # Distinct patient summary
        unique_patients_map = {}
        for item in appts_data:
            pid = item['patient_id']
            if pid not in unique_patients_map:
                unique_patients_map[pid] = {
                    'patient_id': pid,
                    'patient_name': item['patient_name'],
                    'patient_email': item['patient_email'],
                    'total_visits': 0,
                    'latest_visit': item['scheduled_at'],
                    'latest_status': item['status'],
                    'latest_diagnosis': item['diagnosis'],
                }
            unique_patients_map[pid]['total_visits'] += 1

        return Response({
            'doctor': {
                'id': doctor.id,
                'name': doctor.user.name,
                'email': doctor.user.email,
                'specialty': doctor.specialty,
                'registration_number': doctor.registration_number,
                'consultation_fee': str(doctor.consultation_fee),
                'clinic_id': doctor.clinic.id,
                'clinic_name': doctor.clinic.name,
                'is_available': doctor.is_available,
                'schedule': doctor.schedule,
            },
            'unique_patients': list(unique_patients_map.values()),
            'appointments': appts_data,
        })

class AdminUserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSuperAdmin]
    queryset           = User.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return RegisterSerializer
        return UserSerializer
