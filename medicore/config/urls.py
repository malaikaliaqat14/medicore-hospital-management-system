from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/',        admin.site.urls),
    path('api/auth/',     include('users.urls')),
    path('api/admin/',    include('clinics.urls.admin_urls')),
    path('api/clinic/',   include('clinics.urls.clinic_urls')),
    path('api/doctor/',   include('consultations.urls')),
    path('api/patient/',  include('appointments.urls')),
    path('api/labs/',     include('labs.urls')),
    path('api/invoices/', include('invoices.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    re_path(r'^(?!api/|admin/|media/|static/).*$', TemplateView.as_view(template_name='index.html')),
]
