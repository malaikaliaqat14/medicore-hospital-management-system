from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, password, role, **extra):
        if not email:
            raise ValueError('Email required')
        email = self.normalize_email(email)
        user  = self.model(email=email, role=role, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra):
        extra.setdefault('role', 'SUPER_ADMIN')
        extra.setdefault('is_staff', True)
        extra.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra)

class User(AbstractBaseUser, PermissionsMixin):
    ROLES = [
        ('SUPER_ADMIN',  'Super Admin'),
        ('CLINIC_ADMIN', 'Clinic Admin'),
        ('RECEPTIONIST', 'Receptionist'),
        ('DOCTOR',       'Doctor'),
        ('PATIENT',      'Patient'),
    ]
    email      = models.EmailField(unique=True)
    phone      = models.CharField(max_length=30, blank=True, null=True, db_index=True)
    name       = models.CharField(max_length=200)
    role       = models.CharField(max_length=20, choices=ROLES)
    clinic     = models.ForeignKey('clinics.Clinic', null=True, blank=True,
                                   on_delete=models.SET_NULL, related_name='users')
    is_active  = models.BooleanField(default=True)
    is_staff   = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['name', 'role']

    def __str__(self):
        return f'{self.email} ({self.role})'
