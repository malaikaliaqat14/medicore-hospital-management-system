from rest_framework import serializers
from .models import ExternalLab

class LabReportSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    class Meta:
        model  = ExternalLab
        fields = '__all__'
        extra_kwargs = {
            'clinic': {'read_only': True},
            'patient': {'read_only': True}
        }
