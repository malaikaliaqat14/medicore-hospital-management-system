from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User

class MediCoreTokenSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        identifier = attrs.get('email', '').strip()
        password = attrs.get('password', '')

        user = None
        if '@' in identifier:
            user = User.objects.filter(email__iexact=identifier).first()
        else:
            clean_digits = ''.join(c for c in identifier if c.isdigit())
            if clean_digits:
                user = User.objects.filter(phone=clean_digits).first()
                if not user and len(clean_digits) >= 10:
                    user = User.objects.filter(phone__endswith=clean_digits[-10:]).first()
                if not user:
                    user = User.objects.filter(email__startswith=f"{clean_digits}@").first()
                if not user:
                    user = User.objects.filter(email__startswith=f"p_{clean_digits}@").first()

        if user and user.check_password(password):
            if not user.is_active:
                raise serializers.ValidationError('Account is inactive.')
            attrs['email'] = user.email
            return super().validate(attrs)

        return super().validate(attrs)

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role']      = user.role
        token['clinic_id'] = user.clinic_id if user.clinic_id else None
        token['name']      = user.name
        token['email']     = user.email
        token['phone']     = user.phone if user.phone else ''
        return token

class UserSerializer(serializers.ModelSerializer):
    clinic_name = serializers.CharField(source='clinic.name', read_only=True, default='')

    class Meta:
        model  = User
        fields = ['id', 'email', 'phone', 'name', 'role', 'clinic_id', 'clinic_name', 'created_at']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    phone    = serializers.CharField(required=False, allow_blank=True, default='')

    class Meta:
        model  = User
        fields = ['email', 'phone', 'name', 'password', 'role', 'clinic']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
