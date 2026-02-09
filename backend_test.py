import requests
import sys
from datetime import datetime, timezone, timedelta
import json

class CliniKQAPITester:
    def __init__(self, base_url="https://clinikq-core.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.super_admin_token = None
        self.clinic_admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.created_clinic_id = None
        self.created_patient_id = None
        self.created_appointment_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, token=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        request_headers = {'Content-Type': 'application/json'}
        
        if headers:
            request_headers.update(headers)
            
        if token:
            request_headers['Authorization'] = f'Bearer {token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=request_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=request_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=request_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=request_headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    return success, response_data
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    # Authentication Tests
    def test_super_admin_login(self):
        """Test super admin login"""
        success, response = self.run_test(
            "Super Admin Login",
            "POST",
            "auth/login",
            200,
            data={"email": "admin@clinikq.com", "password": "Admin@123"}
        )
        if success and 'token' in response:
            self.super_admin_token = response['token']
            print(f"   Super Admin Token: {self.super_admin_token[:20]}...")
            return True
        return False

    def test_clinic_admin_login(self):
        """Test clinic admin login"""
        success, response = self.run_test(
            "Clinic Admin Login",
            "POST",
            "auth/login",
            200,
            data={"email": "rajesh@healthcareplus.com", "password": "clinic@123"}
        )
        if success and 'token' in response:
            self.clinic_admin_token = response['token']
            print(f"   Clinic Admin Token: {self.clinic_admin_token[:20]}...")
            return True
        return False

    def test_get_user_info(self, token, user_type):
        """Test getting user info"""
        success, response = self.run_test(
            f"Get {user_type} User Info",
            "GET",
            "auth/me",
            200,
            token=token
        )
        if success and 'role' in response:
            print(f"   User: {response.get('name')} ({response.get('role')})")
        return success

    # Super Admin Tests
    def test_super_admin_dashboard(self):
        """Test super admin dashboard metrics"""
        success, response = self.run_test(
            "Super Admin Dashboard",
            "GET",
            "super-admin/dashboard",
            200,
            token=self.super_admin_token
        )
        if success:
            print(f"   Total Clinics: {response.get('total_clinics', 0)}")
            print(f"   Active Clinics: {response.get('active_clinics', 0)}")
            print(f"   Total Appointments: {response.get('total_appointments', 0)}")
        return success

    def test_get_all_clinics(self):
        """Test getting all clinics"""
        success, response = self.run_test(
            "Get All Clinics",
            "GET",
            "super-admin/clinics",
            200,
            token=self.super_admin_token
        )
        if success:
            print(f"   Found {len(response)} clinics")
            if len(response) > 0:
                print(f"   First clinic: {response[0].get('clinic_name')}")
        return success

    def test_create_clinic(self):
        """Test creating a new clinic"""
        clinic_data = {
            "clinic_name": "Test Clinic API",
            "clinic_type": "Clinic",
            "city": "Test City",
            "contact_person": "Test Contact",
            "phone": "9876543210",
            "email": "testclinic@example.com",
            "slot_duration": 20,
            "subscription_status": "trial",
            "setup_fee": 5000,
            "monthly_fee": 1500
        }
        
        success, response = self.run_test(
            "Create New Clinic",
            "POST",
            "super-admin/clinics",
            200,
            data=clinic_data,
            token=self.super_admin_token
        )
        if success and 'id' in response:
            self.created_clinic_id = response['id']
            print(f"   Created clinic ID: {self.created_clinic_id}")
        return success

    def test_get_clinic_by_id(self):
        """Test getting clinic by ID"""
        if not self.created_clinic_id:
            print("❌ No clinic ID available for testing")
            return False
            
        success, response = self.run_test(
            "Get Clinic by ID",
            "GET",
            f"super-admin/clinics/{self.created_clinic_id}",
            200,
            token=self.super_admin_token
        )
        if success:
            print(f"   Clinic: {response.get('clinic_name')}")
        return success

    def test_update_clinic(self):
        """Test updating clinic"""
        if not self.created_clinic_id:
            print("❌ No clinic ID available for testing")
            return False
            
        update_data = {
            "monthly_fee": 2000
        }
        
        success, response = self.run_test(
            "Update Clinic",
            "PUT",
            f"super-admin/clinics/{self.created_clinic_id}",
            200,
            data=update_data,
            token=self.super_admin_token
        )
        if success:
            print(f"   Updated monthly fee: {response.get('monthly_fee')}")
        return success

    def test_toggle_feature(self):
        """Test feature toggle"""
        if not self.created_clinic_id:
            print("❌ No clinic ID available for testing")
            return False
            
        success, response = self.run_test(
            "Toggle Feature",
            "POST",
            f"super-admin/clinics/{self.created_clinic_id}/toggle-feature",
            200,
            data={"feature": "whatsapp", "enabled": True},
            token=self.super_admin_token
        )
        return success

    def test_clinic_stats(self):
        """Test getting clinic stats"""
        if not self.created_clinic_id:
            print("❌ No clinic ID available for testing")
            return False
            
        success, response = self.run_test(
            "Get Clinic Stats",
            "GET",
            f"super-admin/clinics/{self.created_clinic_id}/stats",
            200,
            token=self.super_admin_token
        )
        if success:
            print(f"   Total Patients: {response.get('total_patients', 0)}")
            print(f"   Total Appointments: {response.get('total_appointments', 0)}")
        return success

    # Clinic Admin Tests
    def test_clinic_admin_dashboard(self):
        """Test clinic admin dashboard"""
        success, response = self.run_test(
            "Clinic Admin Dashboard",
            "GET",
            "clinic-admin/dashboard",
            200,
            token=self.clinic_admin_token
        )
        if success:
            print(f"   Today's Appointments: {response.get('today_appointments', 0)}")
            print(f"   Upcoming Appointments: {response.get('upcoming_appointments', 0)}")
        return success

    def test_get_patients(self):
        """Test getting patients"""
        success, response = self.run_test(
            "Get Patients",
            "GET",
            "clinic-admin/patients",
            200,
            token=self.clinic_admin_token
        )
        if success:
            print(f"   Found {len(response)} patients")
        return success

    def test_create_patient(self):
        """Test creating a patient"""
        patient_data = {
            "name": "Test Patient API",
            "phone": "9876543210",
            "age": 35,
            "gender": "Male",
            "notes": "Created via API test"
        }
        
        success, response = self.run_test(
            "Create Patient",
            "POST",
            "clinic-admin/patients",
            200,
            data=patient_data,
            token=self.clinic_admin_token
        )
        if success and 'id' in response:
            self.created_patient_id = response['id']
            print(f"   Created patient ID: {self.created_patient_id}")
        return success

    def test_update_patient(self):
        """Test updating patient"""
        if not self.created_patient_id:
            print("❌ No patient ID available for testing")
            return False
            
        update_data = {
            "notes": "Updated via API test"
        }
        
        success, response = self.run_test(
            "Update Patient",
            "PUT",
            f"clinic-admin/patients/{self.created_patient_id}",
            200,
            data=update_data,
            token=self.clinic_admin_token
        )
        return success

    def test_get_appointments(self):
        """Test getting appointments"""
        success, response = self.run_test(
            "Get Appointments",
            "GET",
            "clinic-admin/appointments",
            200,
            token=self.clinic_admin_token
        )
        if success:
            print(f"   Found {len(response)} appointments")
        return success

    def test_create_appointment(self):
        """Test creating appointment"""
        if not self.created_patient_id:
            print("❌ No patient ID available for testing")
            return False
            
        # Get datetime for tomorrow at 10 AM
        tomorrow = datetime.now(timezone.utc) + timedelta(days=1)
        slot_time = tomorrow.replace(hour=10, minute=0, second=0, microsecond=0)
        
        appointment_data = {
            "patient_id": self.created_patient_id,
            "slot_time": slot_time.isoformat(),
            "is_teleconsult": False
        }
        
        success, response = self.run_test(
            "Create Appointment",
            "POST",
            "clinic-admin/appointments",
            200,
            data=appointment_data,
            token=self.clinic_admin_token
        )
        if success and 'id' in response:
            self.created_appointment_id = response['id']
            print(f"   Created appointment ID: {self.created_appointment_id}")
        return success

    def test_update_appointment_status(self):
        """Test updating appointment status"""
        if not self.created_appointment_id:
            print("❌ No appointment ID available for testing")
            return False
            
        success, response = self.run_test(
            "Update Appointment Status",
            "PUT",
            f"clinic-admin/appointments/{self.created_appointment_id}",
            200,
            data={"status": "completed"},
            token=self.clinic_admin_token
        )
        return success

    def test_get_settings(self):
        """Test getting settings"""
        success, response = self.run_test(
            "Get Settings",
            "GET",
            "clinic-admin/settings",
            200,
            token=self.clinic_admin_token
        )
        if success:
            print(f"   WhatsApp enabled: {response.get('whatsapp_enabled', False)}")
            print(f"   Teleconsult enabled: {response.get('teleconsult_enabled', False)}")
        return success

    def test_update_settings(self):
        """Test updating settings"""
        settings_data = {
            "whatsapp_enabled": True,
            "teleconsult_enabled": True,
            "bank_account": "1234567890",
            "upi_id": "test@upi"
        }
        
        success, response = self.run_test(
            "Update Settings",
            "PUT",
            "clinic-admin/settings",
            200,
            data=settings_data,
            token=self.clinic_admin_token
        )
        return success

def main():
    print("🏥 Starting CliniKQ API Tests...")
    tester = CliniKQAPITester()
    
    # Test Basic API Connection
    success, response = tester.run_test(
        "API Root",
        "GET", 
        "",
        200
    )
    
    if not success:
        print("❌ API connection failed, stopping tests")
        return 1

    # Authentication Tests
    print("\n=== AUTHENTICATION TESTS ===")
    if not tester.test_super_admin_login():
        print("❌ Super admin login failed, stopping tests")
        return 1
    
    if not tester.test_clinic_admin_login():
        print("❌ Clinic admin login failed, but continuing with super admin tests")
    
    # Test user info endpoints
    if tester.super_admin_token:
        tester.test_get_user_info(tester.super_admin_token, "Super Admin")
    
    if tester.clinic_admin_token:
        tester.test_get_user_info(tester.clinic_admin_token, "Clinic Admin")

    # Super Admin Tests
    if tester.super_admin_token:
        print("\n=== SUPER ADMIN TESTS ===")
        tester.test_super_admin_dashboard()
        tester.test_get_all_clinics()
        tester.test_create_clinic()
        tester.test_get_clinic_by_id()
        tester.test_update_clinic()
        tester.test_toggle_feature()
        tester.test_clinic_stats()

    # Clinic Admin Tests
    if tester.clinic_admin_token:
        print("\n=== CLINIC ADMIN TESTS ===")
        tester.test_clinic_admin_dashboard()
        tester.test_get_patients()
        tester.test_create_patient()
        tester.test_update_patient()
        tester.test_get_appointments()
        tester.test_create_appointment()
        tester.test_update_appointment_status()
        tester.test_get_settings()
        tester.test_update_settings()

    # Print final results
    print(f"\n📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"   Success Rate: {success_rate:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())