from django.db import models

class Appointment(models.Model):
    STATUS = [
        ('BOOKED',      'Booked'),
        ('CHECK_IN',    'Checked In'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED',   'Completed'),
        ('CANCELLED',   'Cancelled'),
    ]
    clinic       = models.ForeignKey('clinics.Clinic', on_delete=models.CASCADE,
                                     related_name='appointments')
    patient      = models.ForeignKey('users.User', on_delete=models.CASCADE,
                                     related_name='patient_appointments')
    doctor       = models.ForeignKey('clinics.Doctor', on_delete=models.CASCADE,
                                     related_name='appointments')
    scheduled_at = models.DateTimeField()
    status       = models.CharField(max_length=20, choices=STATUS, default='BOOKED')
    notes        = models.TextField(blank=True)
    token_number = models.IntegerField(null=True, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['scheduled_at']
        indexes  = [models.Index(fields=['clinic', 'scheduled_at'])]

    def __str__(self):
        return f'{self.patient.name} → Dr.{self.doctor.user.name} @ {self.scheduled_at}'
