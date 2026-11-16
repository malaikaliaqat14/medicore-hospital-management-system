from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsClinicAdmin, IsPatient, IsClinicAdminOrReceptionist
from .models import Appointment
from .serializers import AppointmentSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'create', 'set_status', 'walkin_intake']:
            return [IsAuthenticated()]
        return [IsClinicAdminOrReceptionist()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Appointment.objects.none()

        if user.role == 'PATIENT':
            return Appointment.objects.filter(patient=user).select_related('patient', 'doctor__user', 'clinic').order_by('-scheduled_at')

        if user.role == 'DOCTOR':
            return Appointment.objects.filter(doctor__user=user).select_related('patient', 'doctor__user', 'clinic').order_by('scheduled_at')

        if user.role == 'SUPER_ADMIN':
            return Appointment.objects.all().select_related('patient', 'doctor__user', 'clinic').order_by('-scheduled_at')

        # Clinic Admin or Receptionist
        clinic_id = getattr(self.request, 'clinic_id', None) or user.clinic_id
        if clinic_id:
            return Appointment.objects.filter(clinic_id=clinic_id).select_related('patient', 'doctor__user', 'clinic').order_by('-scheduled_at')
        return Appointment.objects.none()

    def perform_create(self, serializer):
        from django.db.models import Max
        import datetime

        doctor = serializer.validated_data.get('doctor')
        clinic_id = (
            self.request.data.get('clinic') or
            (doctor.clinic_id if doctor else None) or
            getattr(self.request, 'clinic_id', None) or
            getattr(self.request.user, 'clinic_id', None)
        )

        kwargs = {'clinic_id': clinic_id}
        if self.request.user.role == 'PATIENT':
            kwargs['patient'] = self.request.user
        elif 'patient' not in serializer.validated_data and 'patient' in self.request.data:
            from users.models import User
            kwargs['patient_id'] = self.request.data['patient']

        # Auto-generate token number for the doctor on that day
        scheduled_at = serializer.validated_data.get('scheduled_at')
        if scheduled_at and doctor:
            start_of_day = scheduled_at.replace(hour=0, minute=0, second=0, microsecond=0)
            end_of_day = start_of_day + datetime.timedelta(days=1)

            max_token = Appointment.objects.filter(
                doctor=doctor,
                scheduled_at__gte=start_of_day,
                scheduled_at__lt=end_of_day
            ).aggregate(Max('token_number'))['token_number__max']

            kwargs['token_number'] = (max_token or 0) + 1

        serializer.save(**kwargs)

    @action(detail=False, methods=['post'], url_path='walkin-intake')
    def walkin_intake(self, request):
        """Ultra-fast atomic walk-in intake used by receptionists or clinic staff."""
        from django.db import transaction
        from django.utils import timezone
        from django.db.models import Max
        import datetime
        from users.models import User
        from clinics.models import Doctor

        name = request.data.get('patient_name', '').strip()
        phone = request.data.get('patient_phone', '').strip()
        doctor_id = request.data.get('doctor_id')
        notes = request.data.get('notes', '').strip()

        if not name:
            return Response({'error': 'Patient name is required.'}, status=400)
        if not doctor_id:
            return Response({'error': 'Doctor selection is required.'}, status=400)

        doctor = Doctor.objects.filter(id=doctor_id).first()
        if not doctor:
            return Response({'error': 'Selected doctor does not exist.'}, status=404)

        clinic_id = getattr(request, 'clinic_id', None) or getattr(request.user, 'clinic_id', None) or doctor.clinic_id

        with transaction.atomic():
            import secrets
            import uuid
            clean_phone = ''.join(c for c in phone if c.isdigit())
            email = request.data.get('patient_email', '').strip()
            # Generate a unique auto-generated password for each patient (e.g. Pass8392)
            unique_password = f"Pass{secrets.randbelow(9000) + 1000}"

            # Search existing patient by phone or email
            patient = None
            if clean_phone:
                patient = User.objects.filter(phone=clean_phone).first()
                if not patient:
                    patient = User.objects.filter(email=f"{clean_phone}@patient.medicore").first()
                if not patient:
                    patient = User.objects.filter(email=f"p_{clean_phone}@walkin.local").first()
            if not patient and email:
                patient = User.objects.filter(email__iexact=email).first()

            is_new_patient = False
            if not patient:
                is_new_patient = True
                auto_email = email if email else (f"{clean_phone}@patient.medicore" if clean_phone else f"walkin_{uuid.uuid4().hex[:8]}@walkin.local")
                patient = User.objects.create_user(
                    email=auto_email,
                    phone=clean_phone,
                    name=name,
                    password=unique_password,
                    role='PATIENT',
                    clinic_id=clinic_id
                )
            else:
                updated = False
                if name and patient.name != name:
                    patient.name = name
                    updated = True
                if clean_phone and not patient.phone:
                    patient.phone = clean_phone
                    updated = True
                if request.data.get('reset_password'):
                    patient.set_password(unique_password)
                    updated = True
                if updated:
                    patient.save()

            now = timezone.now()
            start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
            end_of_day = start_of_day + datetime.timedelta(days=1)

            max_token = Appointment.objects.filter(
                doctor=doctor,
                scheduled_at__gte=start_of_day,
                scheduled_at__lt=end_of_day
            ).aggregate(Max('token_number'))['token_number__max']

            token_number = (max_token or 0) + 1

            combined_notes = []
            if phone:
                combined_notes.append(f"Phone: {phone}")
            if notes:
                combined_notes.append(notes)

            appt = Appointment.objects.create(
                clinic_id=clinic_id,
                patient=patient,
                doctor=doctor,
                scheduled_at=now,
                status='CHECK_IN',
                token_number=token_number,
                notes=' | '.join(combined_notes)
            )

            data = AppointmentSerializer(appt).data
            data['login_id'] = clean_phone if clean_phone else patient.email
            data['portal_password'] = unique_password if (is_new_patient or request.data.get('reset_password')) else "Existing Password (Saved)"
            data['is_new_patient'] = is_new_patient

            return Response(data, status=201)

    @action(detail=True, methods=['patch'])
    def set_status(self, request, pk=None):
        appt = self.get_object()
        new_status = request.data.get('status')
        if new_status not in dict(Appointment.STATUS):
            return Response({'error': 'Invalid status'}, status=400)
        appt.status = new_status
        appt.save()
        return Response(AppointmentSerializer(appt).data)
