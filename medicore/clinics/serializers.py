from rest_framework import serializers
from django.db import transaction
from .models import Clinic, Doctor
from users.models import User

class ClinicSerializer(serializers.ModelSerializer):
    total_doctors  = serializers.SerializerMethodField()
    total_admins   = serializers.SerializerMethodField()
    primary_admin  = serializers.SerializerMethodField()

    # Optional fields for all-in-one tenant provisioning (creating primary clinic admin)
    admin_name     = serializers.CharField(write_only=True, required=False, allow_blank=True)
    admin_email    = serializers.EmailField(write_only=True, required=False, allow_blank=True)
    admin_password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model  = Clinic
        fields = '__all__'

    def get_total_doctors(self, obj):
        return obj.doctors.count()

    def get_total_admins(self, obj):
        return obj.users.filter(role='CLINIC_ADMIN').count()

    def get_primary_admin(self, obj):
        adm = obj.users.filter(role='CLINIC_ADMIN').order_by('created_at').first()
        if adm:
            return {'id': adm.id, 'name': adm.name, 'email': adm.email}
        return None

    def validate(self, attrs):
        admin_email = attrs.get('admin_email')
        admin_password = attrs.get('admin_password')
        if admin_email:
            if User.objects.filter(email=admin_email).exists():
                raise serializers.ValidationError({'admin_email': 'A user with this email already exists.'})
            if not admin_password or len(admin_password) < 6:
                raise serializers.ValidationError({'admin_password': 'Password must be at least 6 characters.'})
        return attrs

    def create(self, validated_data):
        admin_name     = validated_data.pop('admin_name', '').strip()
        admin_email    = validated_data.pop('admin_email', '').strip()
        admin_password = validated_data.pop('admin_password', '').strip()

        with transaction.atomic():
            clinic = super().create(validated_data)
            if admin_email and admin_password:
                User.objects.create_user(
                    email=admin_email,
                    name=admin_name or f"{clinic.name} Admin",
                    password=admin_password,
                    role='CLINIC_ADMIN',
                    clinic=clinic
                )
            return clinic

class DoctorSerializer(serializers.ModelSerializer):
    user_name   = serializers.CharField(source='user.name',   read_only=True)
    user_email  = serializers.CharField(source='user.email',  read_only=True)
    clinic_name = serializers.CharField(source='clinic.name', read_only=True)
    class Meta:
        model  = Doctor
        fields = '__all__'

class ClinicDoctorCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    specialty = serializers.CharField(max_length=100)
    registration_number = serializers.CharField(max_length=100)
    consultation_fee = serializers.DecimalField(max_digits=10, decimal_places=2)
    schedule = serializers.JSONField(default=dict)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_registration_number(self, value):
        if Doctor.objects.filter(registration_number=value).exists():
            raise serializers.ValidationError("A doctor with this registration number already exists.")
        return value

    def create(self, validated_data):
        clinic = self.context['request'].user.clinic
        
        with transaction.atomic():
            user = User.objects.create_user(
                email=validated_data['email'],
                password=validated_data['password'],
                name=validated_data['name'],
                role='DOCTOR',
                clinic=clinic
            )
            doctor = Doctor.objects.create(
                user=user,
                clinic=clinic,
                specialty=validated_data['specialty'],
                registration_number=validated_data['registration_number'],
                consultation_fee=validated_data['consultation_fee'],
                schedule=validated_data.get('schedule', {})
            )
            return doctor

    def to_representation(self, instance):
        return DoctorSerializer(instance, context=self.context).data

class ClinicPatientCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        clinic = self.context['request'].user.clinic
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            role='PATIENT',
            clinic=clinic
        )
        return user

class ClinicReceptionistCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        clinic = self.context['request'].user.clinic
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            role='RECEPTIONIST',
            clinic=clinic
        )
        return user
