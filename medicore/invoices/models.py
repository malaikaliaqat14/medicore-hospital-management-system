from django.db import models

class DigitalInvoice(models.Model):
    consultation = models.OneToOneField('consultations.Consultation',
                                        on_delete=models.CASCADE,
                                        related_name='invoice')
    clinic       = models.ForeignKey('clinics.Clinic', on_delete=models.CASCADE,
                                     related_name='invoices')
    line_items   = models.JSONField(default=list)
    # [{ "label": "Consultation Fee", "amount": 500 }]
    subtotal     = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount     = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total        = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    pdf_url      = models.TextField(blank=True)
    sent_via_sms = models.BooleanField(default=False)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=['clinic', 'created_at'])]
