from rest_framework.permissions import BasePermission

class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'SUPER_ADMIN'

class IsClinicAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'CLINIC_ADMIN'

class IsReceptionist(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'RECEPTIONIST'

class IsClinicAdminOrReceptionist(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['CLINIC_ADMIN', 'RECEPTIONIST']

class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'DOCTOR'

class IsPatient(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'PATIENT'

class IsClinicAdminOrPatient(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['CLINIC_ADMIN', 'PATIENT']

class IsDoctorOrPatient(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['DOCTOR', 'PATIENT']

class IsSameClinic(BasePermission):
    def has_object_permission(self, request, view, obj):
        return str(getattr(obj, 'clinic_id', None)) == str(request.clinic_id)
