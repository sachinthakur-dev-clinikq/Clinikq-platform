from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import re
import shutil

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get('JWT_SECRET', 'clinikq-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

security = HTTPBearer()

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Utility functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_slug(name: str) -> str:
    """Generate URL-friendly slug from clinic name"""
    slug = re.sub(r'[^a-z0-9]+', '', name.lower().replace(' ', ''))
    return slug[:30]  # Limit to 30 chars

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        role: str = payload.get("role")
        clinic_id: str = payload.get("clinic_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication")
        return {"id": user_id, "role": role, "clinic_id": clinic_id}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication")

def require_role(required_role: str):
    async def role_checker(user = Depends(get_current_user)):
        if user["role"] != required_role:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user
    return role_checker

# ============ MODELS ============

# Auth Models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    token: str
    role: str
    clinic_id: Optional[str] = None
    name: str

class UserInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    name: str
    role: str
    clinic_id: Optional[str] = None

# Clinic Models
class FeatureToggles(BaseModel):
    website: bool = True
    booking: bool = True
    whatsapp: bool = False
    ai_receptionist: bool = False
    kiosk: bool = False
    teleconsult: bool = False
    payments: bool = False
    pharmacy: bool = False

class ClinicCreate(BaseModel):
    clinic_name: str
    clinic_type: Literal["Clinic", "Healthcare Center", "Diagnostic Center", "Nursing Home"]
    city: str
    contact_person: str
    phone: str
    email: EmailStr
    slot_duration: int = 20
    subscription_status: Literal["trial", "active", "suspended"] = "trial"
    setup_fee: float = 0
    monthly_fee: float = 0
    # Phase 2.6: Branding fields
    brand_color: Optional[str] = "#0284C7"
    address: Optional[str] = None

class Clinic(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    clinic_name: str
    slug: str
    clinic_type: str
    city: str
    contact_person: str
    phone: str
    email: str
    logo_path: Optional[str] = None
    slot_duration: int
    subscription_status: str
    subscription_start: str
    subscription_expiry: str
    setup_fee: float
    monthly_fee: float
    features: FeatureToggles
    created_at: str

class ClinicUpdate(BaseModel):
    clinic_name: Optional[str] = None
    clinic_type: Optional[str] = None
    city: Optional[str] = None
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    slot_duration: Optional[int] = None
    subscription_status: Optional[str] = None
    setup_fee: Optional[float] = None
    monthly_fee: Optional[float] = None

class FeatureToggleRequest(BaseModel):
    feature: str
    enabled: bool

class DashboardMetrics(BaseModel):
    total_clinics: int
    active_clinics: int
    trial_clinics: int
    suspended_clinics: int
    total_appointments: int
    ai_receptionist_usage: int
    whatsapp_messages: int
    upcoming_renewals: int

class ClinicStats(BaseModel):
    total_patients: int
    total_appointments: int
    appointments_today: int
    appointments_upcoming: int

# Patient Models
class PatientCreate(BaseModel):
    name: str
    phone: str
    age: int
    gender: Literal["Male", "Female", "Other"]
    notes: Optional[str] = ""

class Patient(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    clinic_id: str
    name: str
    phone: str
    age: int
    gender: str
    notes: str
    is_active: bool
    created_at: str

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    notes: Optional[str] = None
    is_active: Optional[bool] = None

# Appointment Models
class AppointmentCreate(BaseModel):
    patient_id: str
    slot_time: str  # ISO format datetime
    is_teleconsult: bool = False
    consultation_duration: int = 15  # minutes
    buffer_duration: int = 5  # minutes

class Appointment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    clinic_id: str
    patient_id: str
    patient_name: Optional[str] = None
    slot_time: str
    start_time: str
    end_time: str
    status: str  # booked, confirmed, completed, cancelled, no_show
    is_teleconsult: bool
    created_at: str

class AppointmentUpdate(BaseModel):
    status: Optional[Literal["booked", "confirmed", "completed", "cancelled", "no_show"]] = None

# Phase 3: Notification Event Models
class NotificationEvent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    event_type: str  # appointment_reminder_1day, appointment_reminder_10min, appointment_confirmation
    appointment_id: str
    patient_id: str
    clinic_id: str
    scheduled_time: str
    status: str  # pending, sent, failed
    created_at: str

# Phase 3: Slot Suggestion Models
class SlotSuggestion(BaseModel):
    slot_time: str
    start_time: str
    end_time: str
    available: bool

class ClinicSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    clinic_id: str
    whatsapp_enabled: bool
    teleconsult_enabled: bool
    teleconsult_followup_only: bool
    bank_account: Optional[str] = None
    upi_id: Optional[str] = None
    qr_code_path: Optional[str] = None
    pharmacy_name: Optional[str] = None
    pharmacy_enabled: bool

class ClinicSettingsUpdate(BaseModel):
    whatsapp_enabled: Optional[bool] = None
    teleconsult_enabled: Optional[bool] = None
    teleconsult_followup_only: Optional[bool] = None
    bank_account: Optional[str] = None
    upi_id: Optional[str] = None
    pharmacy_name: Optional[str] = None
    pharmacy_enabled: Optional[bool] = None

class NotificationRequest(BaseModel):
    clinic_ids: List[str]
    message: str

class ClinicDashboardMetrics(BaseModel):
    today_appointments: int
    upcoming_appointments: int
    new_patients: int
    cancelled_appointments: int
    missed_calls: int
    website_visits: int
    walk_ins: int
    pending_followups: int
    no_shows: int
    total_patients: int

# Phase 2 Models

# Doctor Models
class DoctorCreate(BaseModel):
    name: str
    speciality: str
    consultation_fee: float
    phone: Optional[str] = None
    email: Optional[EmailStr] = None

class Doctor(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    clinic_id: str
    name: str
    speciality: str
    consultation_fee: float
    phone: Optional[str] = None
    email: Optional[str] = None
    is_active: bool
    created_at: str

class DoctorUpdate(BaseModel):
    name: Optional[str] = None
    speciality: Optional[str] = None
    consultation_fee: Optional[float] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None

# Phase 2.6 Models - Activation & Password Setup
class SetPasswordRequest(BaseModel):
    token: str
    password: str

class ActivationTokenResponse(BaseModel):
    activation_link: str
    message: str

# Branding Models
class ClinicBranding(BaseModel):
    clinic_id: str
    display_name: Optional[str] = None
    brand_color: str = "#0284C7"  # Default blue
    logo_path: Optional[str] = None
    address: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[EmailStr] = None

class ClinicBrandingUpdate(BaseModel):
    display_name: Optional[str] = None
    brand_color: Optional[str] = None
    address: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[EmailStr] = None

# Visit History Model
class VisitHistory(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    patient_id: str
    clinic_id: str
    appointment_id: str
    visit_date: str
    doctor_name: Optional[str] = None
    notes: Optional[str] = None

# Appointment Reschedule Model
class AppointmentReschedule(BaseModel):
    new_slot_time: str

# Walk-ins Model
class WalkInCreate(BaseModel):
    patient_id: Optional[str] = None
    patient_name: str
    patient_phone: str

class WalkIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    clinic_id: str
    patient_id: Optional[str] = None
    patient_name: str
    patient_phone: str
    walk_in_time: str
    created_at: str

# ============ ROUTES ============

@api_router.get("/")
async def root():
    return {"message": "CliniKQ API v1"}

# Authentication Routes
@api_router.post("/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    user = await db.users.find_one({"email": request.email}, {"_id": 0})
    
    if not user or not verify_password(request.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({
        "sub": user["id"],
        "role": user["role"],
        "clinic_id": user.get("clinic_id")
    })
    
    return LoginResponse(
        token=token,
        role=user["role"],
        clinic_id=user.get("clinic_id"),
        name=user["name"]
    )

@api_router.get("/auth/me", response_model=UserInfo)
async def get_me(user = Depends(get_current_user)):
    user_data = await db.users.find_one({"id": user["id"]}, {"_id": 0, "password": 0})
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return UserInfo(**user_data)

# Phase 2.6: Password Setup Endpoint (Public - No Auth Required)
@api_router.post("/public/set-password")
async def set_password(request: SetPasswordRequest):
    """Allow clinic admin to set password using activation token"""
    user = await db.users.find_one({"activation_token": request.token, "activation_status": "pending"})
    
    if not user:
        raise HTTPException(status_code=404, detail="Invalid or expired activation token")
    
    # Set password and activate account
    hashed_password = hash_password(request.password)
    
    await db.users.update_one(
        {"id": user["id"]},
        {
            "$set": {
                "password": hashed_password,
                "activation_status": "active",
                "activated_at": datetime.now(timezone.utc).isoformat()
            },
            "$unset": {"activation_token": ""}  # Remove token after use
        }
    )
    
    return {"message": "Password set successfully. You can now login."}

# Phase 2.6: Verify Activation Token (Public - No Auth Required)
@api_router.get("/public/verify-token/{token}")
async def verify_activation_token(token: str):
    """Verify if activation token is valid"""
    user = await db.users.find_one({"activation_token": token, "activation_status": "pending"}, {"_id": 0})
    
    if not user:
        raise HTTPException(status_code=404, detail="Invalid or expired activation token")
    
    # Get clinic info
    clinic = await db.clinics.find_one({"id": user["clinic_id"]}, {"_id": 0})
    
    return {
        "valid": True,
        "email": user["email"],
        "name": user["name"],
        "clinic_name": clinic.get("clinic_name") if clinic else None,
        "clinic_slug": clinic.get("slug") if clinic else None
    }

# Super Admin Routes
@api_router.get("/super-admin/dashboard", response_model=DashboardMetrics)
async def get_super_admin_dashboard(user = Depends(require_role("super_admin"))):
    total_clinics = await db.clinics.count_documents({})
    active_clinics = await db.clinics.count_documents({"subscription_status": "active"})
    trial_clinics = await db.clinics.count_documents({"subscription_status": "trial"})
    suspended_clinics = await db.clinics.count_documents({"subscription_status": "suspended"})
    total_appointments = await db.appointments.count_documents({})
    
    # Calculate upcoming renewals (next 7 days)
    now = datetime.now(timezone.utc)
    seven_days_later = now + timedelta(days=7)
    upcoming_renewals = await db.clinics.count_documents({
        "subscription_expiry": {
            "$gte": now.isoformat(),
            "$lte": seven_days_later.isoformat()
        }
    })
    
    return DashboardMetrics(
        total_clinics=total_clinics,
        active_clinics=active_clinics,
        trial_clinics=trial_clinics,
        suspended_clinics=suspended_clinics,
        total_appointments=total_appointments,
        ai_receptionist_usage=0,  # Placeholder
        whatsapp_messages=0,  # Placeholder
        upcoming_renewals=upcoming_renewals
    )

@api_router.get("/super-admin/clinics", response_model=List[Clinic])
async def get_all_clinics(user = Depends(require_role("super_admin"))):
    clinics = await db.clinics.find({}, {"_id": 0}).to_list(1000)
    return clinics

@api_router.post("/super-admin/clinics")
async def create_clinic(clinic: ClinicCreate, user = Depends(require_role("super_admin"))):
    clinic_id = str(uuid.uuid4())
    slug = create_slug(clinic.clinic_name)
    
    # Check if slug already exists
    existing = await db.clinics.find_one({"slug": slug})
    if existing:
        slug = f"{slug}{str(uuid.uuid4())[:4]}"
    
    now = datetime.now(timezone.utc)
    expiry = now + timedelta(days=30)  # Default 30 days trial
    
    clinic_doc = {
        "id": clinic_id,
        "slug": slug,
        **clinic.model_dump(exclude={"brand_color", "address"}),
        "logo_path": None,
        "subscription_start": now.isoformat(),
        "subscription_expiry": expiry.isoformat(),
        "features": FeatureToggles().model_dump(),
        "created_at": now.isoformat()
    }
    
    await db.clinics.insert_one(clinic_doc)
    
    # Phase 2.6: Create branding record upfront
    branding_doc = {
        "clinic_id": clinic_id,
        "display_name": clinic.clinic_name,
        "brand_color": clinic.brand_color or "#0284C7",
        "logo_path": None,
        "address": clinic.address,
        "contact_phone": clinic.phone,
        "contact_email": clinic.email
    }
    await db.clinic_branding.insert_one(branding_doc)
    
    # Phase 2.6: Create clinic admin user with activation token (no password yet)
    admin_id = str(uuid.uuid4())
    activation_token = str(uuid.uuid4())  # Generate secure token
    
    admin_doc = {
        "id": admin_id,
        "email": clinic.email,
        "password": None,  # No password yet - pending activation
        "name": clinic.contact_person,
        "role": "clinic_admin",
        "clinic_id": clinic_id,
        "activation_token": activation_token,
        "activation_status": "pending",  # pending, active
        "created_at": now.isoformat()
    }
    await db.users.insert_one(admin_doc)
    
    # Generate activation link
    activation_link = f"/clinicpartner/set-password?token={activation_token}"
    
    # Mock email sending (console log for now)
    print(f"=== ACTIVATION EMAIL ===")
    print(f"To: {clinic.email}")
    print(f"Subject: Activate Your CliniKQ Account")
    print(f"Activation Link: {activation_link}")
    print(f"=======================")
    
    # Create default settings
    settings_doc = {
        "clinic_id": clinic_id,
        "whatsapp_enabled": False,
        "teleconsult_enabled": False,
        "teleconsult_followup_only": True,
        "bank_account": None,
        "upi_id": None,
        "qr_code_path": None,
        "pharmacy_name": None,
        "pharmacy_enabled": False
    }
    await db.clinic_settings.insert_one(settings_doc)
    
    # Return clinic data with activation link
    return {
        **Clinic(**clinic_doc).model_dump(),
        "activation_link": activation_link,
        "activation_status": "pending"
    }

@api_router.get("/super-admin/clinics/{clinic_id}", response_model=Clinic)
async def get_clinic(clinic_id: str, user = Depends(require_role("super_admin"))):
    clinic = await db.clinics.find_one({"id": clinic_id}, {"_id": 0})
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    return Clinic(**clinic)

@api_router.put("/super-admin/clinics/{clinic_id}", response_model=Clinic)
async def update_clinic(clinic_id: str, updates: ClinicUpdate, user = Depends(require_role("super_admin"))):
    clinic = await db.clinics.find_one({"id": clinic_id})
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    
    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    
    if update_data:
        await db.clinics.update_one({"id": clinic_id}, {"$set": update_data})
    
    updated_clinic = await db.clinics.find_one({"id": clinic_id}, {"_id": 0})
    return Clinic(**updated_clinic)

@api_router.post("/super-admin/clinics/{clinic_id}/toggle-feature")
async def toggle_feature(clinic_id: str, request: FeatureToggleRequest, user = Depends(require_role("super_admin"))):
    clinic = await db.clinics.find_one({"id": clinic_id})
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    
    await db.clinics.update_one(
        {"id": clinic_id},
        {"$set": {f"features.{request.feature}": request.enabled}}
    )
    
    return {"message": "Feature toggled successfully"}

@api_router.get("/super-admin/clinics/{clinic_id}/stats", response_model=ClinicStats)
async def get_clinic_stats(clinic_id: str, user = Depends(require_role("super_admin"))):
    total_patients = await db.patients.count_documents({"clinic_id": clinic_id, "is_active": True})
    total_appointments = await db.appointments.count_documents({"clinic_id": clinic_id})
    
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)
    
    appointments_today = await db.appointments.count_documents({
        "clinic_id": clinic_id,
        "slot_time": {
            "$gte": today_start.isoformat(),
            "$lt": today_end.isoformat()
        }
    })
    
    appointments_upcoming = await db.appointments.count_documents({
        "clinic_id": clinic_id,
        "slot_time": {"$gte": now.isoformat()},
        "status": "booked"
    })
    
    return ClinicStats(
        total_patients=total_patients,
        total_appointments=total_appointments,
        appointments_today=appointments_today,
        appointments_upcoming=appointments_upcoming
    )

@api_router.post("/super-admin/notifications")
async def send_notifications(request: NotificationRequest, user = Depends(require_role("super_admin"))):
    now = datetime.now(timezone.utc)
    notifications = []
    for clinic_id in request.clinic_ids:
        notification = {
            "id": str(uuid.uuid4()),
            "clinic_id": clinic_id,
            "message": request.message,
            "sent_at": now.isoformat()
        }
        notifications.append(notification)
    
    if notifications:
        await db.notifications.insert_many(notifications)
    
    return {"message": f"Notifications sent to {len(notifications)} clinics"}

# Clinic Admin Routes
@api_router.get("/clinic-admin/dashboard", response_model=ClinicDashboardMetrics)
async def get_clinic_dashboard(user = Depends(require_role("clinic_admin"))):
    clinic_id = user["clinic_id"]
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)
    
    today_appointments = await db.appointments.count_documents({
        "clinic_id": clinic_id,
        "slot_time": {
            "$gte": today_start.isoformat(),
            "$lt": today_end.isoformat()
        }
    })
    
    upcoming_appointments = await db.appointments.count_documents({
        "clinic_id": clinic_id,
        "slot_time": {"$gte": now.isoformat()},
        "status": "booked"
    })
    
    # New patients (last 30 days)
    thirty_days_ago = now - timedelta(days=30)
    new_patients = await db.patients.count_documents({
        "clinic_id": clinic_id,
        "created_at": {"$gte": thirty_days_ago.isoformat()}
    })
    
    cancelled_appointments = await db.appointments.count_documents({
        "clinic_id": clinic_id,
        "status": "cancelled"
    })
    
    # Phase 2: Enhanced metrics
    no_shows = await db.appointments.count_documents({
        "clinic_id": clinic_id,
        "status": "no_show"
    })
    
    # Walk-ins today
    walk_ins_today = await db.walk_ins.count_documents({
        "clinic_id": clinic_id,
        "walk_in_time": {
            "$gte": today_start.isoformat(),
            "$lt": today_end.isoformat()
        }
    })
    
    # Pending follow-ups (appointments in past 30 days that need follow-up)
    pending_followups = 0  # Placeholder for now
    
    # Total patients
    total_patients = await db.patients.count_documents({
        "clinic_id": clinic_id,
        "is_active": True
    })
    
    return ClinicDashboardMetrics(
        today_appointments=today_appointments,
        upcoming_appointments=upcoming_appointments,
        new_patients=new_patients,
        cancelled_appointments=cancelled_appointments,
        missed_calls=0,  # Placeholder
        website_visits=0,  # Placeholder
        walk_ins=walk_ins_today,
        pending_followups=pending_followups,
        no_shows=no_shows,
        total_patients=total_patients
    )

# Patient Routes
@api_router.get("/clinic-admin/patients", response_model=List[Patient])
async def get_patients(user = Depends(require_role("clinic_admin"))):
    clinic_id = user["clinic_id"]
    patients = await db.patients.find({"clinic_id": clinic_id}, {"_id": 0}).to_list(1000)
    return patients

@api_router.post("/clinic-admin/patients", response_model=Patient)
async def create_patient(patient: PatientCreate, user = Depends(require_role("clinic_admin"))):
    clinic_id = user["clinic_id"]
    patient_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    
    patient_doc = {
        "id": patient_id,
        "clinic_id": clinic_id,
        **patient.model_dump(),
        "is_active": True,
        "created_at": now.isoformat()
    }
    
    await db.patients.insert_one(patient_doc)
    return Patient(**patient_doc)

@api_router.put("/clinic-admin/patients/{patient_id}", response_model=Patient)
async def update_patient(patient_id: str, updates: PatientUpdate, user = Depends(require_role("clinic_admin"))):
    clinic_id = user["clinic_id"]
    patient = await db.patients.find_one({"id": patient_id, "clinic_id": clinic_id})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    
    if update_data:
        await db.patients.update_one({"id": patient_id}, {"$set": update_data})
    
    updated_patient = await db.patients.find_one({"id": patient_id}, {"_id": 0})
    return Patient(**updated_patient)

# Appointment Routes
@api_router.get("/clinic-admin/appointments", response_model=List[Appointment])
async def get_appointments(user = Depends(require_role("clinic_admin"))):
    clinic_id = user["clinic_id"]
    appointments = await db.appointments.find({"clinic_id": clinic_id}, {"_id": 0}).to_list(1000)
    
    # Enrich with patient names
    for appointment in appointments:
        patient = await db.patients.find_one({"id": appointment["patient_id"]}, {"_id": 0})
        if patient:
            appointment["patient_name"] = patient["name"]
    
    return appointments

@api_router.post("/clinic-admin/appointments", response_model=Appointment)
async def create_appointment(appointment: AppointmentCreate, user = Depends(require_role("clinic_admin"))):
    clinic_id = user["clinic_id"]
    appointment_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    
    # Verify patient belongs to this clinic
    patient = await db.patients.find_one({"id": appointment.patient_id, "clinic_id": clinic_id})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Phase 3: Calculate start and end times
    slot_datetime = datetime.fromisoformat(appointment.slot_time.replace('Z', '+00:00'))
    consultation_duration = appointment.consultation_duration or 15
    buffer_duration = appointment.buffer_duration or 5
    
    start_time = slot_datetime
    end_time = start_time + timedelta(minutes=consultation_duration)
    total_slot_end = end_time + timedelta(minutes=buffer_duration)
    
    # Phase 3: Check for double booking (prevent overlapping appointments)
    overlapping = await db.appointments.find_one({
        "clinic_id": clinic_id,
        "status": {"$nin": ["cancelled", "no_show"]},
        "$or": [
            {
                "start_time": {"$lte": end_time.isoformat()},
                "end_time": {"$gte": start_time.isoformat()}
            }
        ]
    })
    
    if overlapping:
        raise HTTPException(status_code=400, detail="Time slot already booked. Please choose another time.")
    
    appointment_doc = {
        "id": appointment_id,
        "clinic_id": clinic_id,
        "patient_id": appointment.patient_id,
        "slot_time": appointment.slot_time,
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
        "is_teleconsult": appointment.is_teleconsult,
        "status": "booked",
        "created_at": now.isoformat()
    }
    
    await db.appointments.insert_one(appointment_doc)
    
    # Phase 3: Create notification events
    # T-1 day reminder
    reminder_1day = slot_datetime - timedelta(days=1)
    if reminder_1day > now:
        await db.notification_events.insert_one({
            "id": str(uuid.uuid4()),
            "event_type": "appointment_reminder_1day",
            "appointment_id": appointment_id,
            "patient_id": appointment.patient_id,
            "clinic_id": clinic_id,
            "scheduled_time": reminder_1day.isoformat(),
            "status": "pending",
            "created_at": now.isoformat()
        })
    
    # T-10 minutes reminder
    reminder_10min = slot_datetime - timedelta(minutes=10)
    if reminder_10min > now:
        await db.notification_events.insert_one({
            "id": str(uuid.uuid4()),
            "event_type": "appointment_reminder_10min",
            "appointment_id": appointment_id,
            "patient_id": appointment.patient_id,
            "clinic_id": clinic_id,
            "scheduled_time": reminder_10min.isoformat(),
            "status": "pending",
            "created_at": now.isoformat()
        })
    
    result = Appointment(**appointment_doc)
    result.patient_name = patient["name"]
    return result

@api_router.put("/clinic-admin/appointments/{appointment_id}", response_model=Appointment)
async def update_appointment(appointment_id: str, updates: AppointmentUpdate, user = Depends(require_role("clinic_admin"))):
    clinic_id = user["clinic_id"]
    appointment = await db.appointments.find_one({"id": appointment_id, "clinic_id": clinic_id})
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    
    if update_data:
        await db.appointments.update_one({"id": appointment_id}, {"$set": update_data})
    
    updated_appointment = await db.appointments.find_one({"id": appointment_id}, {"_id": 0})
    
    # Get patient name
    patient = await db.patients.find_one({"id": updated_appointment["patient_id"]}, {"_id": 0})
    if patient:
        updated_appointment["patient_name"] = patient["name"]
    
    return Appointment(**updated_appointment)

# Settings Routes
@api_router.get("/clinic-admin/settings", response_model=ClinicSettings)
async def get_settings(user = Depends(require_role("clinic_admin"))):
    clinic_id = user["clinic_id"]
    settings = await db.clinic_settings.find_one({"clinic_id": clinic_id}, {"_id": 0})
    if not settings:
        # Create default settings
        settings = {
            "clinic_id": clinic_id,
            "whatsapp_enabled": False,
            "teleconsult_enabled": False,
            "teleconsult_followup_only": True,
            "bank_account": None,
            "upi_id": None,
            "qr_code_path": None,
            "pharmacy_name": None,
            "pharmacy_enabled": False
        }
        await db.clinic_settings.insert_one(settings)
    return ClinicSettings(**settings)

@api_router.put("/clinic-admin/settings", response_model=ClinicSettings)
async def update_settings(updates: ClinicSettingsUpdate, user = Depends(require_role("clinic_admin"))):
    clinic_id = user["clinic_id"]
    
    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    
    if update_data:
        await db.clinic_settings.update_one(
            {"clinic_id": clinic_id},
            {"$set": update_data},
            upsert=True
        )
    
    settings = await db.clinic_settings.find_one({"clinic_id": clinic_id}, {"_id": 0})
    return ClinicSettings(**settings)

# File Upload Routes
@api_router.post("/uploads/logo")
async def upload_logo(file: UploadFile = File(...), user = Depends(get_current_user)):
    if user["role"] != "super_admin":
        raise HTTPException(status_code=403, detail="Only super admin can upload logos")
    
    # Create uploads directory if not exists
    upload_dir = Path("/app/backend/uploads/logos")
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename
    file_extension = Path(file.filename).suffix
    filename = f"{uuid.uuid4()}{file_extension}"
    file_path = upload_dir / filename
    
    # Save file
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"path": f"/uploads/logos/{filename}"}

@api_router.post("/uploads/qr-code")
async def upload_qr_code(file: UploadFile = File(...), user = Depends(require_role("clinic_admin"))):
    # Create uploads directory if not exists
    upload_dir = Path("/app/backend/uploads/qr-codes")
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename
    file_extension = Path(file.filename).suffix
    filename = f"{user['clinic_id']}{file_extension}"
    file_path = upload_dir / filename
    
    # Save file
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Update settings
    qr_path = f"/uploads/qr-codes/{filename}"
    await db.clinic_settings.update_one(
        {"clinic_id": user["clinic_id"]},
        {"$set": {"qr_code_path": qr_path}},
        upsert=True
    )
    
    return {"path": qr_path}

# ============ PHASE 2 ROUTES ============

# Doctor Management Routes
@api_router.get("/clinic-admin/doctors", response_model=List[Doctor])
async def get_doctors(user = Depends(require_role("clinic_admin"))):
    clinic_id = user["clinic_id"]
    doctors = await db.doctors.find({"clinic_id": clinic_id}, {"_id": 0}).to_list(1000)
    return doctors

@api_router.post("/clinic-admin/doctors", response_model=Doctor)
async def create_doctor(doctor: DoctorCreate, user = Depends(require_role("clinic_admin"))):
    clinic_id = user["clinic_id"]
    doctor_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    
    doctor_doc = {
        "id": doctor_id,
        "clinic_id": clinic_id,
        **doctor.model_dump(),
        "is_active": True,
        "created_at": now.isoformat()
    }
    
    await db.doctors.insert_one(doctor_doc)
    return Doctor(**doctor_doc)

@api_router.put("/clinic-admin/doctors/{doctor_id}", response_model=Doctor)
async def update_doctor(doctor_id: str, updates: DoctorUpdate, user = Depends(require_role("clinic_admin"))):
    clinic_id = user["clinic_id"]
    doctor = await db.doctors.find_one({"id": doctor_id, "clinic_id": clinic_id})
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    
    if update_data:
        await db.doctors.update_one({"id": doctor_id}, {"$set": update_data})
    
    updated_doctor = await db.doctors.find_one({"id": doctor_id}, {"_id": 0})
    return Doctor(**updated_doctor)

# Branding Routes
@api_router.get("/clinic-admin/branding")
async def get_branding(user = Depends(require_role("clinic_admin"))):
    clinic_id = user["clinic_id"]
    branding = await db.clinic_branding.find_one({"clinic_id": clinic_id}, {"_id": 0})
    
    if not branding:
        # Create default branding
        clinic = await db.clinics.find_one({"id": clinic_id}, {"_id": 0})
        branding = {
            "clinic_id": clinic_id,
            "display_name": clinic.get("clinic_name") if clinic else None,
            "brand_color": "#0284C7",
            "logo_path": None,
            "address": None,
            "contact_phone": clinic.get("phone") if clinic else None,
            "contact_email": clinic.get("email") if clinic else None
        }
        await db.clinic_branding.insert_one(branding)
    
    return branding

# Phase 2.6: Get clinic branding for current user (for sidebar)
@api_router.get("/clinic-admin/my-branding")
async def get_my_clinic_branding(user = Depends(require_role("clinic_admin"))):
    """Get clinic branding for authenticated clinic admin (for sidebar logo)"""
    clinic_id = user["clinic_id"]
    branding = await db.clinic_branding.find_one({"clinic_id": clinic_id}, {"_id": 0})
    
    if not branding:
        return {"logo_path": None, "display_name": "CliniKQ", "brand_color": "#0284C7"}
    
    return {
        "logo_path": branding.get("logo_path"),
        "display_name": branding.get("display_name", "CliniKQ"),
        "brand_color": branding.get("brand_color", "#0284C7")
    }

@api_router.get("/public/clinic-branding/{slug}")
async def get_clinic_branding_public(slug: str):
    """Public endpoint to fetch clinic branding by slug for white-label login"""
    clinic = await db.clinics.find_one({"slug": slug}, {"_id": 0})
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    
    branding = await db.clinic_branding.find_one({"clinic_id": clinic["id"]}, {"_id": 0})
    
    if not branding:
        # Return default branding
        return {
            "display_name": clinic.get("clinic_name"),
            "brand_color": "#0284C7",
            "logo_path": None
        }
    
    return {
        "display_name": branding.get("display_name") or clinic.get("clinic_name"),
        "brand_color": branding.get("brand_color", "#0284C7"),
        "logo_path": branding.get("logo_path")
    }

@api_router.put("/clinic-admin/branding")
async def update_branding(updates: ClinicBrandingUpdate, user = Depends(require_role("clinic_admin"))):
    clinic_id = user["clinic_id"]
    
    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    
    if update_data:
        await db.clinic_branding.update_one(
            {"clinic_id": clinic_id},
            {"$set": update_data},
            upsert=True
        )
    
    branding = await db.clinic_branding.find_one({"clinic_id": clinic_id}, {"_id": 0})
    return branding

@api_router.post("/clinic-admin/branding/logo")
async def upload_clinic_logo(file: UploadFile = File(...), user = Depends(require_role("clinic_admin"))):
    clinic_id = user["clinic_id"]
    
    # Create uploads directory
    upload_dir = Path("/app/backend/uploads/clinic-logos")
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename
    file_extension = Path(file.filename).suffix
    filename = f"{clinic_id}{file_extension}"
    file_path = upload_dir / filename
    
    # Save file
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Update branding
    logo_path = f"/uploads/clinic-logos/{filename}"
    await db.clinic_branding.update_one(
        {"clinic_id": clinic_id},
        {"$set": {"logo_path": logo_path}},
        upsert=True
    )
    
    return {"path": logo_path}

# Visit History Routes
@api_router.get("/clinic-admin/patients/{patient_id}/visits", response_model=List[VisitHistory])
async def get_patient_visits(patient_id: str, user = Depends(require_role("clinic_admin"))):
    clinic_id = user["clinic_id"]
    
    # Get appointments for this patient that are completed
    appointments = await db.appointments.find({
        "clinic_id": clinic_id,
        "patient_id": patient_id,
        "status": "completed"
    }, {"_id": 0}).to_list(1000)
    
    visits = []
    for appt in appointments:
        visit = {
            "id": appt["id"],
            "patient_id": patient_id,
            "clinic_id": clinic_id,
            "appointment_id": appt["id"],
            "visit_date": appt["slot_time"],
            "doctor_name": None,  # Can be extended later
            "notes": None
        }
        visits.append(VisitHistory(**visit))
    
    return visits

# Appointment Reschedule
@api_router.post("/clinic-admin/appointments/{appointment_id}/reschedule", response_model=Appointment)
async def reschedule_appointment(
    appointment_id: str, 
    reschedule: AppointmentReschedule, 
    user = Depends(require_role("clinic_admin"))
):
    clinic_id = user["clinic_id"]
    appointment = await db.appointments.find_one({"id": appointment_id, "clinic_id": clinic_id})
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Update the slot time
    await db.appointments.update_one(
        {"id": appointment_id},
        {"$set": {"slot_time": reschedule.new_slot_time}}
    )
    
    updated_appointment = await db.appointments.find_one({"id": appointment_id}, {"_id": 0})
    
    # Get patient name
    patient = await db.patients.find_one({"id": updated_appointment["patient_id"]}, {"_id": 0})
    if patient:
        updated_appointment["patient_name"] = patient["name"]
    
    return Appointment(**updated_appointment)

# Walk-ins Routes
@api_router.post("/clinic-admin/walk-ins", response_model=WalkIn)
async def create_walk_in(walk_in: WalkInCreate, user = Depends(require_role("clinic_admin"))):
    clinic_id = user["clinic_id"]
    walk_in_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    
    walk_in_doc = {
        "id": walk_in_id,
        "clinic_id": clinic_id,
        **walk_in.model_dump(),
        "walk_in_time": now.isoformat(),
        "created_at": now.isoformat()
    }
    
    await db.walk_ins.insert_one(walk_in_doc)
    return WalkIn(**walk_in_doc)

@api_router.get("/clinic-admin/walk-ins", response_model=List[WalkIn])
async def get_walk_ins(user = Depends(require_role("clinic_admin"))):
    clinic_id = user["clinic_id"]
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Get today's walk-ins
    walk_ins = await db.walk_ins.find({
        "clinic_id": clinic_id,
        "walk_in_time": {"$gte": today_start.isoformat()}
    }, {"_id": 0}).to_list(1000)
    
    return walk_ins

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Initialize database with default super admin
@app.on_event("startup")
async def startup_db():
    # Create super admin if doesn't exist
    admin_exists = await db.users.find_one({"role": "super_admin"})
    if not admin_exists:
        admin_doc = {
            "id": str(uuid.uuid4()),
            "email": "admin@clinikq.com",
            "password": hash_password("Admin@123"),
            "name": "Super Admin",
            "role": "super_admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(admin_doc)
        logger.info("Default super admin created: admin@clinikq.com / Admin@123")
