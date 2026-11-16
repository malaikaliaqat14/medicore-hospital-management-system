from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    clinic_name      = serializers.CharField(source='clinic.name', read_only=True)
    patient_name     = serializers.CharField(source='patient.name', read_only=True)
    patient_email    = serializers.CharField(source='patient.email', read_only=True)
    patient_phone    = serializers.CharField(source='patient.phone', read_only=True, default='')
    doctor_name      = serializers.CharField(source='doctor.user.name', read_only=True)
    doctor_specialty = serializers.CharField(source='doctor.specialty', read_only=True)
    doctor_fee       = serializers.DecimalField(source='doctor.consultation_fee', max_digits=10, decimal_places=2, read_only=True)
    queue_position   = serializers.SerializerMethodField()

    class Meta:
        model  = Appointment
        fields = '__all__'
        extra_kwargs = {
            'patient': {'required': False},
            'clinic':  {'required': False},
        }
        read_only_fields = ['token_number']

    def get_queue_position(self, obj):
        if obj.status not in ['BOOKED', 'CHECK_IN'] or not obj.token_number:
            return 0
        from django.utils import timezone
        import datetime
        start_of_day = obj.scheduled_at.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = start_of_day + datetime.timedelta(days=1)
        return Appointment.objects.filter(
            doctor=obj.doctor,
            scheduled_at__gte=start_of_day,
            scheduled_at__lt=end_of_day,
            status__in=['BOOKED', 'CHECK_IN', 'IN_PROGRESS'],
            token_number__lt=obj.token_number
        ).count()
