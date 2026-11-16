from rest_framework import serializers
from .models import Consultation

class ConsultationSerializer(serializers.ModelSerializer):
    patient_name       = serializers.CharField(source='appointment.patient.name', read_only=True)
    patient_email      = serializers.CharField(source='appointment.patient.email', read_only=True)
    doctor_name        = serializers.CharField(source='appointment.doctor.user.name', read_only=True)
    scheduled_at       = serializers.DateTimeField(source='appointment.scheduled_at', read_only=True)
    token_number       = serializers.IntegerField(source='appointment.token_number', read_only=True)
    appointment_status = serializers.CharField(source='appointment.status', read_only=True)

    class Meta:
        model  = Consultation
        fields = '__all__'
