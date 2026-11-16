from celery import shared_task
from .models import DigitalInvoice
from consultations.models import Consultation
from django.template.loader import render_to_string
from django.conf import settings
from pathlib import Path

@shared_task
def generate_invoice(consultation_id):
    consultation = Consultation.objects.select_related(
        'appointment__patient', 'appointment__doctor__user', 'clinic'
    ).get(pk=consultation_id)

    doctor  = consultation.appointment.doctor
    clinic  = consultation.clinic
    patient = consultation.appointment.patient

    subtotal     = float(doctor.consultation_fee)
    discount_pct = float(clinic.discount_percent)
    discount_amt = subtotal * discount_pct / 100
    total        = subtotal - discount_amt

    line_items = [{'label': 'Consultation Fee', 'amount': subtotal}]

    invoice = DigitalInvoice.objects.create(
        consultation=consultation,
        clinic=clinic,
        line_items=line_items,
        subtotal=subtotal,
        discount=discount_amt,
        total=total,
    )

    html_str = render_to_string('invoices/invoice.html', {
        'invoice':    invoice,
        'clinic':     clinic,
        'patient':    patient,
        'doctor':     doctor,
        'line_items': line_items,
        'subtotal':   subtotal,
        'discount':   discount_amt,
        'total':      total,
    })

    from weasyprint import HTML  # deferred import — requires GTK on Windows
    pdf_bytes = HTML(string=html_str).write_pdf()

    filename = f'invoices/{invoice.id}/invoice.pdf'
    filepath = Path(settings.MEDIA_ROOT) / filename
    filepath.parent.mkdir(parents=True, exist_ok=True)
    filepath.write_bytes(pdf_bytes)
    invoice.pdf_url = f'{settings.MEDIA_URL}{filename}'
    invoice.save()

    return invoice.id
