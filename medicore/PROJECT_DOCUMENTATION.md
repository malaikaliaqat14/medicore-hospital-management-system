# Medicore — Hospital & Clinic Management System (HMS)
## Technical Architecture & Operational Documentation

---

## 1. Executive Summary

**Medicore** is a modern, multi-tenant Hospital and Clinic Management System (HMS / CMS) engineered to streamline outpatient clinic operations, doctor consultations, tokenized queue management, digital diagnostic labs, and automated billing.

The platform provides a centralized, role-based architecture serving four primary user archetypes:
1. **Super Admin (Platform Owner)** — Oversees platform-wide clinics, user provisioning, and aggregate financial metrics.
2. **Clinic Admin (Healthcare Facility Manager)** — Manages clinic schedules, onboard doctors, tracks daily token queues, and monitors clinic-level revenues and disease distributions.
3. **Doctor (Healthcare Provider)** — Operates a digital consultation desk, records vitals, prescribes medications, reviews patient diagnostic reports, and triggers automated billing upon completion.
4. **Patient (End User)** — Books doctor appointments with automatic sequential token generation, accesses medical consultation history, uploads external lab reports, and tracks digital invoices.

---

## 2. High-Level System Architecture

```mermaid
flowchart TD
    subgraph ClientLayer ["Client Layer (React 19 + Vite)"]
        SPA["React Single Page Application"]
        Zustand["Zustand Auth Store (JWT Storage)"]
        ReactQuery["TanStack React Query (Cache & State)"]
    end

    subgraph GatewayLayer ["Reverse Proxy & Web Server"]
        ViteDev["Vite Dev Server (Port 5173)"]
        DjangoServer["Django WSGI / ASGI (Port 8000)"]
    end

    subgraph MiddlewareLayer ["Django Middleware Pipeline"]
        CORS["CORS Middleware"]
        TenantMW["TenantMiddleware (Extracts clinic_id & role from JWT)"]
        AuthMW["Authentication Middleware"]
    end

    subgraph ServiceLayer ["Backend Applications"]
        UsersApp["users: Authentication & RBAC"]
        ClinicsApp["clinics: Multi-Clinic & Doctor Profiles"]
        AppointmentsApp["appointments: Scheduling & Token Queue"]
        ConsultationsApp["consultations: Vitals, Prescriptions, EMR"]
        LabsApp["labs: Diagnostic Reports & Document Storage"]
        InvoicesApp["invoices: Digital Invoices & Celery PDF Tasks"]
    end

    subgraph StorageLayer ["Persistence & Async Infrastructure"]
        MySQL[("MySQL 8.0 (hms DB)")]
        RedisCache[("Redis Cache & Broker")]
        MediaStorage["Local Media / AWS S3 Storage"]
    end

    SPA -->|Port 5173| ViteDev
    ViteDev -->|/api Proxy| DjangoServer
    SPA -->|Direct API / Prod| DjangoServer
    DjangoServer --> CORS --> TenantMW --> AuthMW
    AuthMW --> UsersApp & ClinicsApp & AppointmentsApp & ConsultationsApp & LabsApp & InvoicesApp
    UsersApp & ClinicsApp & AppointmentsApp & ConsultationsApp & LabsApp & InvoicesApp --> MySQL
    InvoicesApp --> RedisCache
    LabsApp --> MediaStorage
```

### Technology Stack Details

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React.js | `^19.2.8` | Component-driven declarative UI |
| **Build & Tooling** | Vite | `^8.3.0` | Ultra-fast HMR and bundle compilation |
| **Styling** | Tailwind CSS | `^3.4.19` | Modern, responsive dark/light utility system |
| **State & Async Data**| TanStack Query & Zustand | `v5` / `v5` | Server-state caching and global auth persistence |
| **Icons & Visuals** | Lucide React & Recharts | `^1.44` / `^3.10` | Healthcare icons and interactive SVG charts |
| **Backend Framework** | Django / Django REST Framework | `5.0.6` / `3.17.2` | Core REST API, ORM, and business logic |
| **Authentication** | `djangorestframework-simplejwt` | `5.5.1` | Stateless JWT tokens with tenant payload |
| **Primary Database** | MySQL Server | `8.0.46` | Relational database with InnoDB engine & UTF-8 |
| **Cache & Task Queue**| Redis & Celery | `8.1.0` / `5.6.3` | Asynchronous PDF generation & SMS queues |
| **PDF Generation** | WeasyPrint | `70.0` | HTML/CSS to vector PDF medical invoice generation |

---

## 3. Multi-Tenancy & Security Architecture

### Tenant Isolation Model
Medicore employs **Logical Row-Level Multi-Tenancy with Discriminator Column (`clinic_id`)**. 

1. **JWT Payload Injection**:
   When a user authenticates via `/api/auth/login/`, `MediCoreTokenSerializer` enriches the JWT payload:
   ```json
   {
     "user_id": 11,
     "role": "CLINIC_ADMIN",
     "clinic_id": 2,
     "name": "malaika"
   }
   ```
2. **Tenant Middleware (`TenantMiddleware`)**:
   Intercepts every incoming HTTP request, decodes the Bearer token, and binds `request.clinic_id` and `request.role` dynamically to the Django `request` object.
3. **Queryset Scoping**:
   All ViewSets across `appointments`, `clinics`, `consultations`, `labs`, and `invoices` automatically filter by `clinic_id=request.clinic_id` to strictly prevent cross-tenant data leakage.

---

## 4. Role-Based Access Control (RBAC) & Portals

### 4.1 Super Admin (`/admin`)
* **Target Audience**: System owners, SaaS operators.
* **Hierarchical Drill-Down Architecture (No Flat User Lists)**:
  1. **Clinic Directory (Level 0)**: Displays all registered clinics in tabular form with quick indicators (name, address, phone, total doctors, discount, status).
  2. **Clinic Detail View (Level 1)**: Clicking any clinic row or "View Details" opens an in-depth tabular drill-down for that facility:
     * **Doctors Tab**: Doctors roster showing doctor name, email, specialty, registration number, consultation fee, schedule, and patient count.
     * **Patients Tab**: Complete list of patients registered at this clinic with total visit counts and latest appointment dates.
     * **Clinic Admins Tab**: Clinic managers with administrative privileges.
  3. **Doctor's Patients View (Level 2)**: Clicking **"View Patients"** on any doctor opens the dedicated patient roster for that doctor, showing patient names, emails, appointment dates, token numbers, status badges, and clinical diagnoses/notes.
* **Clinic Management**: Register new clinics, edit details, and toggle active/inactive status.
* **Global Macro Analytics**: Total active clinics, total doctors, registered patients, and platform-wide revenue.

### 4.2 Clinic Admin (`/clinic/dashboard`)
* **Target Audience**: Clinic administrators, reception managers.
* **Key Features**:
  * **Live Token Queue Board**: Monitor patient check-ins in real time with quick status transitions:
    $$\text{BOOKED} \longrightarrow \text{CHECK\_IN} \longrightarrow \text{IN\_PROGRESS} \longrightarrow \text{COMPLETED}$$
  * **Doctor Rostering & Scheduling**: Define doctor specialties, registration credentials, consultation fees, and weekly schedule (e.g., Monday–Friday 09:00–17:00).
  * **Patient Registry & History**: Look up patient records, past consultations, previous vital signs, and diagnostic history.
  * **Clinic Analytics**: Monthly revenue trends, doctor-wise revenue distribution, and top frequent diagnoses visualized with bar and pie charts.

### 4.3 Doctor Consultation Desk (`/doctor/desk`)
* **Target Audience**: Outpatient physicians and healthcare specialists.
* **Key Features**:
  * **Queue Management**: Auto-refreshing list (`20s` poll interval) of patients waiting in the clinic for the current date, separated from future bookings.
  * **Vitals Recording**: Capture blood pressure (`bp`), heart rate (`pulse`), temperature, weight, respiratory rate, and blood oxygen saturation (`spo2`).
  * **Interactive Prescription Builder**: Prescribe medications dynamically with customizable drug names, dosage amounts, frequencies, treatment durations, and patient advice.
  * **Diagnostic Lab Reviewer**: Direct inline review of uploaded patient lab reports (PDFs, radiological images, lab scans).
  * **One-Click Finish**: Completing a consultation automatically updates appointment status to `COMPLETED` and queues digital invoice generation.

### 4.4 Patient Portal (`/patient/home`)
* **Target Audience**: Outpatients and healthcare consumers.
* **Key Features**:
  * **Self-Service Appointment Booking**: Choose preferred doctor from the clinic, pick date and time; automatically assigned a daily sequential token number (e.g., Token #1, Token #2).
  * **Upcoming Visits Card**: Shows the exact date, doctor name, and assigned token for seamless in-clinic reception.
  * **Lab Results Hub**: Upload external lab reports or view clinic-ordered test results.
  * **Digital Receipts & Billing**: View itemized invoices, discounts applied, and payment history.

---

## 5. End-to-End Operational Workflows

### 5.1 Patient Appointment & Token Allocation Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Patient as Patient (App/Portal)
    participant API as Django REST API (/api/patient/)
    participant DB as MySQL Database (hms)
    actor Admin as Clinic Reception
    actor Doctor as Doctor Desk

    Patient->>API: POST /api/patient/appointments/ (doctor, scheduled_at)
    Note over API,DB: Calculates MAX(token_number) for doctor on scheduled date
    API->>DB: INSERT Appointment (token_number = max + 1, status = 'BOOKED')
    DB-->>API: Appointment Saved
    API-->>Patient: Returns Appointment with Token #

    Note over Patient,Admin: Patient arrives at Clinic
    Admin->>API: PATCH /api/patient/appointments/{id}/set_status/ ('CHECK_IN')
    API->>DB: Update status to CHECK_IN

    Note over Admin,Doctor: Doctor calls Token
    Doctor->>API: PATCH /api/patient/appointments/{id}/set_status/ ('IN_PROGRESS')
    Doctor->>API: GET /api/doctor/consultations/for_appointment/?appointment={id}
    API->>DB: get_or_create Consultation record
    API-->>Doctor: Returns Consultation Form
```

### 5.2 Consultation, Prescription & Automated Invoicing Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Doctor as Doctor
    participant API as Consultations API
    participant Celery as Celery Worker
    participant Invoices as Invoices Module
    participant DB as MySQL Database

    Doctor->>API: PATCH /api/doctor/consultations/{id}/ (vitals, prescription, diagnosis)
    Doctor->>API: PATCH /api/patient/appointments/{id}/set_status/ ('COMPLETED')
    API->>DB: Update appointment status to COMPLETED
    API->>Invoices: Trigger generate_invoice(consultation_id)
    Invoices->>DB: Fetch Doctor fee & Clinic discount_percent
    Note over Invoices: Calculate Subtotal, Discount Amount, Total
    Invoices->>DB: INSERT DigitalInvoice record
    opt If Celery & WeasyPrint Active
        Invoices->>Celery: generate_invoice_pdf.delay(invoice_id)
        Celery->>Invoices: Render invoice.html to PDF bytes
        Celery->>DB: Update invoice.pdf_url
    end
```

---

## 6. Database Schema & Data Models

```mermaid
erDiagram
    Clinic ||--o{ User : "has many"
    Clinic ||--o{ Doctor : "employs"
    Clinic ||--o{ Appointment : "hosts"
    Clinic ||--o{ Consultation : "records"
    Clinic ||--o{ ExternalLab : "receives"
    Clinic ||--o{ DigitalInvoice : "issues"

    User ||--o| Doctor : "profile for"
    User ||--o{ Appointment : "patient of"
    User ||--o{ ExternalLab : "reports for"

    Doctor ||--o{ Appointment : "attends"

    Appointment ||--|| Consultation : "leads to"
    Consultation ||--o| DigitalInvoice : "billed via"
    Consultation ||--o{ ExternalLab : "may request"

    Clinic {
        bigint id PK
        varchar name
        varchar phone
        varchar timezone
        boolean is_active
        decimal discount_percent
        boolean sms_enabled
        datetime created_at
    }

    User {
        bigint id PK
        varchar email UK
        varchar name
        varchar role "SUPER_ADMIN | CLINIC_ADMIN | DOCTOR | PATIENT"
        bigint clinic_id FK
        boolean is_active
        boolean is_staff
        datetime created_at
    }

    Doctor {
        bigint id PK
        bigint user_id FK,UK
        bigint clinic_id FK
        varchar specialty
        varchar registration_number UK
        decimal consultation_fee
        json schedule
        boolean is_available
        datetime created_at
    }

    Appointment {
        bigint id PK
        bigint clinic_id FK
        bigint patient_id FK
        bigint doctor_id FK
        datetime scheduled_at
        varchar status "BOOKED | CHECK_IN | IN_PROGRESS | COMPLETED | CANCELLED"
        int token_number
        text notes
        datetime created_at
    }

    Consultation {
        bigint id PK
        bigint appointment_id FK,UK
        bigint clinic_id FK
        json vitals
        varchar diagnosis
        json prescription
        boolean lab_ordered
        text lab_test_details
        datetime created_at
    }

    ExternalLab {
        bigint id PK
        bigint clinic_id FK
        bigint patient_id FK
        bigint consultation_id FK
        varchar file_name
        varchar report_file
        boolean is_viewed
        datetime uploaded_at
    }

    DigitalInvoice {
        bigint id PK
        bigint consultation_id FK,UK
        bigint clinic_id FK
        json line_items
        decimal subtotal
        decimal discount
        decimal total
        text pdf_url
        boolean sent_via_sms
        datetime created_at
    }
```

---

## 7. REST API Endpoints Catalog

### Authentication & Core Users (`/api/auth/`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login/` | Public | Returns access and refresh JWT with role & clinic ID |
| `POST` | `/api/auth/register/` | Public | Patient self-registration |
| `POST` | `/api/auth/refresh/` | Authenticated | Rotates JWT access token |
| `POST` | `/api/auth/logout/` | Authenticated | Blacklists current refresh token |
| `GET` | `/api/auth/me/` | Authenticated | Returns current authenticated user profile |
| `GET` | `/api/auth/analytics/` | Super Admin | Returns macro system-wide statistics |

### Platform Administration (`/api/admin/`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET`/`POST` | `/api/admin/clinics/` | Super Admin | List or create clinics |
| `GET`/`PATCH`/`DELETE` | `/api/admin/clinics/{id}/` | Super Admin | Manage specific clinic |
| `POST` | `/api/admin/clinics/{id}/toggle_active/` | Super Admin | Enable/disable clinic account |
| `GET`/`POST` | `/api/admin/users/` | Super Admin | System user CRUD |

### Clinic Operations (`/api/clinic/`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET`/`POST` | `/api/clinic/doctors/` | Clinic Admin / Patient | List or register clinic doctors |
| `GET`/`PATCH`/`DELETE` | `/api/clinic/doctors/{id}/` | Clinic Admin | Manage doctor profile & schedule |
| `GET`/`POST` | `/api/clinic/patients/` | Clinic Admin | Register or search clinic patients |
| `GET` | `/api/clinic/patients/{id}/history/` | Clinic Admin | Retrieve complete consultation history |
| `GET` | `/api/clinic/analytics/` | Clinic Admin | Monthly earnings, doctor revenue, disease stats |

### Doctor Consultation Room (`/api/doctor/`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/doctor/consultations/queue/` | Doctor | Today's and upcoming active token queue |
| `GET` | `/api/doctor/consultations/for_appointment/` | Doctor / Patient | Get or initialize consultation by appointment ID |
| `PATCH` | `/api/doctor/consultations/{id}/` | Doctor | Save diagnosis, vitals, and prescription |

### Patient Appointments (`/api/patient/`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET`/`POST` | `/api/patient/appointments/` | Patient / Clinic Admin | List or book appointment with token generation |
| `PATCH` | `/api/patient/appointments/{id}/set_status/` | Staff / Patient | Update status (`CHECK_IN`, `COMPLETED`, etc.) |

### Diagnostic Labs & Invoicing (`/api/labs/`, `/api/invoices/`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET`/`POST` | `/api/labs/reports/` | Doctor / Patient | Upload diagnostic file or retrieve report history |
| `GET` | `/api/invoices/invoices/` | Patient / Staff | List tenant/patient digital invoices |
| `GET` | `/api/invoices/invoices/{id}/` | Patient / Staff | Retrieve specific invoice details and PDF link |

---

## 8. Credentials & Testing Accounts

The system includes pre-configured testing accounts imported into the database:

| Role | Email Address | Password | Clinic Affiliation |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@medicore.com` | `admin123` | Platform Level (All Clinics) |
| **Clinic Admin** | `mikamalaika14@gmail.com` | *[Database User]* | Clinic ID 2 (*malaika clinic*) |
| **Doctor** | `malaika@gmail.com` | *[Database User]* | Clinic ID 2 (*malaika clinic*) |
| **Doctor** | `malaik@gmail.com` | *[Database User]* | Clinic ID 2 (*malaika clinic*) |
| **Patient** | `mala@gmail.com` | *[Database User]* | Clinic ID 2 (*malaika clinic*) |

> [!TIP]
> If you need to set or reset passwords for any existing doctor or patient account, you can run:
> ```powershell
> .\venv\Scripts\python.exe manage.py shell -c "from users.models import User; u = User.objects.get(email='mala@gmail.com'); u.set_password('patient123'); u.save()"
> ```

---

## 9. Local Setup & Execution Guide

### 9.1 Environment Configuration (`.env`)
Create or edit `medicore/.env`:
```env
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=True
ALLOWED_HOSTS=*

# Database Connection (MySQL)
DATABASE_URL=mysql://root:root123@localhost:3306/hms

# Async & Cache (Optional / Celery)
REDIS_URL=redis://127.0.0.1:6379/0
USE_S3=False
```

### 9.2 Running the Application

#### Backend (Django REST API)
From the `medicore/` directory:
```powershell
# Activate Python Virtual Environment
.\venv\Scripts\activate

# Run database migrations (if needed)
python manage.py migrate

# Launch Django development server
python manage.py runserver 127.0.0.1:8000
```
Backend API will be accessible at: `http://127.0.0.1:8000/`

#### Frontend (React 19 + Vite)
From the `medicore/frontend/` directory:
```powershell
# Install Node dependencies (if not installed)
npm install

# Start Vite Development Server
npm run dev
```
Frontend Web Portal will be accessible at: `http://localhost:5173/`

#### Production Build (Optional)
To bundle the frontend for production serving directly through Django:
```powershell
cd frontend
npm run build
```
Django's static files and SPA route will automatically serve the compiled bundle from `frontend/dist`.

