# CliniKQ - Multi-Tenant Clinic Operational Platform

## Original Problem Statement
Build a multi-tenant, white-label clinic operational platform named "CliniKQ" with the following phased development:
- **Phase 1:** Super Admin Panel & Core Backend
- **Phase 2:** Clinic Engage Layer (Dashboard, Patient/Doctor Management, Branding)
- **Phase 2.5:** UX Upgrade (White-label login, Inline patient creation)
- **Phase 2.6:** White-Label Onboarding Flow (Branded login URL, Sidebar logo, Password activation)
- **Phase 3:** Clinic Workflow Engine Upgrade (Smart Appointment Engine, Dashboard Intelligence)

## User Personas
1. **Super Admin** - Platform administrator managing all clinics
2. **Clinic Admin** - Individual clinic staff managing patients/appointments

## Core Requirements
- Multi-tenant architecture with tenant isolation by clinic_id
- White-label branding support (logo, colors, custom login pages)
- Appointment management with smart scheduling
- Patient management
- Doctor/Staff management

## What's Been Implemented

### Phase 1 (Complete)
- Super Admin authentication and dashboard
- Clinic CRUD operations
- Core backend architecture (FastAPI + MongoDB)
- JWT-based role authentication

### Phase 2 (Complete)
- Clinic Admin panel with dashboard
- Patient management (CRUD)
- Appointment booking system
- Doctor management
- Branding settings page

### Phase 2.5 (Complete)
- White-label login page (`/clinicpartner/clinicloginpage`)
- Inline patient creation modal

### Phase 2.6 (Complete)
- Password activation flow with tokens
- Set Password page (`/clinicpartner/set-password`)
- Sidebar logo display (with /api/uploads route fix)
- Static file serving for uploaded assets

### Phase 3 Backend (Complete - Feb 13, 2026)
- **Smart Appointment Engine:**
  - Auto slot calculation (start_time, end_time)
  - Double-booking prevention
  - Status ENUM: booked, confirmed, completed, cancelled, no_show
- **Notification Engine Foundation:**
  - Creates notification events (T-1 day, T-10 min) in `notification_events` collection
- **Enhanced Dashboard:**
  - GET `/api/clinic-admin/dashboard/enhanced`
  - Completed Today, No-shows Today counts
  - Today's Schedule list
  - Recent Patients list
- **Available Slots Endpoint:**
  - GET `/api/clinic-admin/appointments/available-slots?date=YYYY-MM-DD`
  - Returns 21 slots per day (9 AM - 6 PM, 25-min intervals)

## Technical Architecture

### Backend
- **Framework:** FastAPI (Python)
- **Database:** MongoDB (Motor async driver)
- **Auth:** JWT tokens with role-based access (super_admin, clinic_admin)
- **File Storage:** Local uploads at `/app/backend/uploads/`
- **Static Files:** Served at `/api/uploads/*` route

### Frontend
- **Framework:** React.js
- **Styling:** Tailwind CSS
- **Components:** Shadcn UI
- **HTTP Client:** Axios

### Key Files
- `backend/server.py` - Monolithic API (all routes, models, logic)
- `frontend/src/App.js` - Route definitions
- `frontend/src/components/ClinicAdminLayout.js` - Clinic portal layout
- `frontend/src/pages/SetPassword.js` - Activation flow

## Key API Endpoints

### Authentication
- POST `/api/auth/login`
- GET `/api/auth/me`
- POST `/api/public/set-password`
- GET `/api/public/verify-token/{token}`

### Clinic Admin
- GET `/api/clinic-admin/dashboard`
- GET `/api/clinic-admin/dashboard/enhanced` (Phase 3)
- GET `/api/clinic-admin/appointments/available-slots` (Phase 3)
- GET/POST `/api/clinic-admin/patients`
- GET/POST `/api/clinic-admin/appointments`
- GET/POST `/api/clinic-admin/doctors`
- GET/PUT `/api/clinic-admin/branding`
- POST `/api/clinic-admin/branding/logo`
- GET `/api/clinic-admin/my-branding`

### Super Admin
- GET `/api/super-admin/dashboard`
- GET/POST `/api/super-admin/clinics`
- PUT `/api/super-admin/clinics/{id}`

## Database Collections
- `users` - All users (super_admin, clinic_admin)
- `clinics` - Clinic entities
- `patients` - Patient records (tenant-scoped)
- `appointments` - Appointment bookings
- `doctors` - Doctor/staff records
- `clinic_branding` - White-label settings
- `clinic_settings` - Clinic configuration
- `notification_events` - Scheduled reminders (Phase 3)

## Test Credentials
- **Super Admin:** admin@clinikq.com / Admin@123
- **Clinic Admin (with logo):** rajesh@healthcareplus.com / Clinic@123
- **Pending Activation:** sachin@bharatsure.com / token: cbd0d7a5-d24b-4076-9f9d-48264b8234af

## Backlog / Future Tasks

### P0 - Next Priority
- None currently

### P1 - Upcoming
- Frontend integration for available-slots API (auto-suggest in BookAppointment page)
- Status dropdown with color-coding in appointment list
- Dashboard UI redesign to show enhanced metrics

### P2 - Future
- AI Receptionist and telephony integration
- WhatsApp API integration
- Payment gateway integration
- Kiosk mode functionality
- Pharmacy API integration
- Backend refactoring (split server.py into modules)

## Mocked Features
- Email sending (logged to console only)
- Subdomain routing (uses query params like `?clinic=slug`)
- Missed Calls, Website Visits metrics (placeholder)

## Known Issues
- None critical. All Phase 2.6 bugs fixed.

## Test Reports
- `/app/test_reports/iteration_2.json` - Latest test results
- `/app/backend/tests/test_clinikq_phase3.py` - Pytest test file
