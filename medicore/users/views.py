from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import MediCoreTokenSerializer, UserSerializer, RegisterSerializer

class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class   = MediCoreTokenSerializer

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            RefreshToken(request.data['refresh']).blacklist()
            return Response({'detail': 'Logged out.'})
        except Exception as e:
            return Response({'error': str(e)}, status=400)

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data.copy()
        data['role'] = 'PATIENT'

        # If phone provided, normalize phone
        phone = data.get('phone', '').strip()
        clean_phone = ''.join(c for c in phone if c.isdigit())
        if clean_phone:
            data['phone'] = clean_phone

        # If email not provided, generate deterministic phone email
        email = data.get('email', '').strip()
        if not email and clean_phone:
            data['email'] = f"{clean_phone}@patient.medicore"
        
        from clinics.models import Clinic
        if 'clinic' not in data or not data['clinic']:
            default_clinic = Clinic.objects.first()
            if default_clinic:
                data['clinic'] = default_clinic.id

        serializer = RegisterSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=201)
        return Response(serializer.errors, status=400)

from .permissions import IsSuperAdmin
from django.db.models import Sum

class SuperAdminAnalyticsView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        from clinics.models import Clinic, Doctor
        from .models import User
        from invoices.models import DigitalInvoice
        
        total_clinics = Clinic.objects.count()
        total_doctors = Doctor.objects.count()
        total_patients = User.objects.filter(role='PATIENT').count()
        
        revenue = DigitalInvoice.objects.aggregate(total=Sum('total'))['total'] or 0
        
        return Response({
            'total_clinics': total_clinics,
            'total_doctors': total_doctors,
            'total_patients': total_patients,
            'global_revenue': revenue
        })
