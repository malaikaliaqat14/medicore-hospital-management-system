from django.db import models

class Clinic(models.Model):
    name             = models.CharField(max_length=200)
    logo             = models.ImageField(upload_to='logos/', null=True, blank=True)
    address          = models.TextField()
    phone            = models.CharField(max_length=20)
    timezone         = models.CharField(max_length=50, default='UTC')
    is_active        = models.BooleanField(default=True)
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    sms_enabled      = models.BooleanField(default=False)
    created_at       = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Doctor(models.Model):
    user                = models.OneToOneField('users.User', on_delete=models.CASCADE,
                                               related_name='doctor_profile')
    clinic              = models.ForeignKey(Clinic, on_delete=models.CASCADE,
                                            related_name='doctors')
    specialty           = models.CharField(max_length=100)
    registration_number = models.CharField(max_length=100, unique=True)
    consultation_fee    = models.DecimalField(max_digits=10, decimal_places=2)
    schedule            = models.JSONField(default=dict)
    is_available        = models.BooleanField(default=True)
    created_at          = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Dr. {self.user.name} — {self.clinic.name}'
