# 🏥 MediCore Clinical Enterprise

> **A Next-Generation, Multi-Tenant Hospital & Clinical Healthcare Management Platform (HMS / EHR)**

[![React](https://img.shields.io/badge/Frontend-React_18_%7C_Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Django](https://img.shields.io/badge/Backend-Django_REST_Framework-092E20?logo=django&logoColor=white)](https://www.djangoproject.com/)
[![MySQL](https://img.shields.io/badge/Database-MySQL_8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Redis](https://img.shields.io/badge/Cache-Redis-DC382D?logo=redis&logoColor=white)](https://redis.io/)
[![JWT](https://img.shields.io/badge/Auth-JWT_Token_Rotation-000000?logo=json-web-tokens&logoColor=white)](https://jwt.io/)

---

## 📌 Overview

**MediCore Clinical Enterprise** is a scalable, enterprise-grade healthcare management system designed to digitize outpatient clinical workflows, walk-in token triage, patient encounters, electronic health records (EHR), and tenant administration.

Built with a **decoupled modern architecture** (Django REST Framework + React Vite SPA), MediCore offers unified vertical navigation, role-based access control, responsive design across all devices (mobile, tablet, desktop), and real-time clinical analytics.

---

## 🚀 Key Features & Role-Based Portals

### 1. 🌐 Super Admin Platform
- **Multi-Tenant Management**: Provision and configure hospital clinics and branch facilities.
- **Platform Analytics**: Cross-tenant health metrics, aggregate system telemetry, and capacity yields.
- **Security & Global Logs**: Centralized user role oversight and audit trails.

### 2. 🏢 Primary Clinic Administration
- **Facility Hub**: Oversee daily appointments, active doctor rotas, and receptionist accounts.
- **Directory Controls**: Manage clinical staff, specialized departments, and patient records.
- **Live Queue Monitoring**: Track real-time patient queue flow from arrival to consultation completion.

### 3. 🩺 Doctor Consultation Desk
- **Live Outpatient Queue**: Real-time triage status (`Booked`, `Checked In`, `In Consultation`, `Completed`).
- **Telemetry Vitals**: Record Blood Pressure, Heart Rate, SpO2, Temperature, and BMI with baseline comparisons.
- **Digital Encounters**: Clinical notes, ICD diagnosis coding, and clean digital prescription generator.
- **Diagnostic Labs**: In-desk patient lab reports viewer and encounter history.

### 4. 🎫 Reception & Front Desk Station
- **Rapid Walk-In Intake**: Register walk-in patients in under 10 seconds.
- **Token Dispenser**: Generate and issue sequential OPD queue slips (`#01`, `#02`, etc.) with doctor allocation.
- **Printable Token Slips**: Instant printable receipts featuring patient queue numbers and self-service portal credentials.

### 5. 👤 Patient Self-Service Portal
- **Encounter Ledger**: Review clinical summaries, vital sign trends, and doctor diagnoses.
- **Medications & Prescriptions**: Access digital medication lists with dosage and instructions.
- **Online Booking**: Schedule upcoming doctor appointments and consultations.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18, Vite (Fast build & HMR) |
| **Styling & UI** | Tailwind CSS, Lucide Icons, Glassmorphism design |
| **State & Data Fetching** | TanStack React Query v5, Zustand |
| **Data Visualizations** | Recharts (Telemetry Area & Pie Charts) |
| **Backend Framework** | Django 4+, Django REST Framework (DRF) |
| **Authentication** | SimpleJWT (Access/Refresh Token rotation) |
| **Database** | MySQL 8.0 (InnoDB with UTF-8 support) |
| **Caching & Queues** | Redis Server |
| **Network & Tunneling** | Cloudflare Tunnel (`cloudflared`) |

---

## 📁 Repository Structure

```text
├── medicore/
│   ├── config/             # Django root configuration, URLs, JWT settings
│   ├── users/              # Multi-tenant custom user model, roles & auth
│   ├── clinics/            # Clinic tenant provisioning & configurations
│   ├── appointments/       # Token queues, booking schedules & statuses
│   ├── consultations/      # Clinical encounters, vitals & prescriptions
│   ├── invoices/           # Billing & transaction ledgers
│   ├── labs/               # Diagnostic laboratory records
│   ├── frontend/           # React 18 + Vite frontend SPA application
│   │   ├── src/
│   │   │   ├── api/        # Axios interceptors with automatic JWT refresh
│   │   │   ├── pages/      # Portals (Admin, Clinic, Doctor, Reception, Patient)
│   │   │   ├── store/      # Zustand authentication store
│   │   └── package.json
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- **Python 3.10+**
- **Node.js 18+ & npm**
- **MySQL Server 8.0+**
- **Redis Server**

---

### 1. Clone the Repository
```bash
git clone https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git
cd <REPO_NAME>
```

---

### 2. Backend Setup (Django)
```bash
# Navigate to the backend directory
cd medicore

# Create & activate a Python virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure Environment Variables
cp .env.example .env
# Edit .env with your MySQL credentials

# Run database migrations
python manage.py migrate

# Create a Super Admin account
python manage.py createsuperuser

# Start the Django server
python manage.py runserver 127.0.0.1:8000
```

---

### 3. Frontend Setup (React + Vite)
```bash
# Open a new terminal and navigate to frontend
cd medicore/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be live at:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://127.0.0.1:8000/api/`
- **Django Admin**: `http://127.0.0.1:8000/admin/`

---

## 🔐 Role-Based Demo Credentials

| Role | Default Access | Features |
|---|---|---|
| **Super Admin** | `admin@medicore.com` | Global platform administration & clinic provisioning |
| **Clinic Admin** | Clinic Manager Account | Doctors, staff, and clinic-wide ledger |
| **Doctor** | Attending Physician Account | Patient triage, vital monitoring, prescription writing |
| **Receptionist** | Front Desk Desk Account | Walk-in intake, OPD token slip issuance |
| **Patient** | Mobile Number / Token Password | Self-service appointments & medical history |

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
