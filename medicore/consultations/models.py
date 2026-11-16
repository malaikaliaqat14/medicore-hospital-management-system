from django.db import models

class Consultation(models.Model):
    appointment  = models.OneToOneField('appointments.Appointment',
                                        on_delete=models.CASCADE,
                                        related_name='consultation')
    clinic       = models.ForeignKey('clinics.Clinic', on_delete=models.CASCADE,
                                     related_name='consultations')
    vitals       = models.JSONField(default=dict)
    # vitals = { "bp": "120/80", "temperature": "98.6", "weight": "72", "spo2": "99" }
    notes        = models.TextField(blank=True)
    prescription = models.JSONField(default=list)
    # prescription = [{ "drug": "", "dosage": "", "frequency": "", "duration": "", "instructions": "" }]
    diagnosis    = models.CharField(max_length=255, blank=True)
    lab_ordered  = models.BooleanField(default=False)
    lab_test_details = models.TextField(blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=['clinic', 'created_at'])]
