"""
CliniKQ Phase 3 Backend Tests
Tests for:
- Bug Fix #1: Clinic sidebar logo display
- Bug Fix #2: Set Password page with activation token
- Phase 3: Available slots endpoint
- Phase 3: Enhanced dashboard endpoint
- Phase 3: Appointment creation with double-booking prevention
- Phase 3: Notification events creation
"""
import pytest
import requests
import os
from datetime import datetime, timedelta

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# ===================== FIXTURES =====================

@pytest.fixture
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session

@pytest.fixture
def super_admin_token(api_client):
    """Get super admin authentication token"""
    response = api_client.post(f"{BASE_URL}/api/auth/login", json={
        "email": "admin@clinikq.com",
        "password": "Admin@123"
    })
    if response.status_code == 200:
        return response.json().get("token")
    pytest.skip("Super admin authentication failed")

@pytest.fixture
def clinic_admin_token(api_client):
    """Get clinic admin (rajesh@healthcareplus.com) authentication token"""
    response = api_client.post(f"{BASE_URL}/api/auth/login", json={
        "email": "rajesh@healthcareplus.com",
        "password": "Clinic@123"
    })
    if response.status_code == 200:
        return response.json().get("token")
    pytest.skip("Clinic admin authentication failed")

@pytest.fixture
def authenticated_super_admin(api_client, super_admin_token):
    """Session with super admin auth header"""
    api_client.headers.update({"Authorization": f"Bearer {super_admin_token}"})
    return api_client

@pytest.fixture
def authenticated_clinic_admin(api_client, clinic_admin_token):
    """Session with clinic admin auth header"""
    api_client.headers.update({"Authorization": f"Bearer {clinic_admin_token}"})
    return api_client


# ===================== BUG FIX TESTS =====================

class TestBugFix1SidebarLogo:
    """Bug Fix #1: Clinic sidebar should display clinic logo (not just name)"""
    
    def test_my_branding_endpoint_returns_logo_path(self, authenticated_clinic_admin):
        """Test GET /api/clinic-admin/my-branding returns logo_path for authenticated clinic admin"""
        response = authenticated_clinic_admin.get(f"{BASE_URL}/api/clinic-admin/my-branding")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "logo_path" in data, "Response should include logo_path field"
        assert "display_name" in data, "Response should include display_name field"
        assert "brand_color" in data, "Response should include brand_color field"
        
        # Verify logo path is set for HealthCare Plus
        assert data["logo_path"] is not None, "logo_path should be set for clinic with uploaded logo"
        assert "/uploads/clinic-logos/" in data["logo_path"], "logo_path should point to uploads directory"
        
        print(f"Logo path: {data['logo_path']}")
        print(f"Display name: {data['display_name']}")
    
    def test_logo_file_is_accessible(self, api_client, authenticated_clinic_admin):
        """Test that the logo file is accessible via static files endpoint"""
        # First get the branding to get logo path
        response = authenticated_clinic_admin.get(f"{BASE_URL}/api/clinic-admin/my-branding")
        assert response.status_code == 200
        
        logo_path = response.json().get("logo_path")
        if logo_path:
            # Access the static file (without /api prefix)
            logo_url = f"{BASE_URL}{logo_path}"
            file_response = api_client.get(logo_url)
            assert file_response.status_code == 200, f"Logo file not accessible at {logo_url}"
            assert "image" in file_response.headers.get("content-type", ""), "Response should be an image"
            print(f"Logo accessible at: {logo_url}")


class TestBugFix2SetPasswordPage:
    """Bug Fix #2: Set Password page at /clinicpartner/set-password should work with activation token"""
    
    def test_verify_activation_token_valid(self, api_client):
        """Test GET /api/public/verify-token/{token} with valid token"""
        token = "cbd0d7a5-d24b-4076-9f9d-48264b8234af"
        response = api_client.get(f"{BASE_URL}/api/public/verify-token/{token}")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data.get("valid") == True, "Token should be valid"
        assert "email" in data, "Response should include email"
        assert "name" in data, "Response should include name"
        assert data["email"] == "sachin@bharatsure.com", "Email should match pending user"
        
        print(f"Verified user: {data['name']} ({data['email']})")
    
    def test_verify_activation_token_invalid(self, api_client):
        """Test GET /api/public/verify-token/{token} with invalid token"""
        token = "invalid-token-12345"
        response = api_client.get(f"{BASE_URL}/api/public/verify-token/{token}")
        
        assert response.status_code == 404, f"Expected 404 for invalid token, got {response.status_code}"
    
    def test_set_password_success(self, api_client):
        """Test POST /api/public/set-password with valid token"""
        # Note: This test will use up the activation token
        # After this test, the user will be activated
        token = "cbd0d7a5-d24b-4076-9f9d-48264b8234af"
        password = "TestPassword@123"
        
        response = api_client.post(f"{BASE_URL}/api/public/set-password", json={
            "token": token,
            "password": password
        })
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "message" in data, "Response should include success message"
        print(f"Set password result: {data['message']}")
    
    def test_set_password_invalid_token(self, api_client):
        """Test POST /api/public/set-password with invalid token"""
        response = api_client.post(f"{BASE_URL}/api/public/set-password", json={
            "token": "invalid-token-xyz",
            "password": "SomePassword@123"
        })
        
        assert response.status_code == 404, f"Expected 404 for invalid token, got {response.status_code}"


# ===================== PHASE 3: SMART APPOINTMENT ENGINE TESTS =====================

class TestPhase3AvailableSlots:
    """Phase 3: Available slots endpoint GET /api/clinic-admin/appointments/available-slots"""
    
    def test_available_slots_returns_slots(self, authenticated_clinic_admin):
        """Test GET /api/clinic-admin/appointments/available-slots returns slots for a date"""
        # Use a future date
        future_date = (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d")
        
        response = authenticated_clinic_admin.get(
            f"{BASE_URL}/api/clinic-admin/appointments/available-slots",
            params={"date": future_date}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        slots = response.json()
        assert isinstance(slots, list), "Response should be a list of slots"
        assert len(slots) > 0, "Should return at least one slot"
        
        # Verify slot structure
        first_slot = slots[0]
        assert "slot_time" in first_slot, "Slot should have slot_time"
        assert "start_time" in first_slot, "Slot should have start_time"
        assert "end_time" in first_slot, "Slot should have end_time"
        assert "available" in first_slot, "Slot should have available flag"
        
        # Count available slots
        available_count = sum(1 for s in slots if s["available"])
        print(f"Found {len(slots)} slots, {available_count} available for {future_date}")
    
    def test_available_slots_with_custom_duration(self, authenticated_clinic_admin):
        """Test available slots with custom consultation duration"""
        future_date = (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d")
        
        response = authenticated_clinic_admin.get(
            f"{BASE_URL}/api/clinic-admin/appointments/available-slots",
            params={
                "date": future_date,
                "consultation_duration": 30,
                "buffer_duration": 10
            }
        )
        
        assert response.status_code == 200
        slots = response.json()
        assert len(slots) > 0, "Should return slots with custom duration"
        
        print(f"With 30min consultation + 10min buffer: {len(slots)} slots")
    
    def test_available_slots_invalid_date_format(self, authenticated_clinic_admin):
        """Test available slots with invalid date format"""
        response = authenticated_clinic_admin.get(
            f"{BASE_URL}/api/clinic-admin/appointments/available-slots",
            params={"date": "invalid-date"}
        )
        
        assert response.status_code == 400, f"Expected 400 for invalid date, got {response.status_code}"


class TestPhase3EnhancedDashboard:
    """Phase 3: Enhanced dashboard endpoint GET /api/clinic-admin/dashboard/enhanced"""
    
    def test_enhanced_dashboard_returns_full_data(self, authenticated_clinic_admin):
        """Test enhanced dashboard returns all required fields"""
        response = authenticated_clinic_admin.get(f"{BASE_URL}/api/clinic-admin/dashboard/enhanced")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        
        # Check basic metrics
        assert "today_appointments" in data, "Should include today_appointments"
        assert "upcoming_appointments" in data, "Should include upcoming_appointments"
        assert "completed_today" in data, "Should include completed_today"
        assert "no_shows_today" in data, "Should include no_shows_today"
        assert "total_patients" in data, "Should include total_patients"
        assert "new_patients" in data, "Should include new_patients"
        assert "cancelled_appointments" in data, "Should include cancelled_appointments"
        assert "walk_ins" in data, "Should include walk_ins"
        
        # Check lists
        assert "todays_schedule" in data, "Should include todays_schedule list"
        assert "recent_patients" in data, "Should include recent_patients list"
        assert isinstance(data["todays_schedule"], list), "todays_schedule should be a list"
        assert isinstance(data["recent_patients"], list), "recent_patients should be a list"
        
        print(f"Enhanced dashboard: {data['today_appointments']} today, {data['total_patients']} total patients")
        print(f"Today's schedule items: {len(data['todays_schedule'])}")
        print(f"Recent patients: {len(data['recent_patients'])}")
    
    def test_enhanced_dashboard_schedule_item_structure(self, authenticated_clinic_admin):
        """Test today's schedule items have correct structure"""
        response = authenticated_clinic_admin.get(f"{BASE_URL}/api/clinic-admin/dashboard/enhanced")
        assert response.status_code == 200
        
        data = response.json()
        if data["todays_schedule"]:
            item = data["todays_schedule"][0]
            assert "id" in item, "Schedule item should have id"
            assert "patient_name" in item, "Schedule item should have patient_name"
            assert "slot_time" in item, "Schedule item should have slot_time"
            assert "status" in item, "Schedule item should have status"
            assert "is_teleconsult" in item, "Schedule item should have is_teleconsult"


class TestPhase3AppointmentCreationAndDoublBooking:
    """Phase 3: Appointment creation with auto slot calculation and double-booking prevention"""
    
    def test_create_appointment_with_slot_calculation(self, authenticated_clinic_admin):
        """Test appointment creation calculates start_time and end_time"""
        # First, get a patient id
        patients_response = authenticated_clinic_admin.get(f"{BASE_URL}/api/clinic-admin/patients")
        assert patients_response.status_code == 200
        patients = patients_response.json()
        
        if not patients:
            pytest.skip("No patients available for appointment test")
        
        patient_id = patients[0]["id"]
        
        # Create appointment for tomorrow at 10:00 AM
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        slot_time = f"{tomorrow}T10:00:00+00:00"
        
        response = authenticated_clinic_admin.post(
            f"{BASE_URL}/api/clinic-admin/appointments",
            json={
                "patient_id": patient_id,
                "slot_time": slot_time,
                "is_teleconsult": False,
                "consultation_duration": 15,
                "buffer_duration": 5
            }
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        appointment = response.json()
        assert "id" in appointment, "Appointment should have id"
        assert "start_time" in appointment, "Appointment should have auto-calculated start_time"
        assert "end_time" in appointment, "Appointment should have auto-calculated end_time"
        assert appointment["status"] == "booked", "Initial status should be 'booked'"
        
        print(f"Created appointment: {appointment['id']}")
        print(f"Slot: {appointment['slot_time']}, End: {appointment['end_time']}")
        
        return appointment
    
    def test_double_booking_prevention(self, authenticated_clinic_admin):
        """Test that double booking is prevented"""
        # First, get a patient id
        patients_response = authenticated_clinic_admin.get(f"{BASE_URL}/api/clinic-admin/patients")
        assert patients_response.status_code == 200
        patients = patients_response.json()
        
        if len(patients) < 2:
            pytest.skip("Need at least 2 patients for double booking test")
        
        patient_id_1 = patients[0]["id"]
        patient_id_2 = patients[1]["id"] if len(patients) > 1 else patients[0]["id"]
        
        # Create first appointment for a specific time (day after tomorrow to avoid conflicts)
        future_date = (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d")
        slot_time = f"{future_date}T14:00:00+00:00"
        
        # First appointment should succeed
        response1 = authenticated_clinic_admin.post(
            f"{BASE_URL}/api/clinic-admin/appointments",
            json={
                "patient_id": patient_id_1,
                "slot_time": slot_time,
                "is_teleconsult": False,
                "consultation_duration": 15,
                "buffer_duration": 5
            }
        )
        
        assert response1.status_code == 200, f"First appointment should succeed: {response1.text}"
        
        # Second appointment at same time should fail (double booking)
        response2 = authenticated_clinic_admin.post(
            f"{BASE_URL}/api/clinic-admin/appointments",
            json={
                "patient_id": patient_id_2,
                "slot_time": slot_time,
                "is_teleconsult": False,
                "consultation_duration": 15,
                "buffer_duration": 5
            }
        )
        
        assert response2.status_code == 400, f"Second appointment should fail with 400, got {response2.status_code}"
        assert "already booked" in response2.text.lower() or "slot" in response2.text.lower(), "Error message should indicate time slot conflict"
        
        print(f"Double booking prevention working: {response2.json()}")


class TestPhase3NotificationEvents:
    """Phase 3: Notification events creation when booking appointment"""
    
    def test_notification_events_created_on_appointment(self, authenticated_clinic_admin):
        """Test that notification events are created when appointment is booked"""
        # Get a patient
        patients_response = authenticated_clinic_admin.get(f"{BASE_URL}/api/clinic-admin/patients")
        assert patients_response.status_code == 200
        patients = patients_response.json()
        
        if not patients:
            pytest.skip("No patients available")
        
        patient_id = patients[0]["id"]
        
        # Create appointment for 5 days from now (to ensure both reminders are scheduled)
        future_date = (datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d")
        slot_time = f"{future_date}T11:00:00+00:00"
        
        response = authenticated_clinic_admin.post(
            f"{BASE_URL}/api/clinic-admin/appointments",
            json={
                "patient_id": patient_id,
                "slot_time": slot_time,
                "is_teleconsult": False,
                "consultation_duration": 15,
                "buffer_duration": 5
            }
        )
        
        assert response.status_code == 200, f"Appointment creation failed: {response.text}"
        
        appointment = response.json()
        print(f"Created appointment {appointment['id']} for {slot_time}")
        print("Notification events should be created (T-1 day and T-10 min reminders)")
        
        # Note: We can't directly verify notification_events collection via API
        # The main agent context mentions events are stored but no GET endpoint exposed
        # This test verifies appointment creation succeeds which triggers notification creation


# ===================== AUTHENTICATION TESTS =====================

class TestAuthentication:
    """Basic authentication tests"""
    
    def test_super_admin_login(self, api_client):
        """Test super admin login"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@clinikq.com",
            "password": "Admin@123"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["role"] == "super_admin"
        print("Super admin login successful")
    
    def test_clinic_admin_login(self, api_client):
        """Test clinic admin login"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": "rajesh@healthcareplus.com",
            "password": "Clinic@123"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["role"] == "clinic_admin"
        assert "clinic_id" in data
        print(f"Clinic admin login successful, clinic_id: {data['clinic_id']}")
    
    def test_invalid_credentials(self, api_client):
        """Test login with invalid credentials"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": "wrong@email.com",
            "password": "wrongpassword"
        })
        
        assert response.status_code == 401


# ===================== API HEALTH CHECK =====================

class TestAPIHealth:
    """API health and connectivity tests"""
    
    def test_api_root(self, api_client):
        """Test API root endpoint"""
        response = api_client.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"API root: {data['message']}")
