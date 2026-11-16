from rest_framework import serializers
from .models import DigitalInvoice

class DigitalInvoiceSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='consultation.appointment.patient.name', read_only=True)
    doctor_name  = serializers.CharField(source='consultation.appointment.doctor.user.name', read_only=True)
    date         = serializers.DateTimeField(source='created_at', format='%Y-%m-%d', read_only=True)
    amount       = serializers.DecimalField(source='total', max_digits=10, decimal_places=2, read_only=True)
    status       = serializers.SerializerMethodField()

    class Meta:
        model = DigitalInvoice
        fields = [
            'id',
            'date',
            'amount',
            'status',
            'subtotal',
            'discount',
            'total',
            'pdf_url',
            'sent_via_sms',
            'patient_name',
            'doctor_name',
            'created_at',
        ]

    def get_status(self, obj):
        return 'Paid'

