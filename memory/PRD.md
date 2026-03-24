# CliniKQ - Complete Production-Style Clinic Operational Platform

## Overview
CliniKQ is a multi-tenant clinic operational platform for OPD clinics, healthcare centers, and small hospitals. This is a complete sales-ready system with a public marketing website, working clinic platform, and AI receptionist simulation.

## What's Been Built

### 1. Public Marketing Website
Premium healthcare SaaS website with:

**Pages:**
- **Home** (`/`) - Hero section, stats, features, testimonials, CTA
- **Features** (`/features`) - Detailed feature categories and descriptions
- **How It Works** (`/how-it-works`) - 4-step onboarding process
- **Specialties** (`/specialties`) - 12+ medical specialties supported
- **Pricing** (`/pricing`) - 3 pricing tiers (Starter, Professional, Enterprise)
- **About** (`/about`) - Company story, values, team, timeline
- **Contact** (`/contact`) - Demo request form, contact methods
- **AI Demo** (`/ai-demo`) - Interactive AI receptionist simulation

**Design:**
- Purple/white professional healthcare palette
- Mobile responsive
- Gradient CTAs and modern UI components
- Trust indicators and social proof

### 2. Super Admin Panel
Full platform management:

**Features:**
- Dashboard with platform metrics (total/active/trial clinics, appointments)
- Create/Edit/Delete clinics
- Manage subscriptions and feature toggles
- View clinic statistics
- Notifications placeholder

**Routes:**
- `/super-admin/dashboard`
- `/super-admin/clinics`
- `/super-admin/clinics/new`
- `/super-admin/clinics/:id/edit`
- `/super-admin/notifications`

### 3. Clinic Admin Panel
Complete clinic operations:

**Features:**
- Dashboard with metrics (appointments, patients, no-shows, cancellations)
- Patient management (CRUD operations)
- Appointment booking with double-booking prevention
- Doctor management
- Branding settings (logo upload, colors)
- Reports & Analytics
- Settings (WhatsApp, teleconsult toggles)

**Routes:**
- `/clinic/dashboard`
- `/clinic/patients`
- `/clinic/patients/new`
- `/clinic/appointments`
- `/clinic/appointments/new`
- `/clinic/doctors`
- `/clinic/branding`
- `/clinic/reports`
- `/clinic/settings`

### 4. AI Receptionist Simulation
Interactive demo showing how AI receptionist works:

**Scenarios:**
1. New Appointment Booking
2. Appointment Rescheduling
3. General Inquiry

**Features:**
- Phone UI simulation
- Scripted conversation playback
- Typing indicators
- Multiple scenario selection
- AI capabilities showcase

### 5. Authentication System
- JWT-based authentication
- Role-based access (super_admin, clinic_admin)
- White-label login pages for clinics
- Password activation flow for new clinics

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@clinikq.com | Admin@123 |
| Demo Clinic | demo@clinic.com | demo123 |

## Technical Stack

**Backend:**
- FastAPI (Python)
- MongoDB (Motor async driver)
- JWT authentication
- BCrypt password hashing

**Frontend:**
- React.js
- Custom CSS (no framework)
- Lucide React icons
- React Router DOM

## Key API Endpoints

### Authentication
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/public/set-password`
- `GET /api/public/verify-token/{token}`
- `GET /api/public/clinic-branding/{slug}`

### Super Admin
- `GET /api/super-admin/dashboard`
- `GET /api/super-admin/clinics`
- `POST /api/super-admin/clinics`
- `PUT /api/super-admin/clinics/{id}`
- `GET /api/super-admin/clinics/{id}/stats`

### Clinic Admin
- `GET /api/clinic-admin/dashboard`
- `GET/POST /api/clinic-admin/patients`
- `PUT /api/clinic-admin/patients/{id}`
- `GET/POST /api/clinic-admin/appointments`
- `PUT /api/clinic-admin/appointments/{id}`
- `GET /api/clinic-admin/appointments/available-slots`
- `GET/POST /api/clinic-admin/doctors`
- `GET/PUT /api/clinic-admin/branding`
- `POST /api/clinic-admin/branding/logo`
- `GET/PUT /api/clinic-admin/settings`

## Database Collections
- `users` - Authentication data
- `clinics` - Clinic entities
- `patients` - Patient records (tenant-scoped)
- `appointments` - Appointment bookings
- `doctors` - Doctor/staff records
- `clinic_branding` - White-label settings
- `clinic_settings` - Feature toggles

## Sample Data
The demo clinic includes:
- 10 patients with realistic Indian names
- 3 doctors (General Physician, Pediatrician, Cardiologist)
- 15 appointments (past, today, upcoming)

## File Structure

```
/app/
├── backend/
│   ├── server.py          # Complete FastAPI backend
│   └── uploads/           # Logo uploads
├── frontend/
│   └── src/
│       ├── api.js         # Axios configuration
│       ├── App.js         # Route definitions
│       ├── App.css        # Admin panel styles
│       ├── styles/
│       │   └── public.css # Public website styles
│       ├── hooks/
│       │   └── useAuth.js # Authentication hook
│       ├── components/
│       │   ├── ClinicAdminLayout.js
│       │   ├── SuperAdminLayout.js
│       │   └── public/
│       │       ├── PublicNavbar.js
│       │       └── PublicFooter.js
│       └── pages/
│           ├── Public/    # Marketing website pages
│           ├── SuperAdmin/# Super admin pages
│           └── ClinicAdmin/# Clinic admin pages
└── memory/
    └── PRD.md             # This document
```

## What's Mocked

- Email sending (console log only)
- Subdomain routing (uses query params)
- SMS/WhatsApp notifications
- Payment processing
- Advanced analytics charts

## Future Enhancements

### Priority 1 (P1)
- Real email integration
- SMS/WhatsApp notifications
- Stripe payment integration
- Advanced reporting with charts

### Priority 2 (P2)
- Real AI receptionist (Twilio + OpenAI)
- Multi-branch support
- Inventory management
- Patient mobile app

### Priority 3 (P3)
- Kiosk mode
- Pharmacy integration
- Insurance billing
- Telemedicine video calls

## URLs
- Home: `/`
- Login: `/login`
- AI Demo: `/ai-demo`
- Super Admin: `/super-admin/dashboard`
- Clinic Admin: `/clinic/dashboard`
- White-label Login: `/clinicpartner/clinicloginpage?clinic=demo-clinic`

---
Last Updated: March 24, 2026
