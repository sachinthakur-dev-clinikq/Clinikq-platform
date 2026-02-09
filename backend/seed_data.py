from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import asyncio
import os
from datetime import datetime, timezone, timedelta
import uuid
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def seed_data():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    print("Seeding sample data...")
    
    # Check if super admin already exists
    admin_exists = await db.users.find_one({"role": "super_admin"})
    if admin_exists:
        print("Super admin already exists")
    else:
        # Create super admin
        admin_doc = {
            "id": str(uuid.uuid4()),
            "email": "admin@clinikq.com",
            "password": pwd_context.hash("Admin@123"),
            "name": "Super Admin",
            "role": "super_admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(admin_doc)
        print("✓ Super Admin created")
    
    # Check if sample clinics exist
    clinic_count = await db.clinics.count_documents({})
    if clinic_count > 0:
        print(f"Sample data already exists ({clinic_count} clinics)")
        client.close()
        return
    
    # Create 3 sample clinics
    clinics_data = [
        {
            "clinic_name": "HealthCare Plus Mumbai",
            "clinic_type": "Clinic",
            "city": "Mumbai",
            "contact_person": "Dr. Rajesh Kumar",
            "phone": "+91 9876543210",
            "email": "rajesh@healthcareplus.com",
            "slug": "healthcareplusmumbai",
            "subscription_status": "active"
        },
        {
            "clinic_name": "City Diagnostic Center",
            "clinic_type": "Diagnostic Center",
            "city": "Bangalore",
            "contact_person": "Dr. Priya Sharma",
            "phone": "+91 9876543211",
            "email": "priya@citydiagnostic.com",
            "slug": "citydiagnostic",
            "subscription_status": "trial"
        },
        {
            "clinic_name": "Wellness Nursing Home",
            "clinic_type": "Nursing Home",
            "city": "Delhi",
            "contact_person": "Dr. Amit Patel",
            "phone": "+91 9876543212",
            "email": "amit@wellnessnursing.com",
            "slug": "wellnessnursing",
            "subscription_status": "active"
        }
    ]
    
    clinic_ids = []
    for clinic_data in clinics_data:
        clinic_id = str(uuid.uuid4())
        clinic_ids.append(clinic_id)
        
        now = datetime.now(timezone.utc)
        expiry = now + timedelta(days=30)
        
        clinic_doc = {
            "id": clinic_id,
            **clinic_data,
            "logo_path": None,
            "slot_duration": 20,
            "subscription_start": now.isoformat(),
            "subscription_expiry": expiry.isoformat(),
            "setup_fee": 5000.0,
            "monthly_fee": 2999.0,
            "features": {
                "website": True,
                "booking": True,
                "whatsapp": False,
                "ai_receptionist": False,
                "kiosk": False,
                "teleconsult": True,
                "payments": False,
                "pharmacy": False
            },
            "created_at": now.isoformat()
        }
        await db.clinics.insert_one(clinic_doc)
        
        # Create clinic admin
        admin_id = str(uuid.uuid4())
        admin_doc = {
            "id": admin_id,
            "email": clinic_data["email"],
            "password": pwd_context.hash("clinic@123"),
            "name": clinic_data["contact_person"],
            "role": "clinic_admin",
            "clinic_id": clinic_id,
            "created_at": now.isoformat()
        }
        await db.users.insert_one(admin_doc)
        
        # Create clinic settings
        settings_doc = {
            "clinic_id": clinic_id,
            "whatsapp_enabled": False,
            "teleconsult_enabled": True,
            "teleconsult_followup_only": True,
            "bank_account": None,
            "upi_id": None,
            "qr_code_path": None,
            "pharmacy_name": None,
            "pharmacy_enabled": False
        }
        await db.clinic_settings.insert_one(settings_doc)
        
        print(f"✓ Clinic created: {clinic_data['clinic_name']}")
    
    # Create sample patients for first clinic
    first_clinic_id = clinic_ids[0]
    patients_data = [
        {"name": "Ramesh Verma", "phone": "+91 9123456789", "age": 45, "gender": "Male", "notes": "Diabetic patient"},
        {"name": "Sunita Devi", "phone": "+91 9123456790", "age": 38, "gender": "Female", "notes": "Regular checkup"},
        {"name": "Anil Kumar", "phone": "+91 9123456791", "age": 52, "gender": "Male", "notes": "Hypertension"},
        {"name": "Meera Shah", "phone": "+91 9123456792", "age": 29, "gender": "Female", "notes": ""},
        {"name": "Vikram Singh", "phone": "+91 9123456793", "age": 65, "gender": "Male", "notes": "Cardiac patient"},
    ]
    
    patient_ids = []
    for patient_data in patients_data:
        patient_id = str(uuid.uuid4())
        patient_ids.append(patient_id)
        
        patient_doc = {
            "id": patient_id,
            "clinic_id": first_clinic_id,
            **patient_data,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.patients.insert_one(patient_doc)
    
    print(f"✓ Created {len(patients_data)} sample patients")
    
    # Create sample appointments
    now = datetime.now(timezone.utc)
    appointments_data = [
        {"patient_id": patient_ids[0], "slot_time": (now + timedelta(hours=2)).isoformat(), "status": "booked", "is_teleconsult": False},
        {"patient_id": patient_ids[1], "slot_time": (now + timedelta(days=1, hours=10)).isoformat(), "status": "booked", "is_teleconsult": False},
        {"patient_id": patient_ids[2], "slot_time": (now + timedelta(days=2, hours=15)).isoformat(), "status": "booked", "is_teleconsult": True},
        {"patient_id": patient_ids[3], "slot_time": (now - timedelta(days=1)).isoformat(), "status": "completed", "is_teleconsult": False},
        {"patient_id": patient_ids[4], "slot_time": (now - timedelta(days=2)).isoformat(), "status": "cancelled", "is_teleconsult": False},
    ]
    
    for appointment_data in appointments_data:
        appointment_id = str(uuid.uuid4())
        appointment_doc = {
            "id": appointment_id,
            "clinic_id": first_clinic_id,
            **appointment_data,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.appointments.insert_one(appointment_doc)
    
    print(f"✓ Created {len(appointments_data)} sample appointments")
    
    print("\n=== Sample Data Seeded Successfully ===")
    print("\nLogin Credentials:")
    print("Super Admin: admin@clinikq.com / Admin@123")
    print("Clinic Admin 1: rajesh@healthcareplus.com / clinic@123")
    print("Clinic Admin 2: priya@citydiagnostic.com / clinic@123")
    print("Clinic Admin 3: amit@wellnessnursing.com / clinic@123")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_data())
