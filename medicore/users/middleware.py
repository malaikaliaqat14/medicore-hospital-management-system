from rest_framework_simplejwt.authentication import JWTAuthentication

class TenantMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        auth = JWTAuthentication()
        try:
            result = auth.authenticate(request)
            if result:
                user, token = result
                request.clinic_id = token.payload.get('clinic_id')
                request.role      = token.payload.get('role')
        except Exception:
            request.clinic_id = None
            request.role      = None
        return self.get_response(request)
