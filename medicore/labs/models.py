from django.db import models

class ExternalLab(models.Model):
    clinic       = models.ForeignKey('clinics.Clinic', on_delete=models.CASCADE,
                                     related_name='lab_reports')
    patient      = models.ForeignKey('users.User', on_delete=models.CASCADE,
                                     related_name='lab_reports')
    consultation = models.ForeignKey('consultations.Consultation', null=True, blank=True,
                                     on_delete=models.SET_NULL, related_name='lab_reports')
    file_url     = models.TextField(blank=True, null=True)
    file_name    = models.CharField(max_length=255)
    report_file  = models.FileField(upload_to='lab_reports/', null=True, blank=True)
    uploaded_at  = models.DateTimeField(auto_now_add=True)
    is_viewed    = models.BooleanField(default=False)

    class Meta:
        indexes  = [models.Index(fields=['clinic', 'patient'])]
        ordering = ['-uploaded_at']
