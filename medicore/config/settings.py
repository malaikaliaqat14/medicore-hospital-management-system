import environ
from pathlib import Path
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(DEBUG=(bool, True))
environ.Env.read_env(BASE_DIR / '.env')

SECRET_KEY    = env('SECRET_KEY', default='django-insecure-change-me-in-production')
DEBUG         = env('DEBUG')
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['*'])

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third party
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'storages',
    # Local apps
    'users',
    'clinics',
    'appointments',
    'consultations',
    'labs',
    'invoices',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'users.middleware.TenantMiddleware',
]

ROOT_URLCONF   = 'config.urls'
AUTH_USER_MODEL = 'users.User'

TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [BASE_DIR / 'templates', BASE_DIR / 'frontend' / 'dist'],
    'APP_DIRS': True,
    'OPTIONS': {'context_processors': [
        'django.template.context_processors.debug',
        'django.template.context_processors.request',
        'django.contrib.auth.context_processors.auth',
        'django.contrib.messages.context_processors.messages',
    ]},
}]

# ── MySQL Database ──────────────────────────────────────────────────────────
DATABASES = {
    'default': env.db('DATABASE_URL')
}
# Ensure MySQL uses UTF-8 and InnoDB
DATABASES['default']['OPTIONS'] = {
    'charset': 'utf8mb4',
    'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
}

# ── DRF + JWT ───────────────────────────────────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME':    timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME':   timedelta(days=7),
    'ROTATE_REFRESH_TOKENS':    True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES':        ('Bearer',),
}

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = [
    'https://*.trycloudflare.com',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
]

# ── Static & Media ──────────────────────────────────────────────────────────
STATIC_URL  = '/static/'
MEDIA_URL   = '/media/'
MEDIA_ROOT  = BASE_DIR / 'media'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    BASE_DIR / 'frontend' / 'dist',
]

# ── S3 (only active when USE_S3=True in .env) ────────────────────────────────
USE_S3 = env.bool('USE_S3', default=False)
if USE_S3:
    DEFAULT_FILE_STORAGE    = 'storages.backends.s3boto3.S3Boto3Storage'
    AWS_ACCESS_KEY_ID       = env('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY   = env('AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = env('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_FILE_OVERWRITE   = False
    AWS_DEFAULT_ACL         = None

# ── Redis Cache ──────────────────────────────────────────────────────────────
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': env('REDIS_URL', default='redis://127.0.0.1:6379/0'),
        'OPTIONS': {'CLIENT_CLASS': 'django_redis.client.DefaultClient'},
    }
}

# ── Celery ───────────────────────────────────────────────────────────────────
CELERY_BROKER_URL        = env('REDIS_URL', default='redis://127.0.0.1:6379/0')
CELERY_RESULT_BACKEND    = env('REDIS_URL', default='redis://127.0.0.1:6379/1')
CELERY_ACCEPT_CONTENT    = ['json']
CELERY_TASK_SERIALIZER   = 'json'
CELERY_RESULT_SERIALIZER = 'json'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
