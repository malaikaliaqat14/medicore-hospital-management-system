from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Appointment
from invoices.tasks import generate_invoice

@receiver(post_save, sender=Appointment)
def trigger_invoice(sender, instance, **kwargs):
    if instance.status == 'COMPLETED' and hasattr(instance, 'consultation'):
        try:
            generate_invoice.delay(instance.consultation.id)
        except Exception as e:
            print(f"Failed to queue invoice generation: {e}")
