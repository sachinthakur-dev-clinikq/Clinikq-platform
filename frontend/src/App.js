import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/public.css';

// Public Pages
import Home from './pages/Public/Home';
import Features from './pages/Public/Features';
import HowItWorks from './pages/Public/HowItWorks';
import Specialties from './pages/Public/Specialties';
import Pricing from './pages/Public/Pricing';
import About from './pages/Public/About';
import Contact from './pages/Public/Contact';
import AIDemo from './pages/Public/AIDemo';

// Auth Pages
import Login from './pages/Login';
import ClinicPartnerLogin from './pages/ClinicPartnerLogin';
import SetPassword from './pages/SetPassword';

// Super Admin Pages
import SuperAdminDashboard from './pages/SuperAdmin/Dashboard';
import ClinicsList from './pages/SuperAdmin/ClinicsList';
import CreateClinic from './pages/SuperAdmin/CreateClinic';
import EditClinic from './pages/SuperAdmin/EditClinic';
import Notifications from './pages/SuperAdmin/Notifications';

// Clinic Admin Pages
import ClinicDashboard from './pages/ClinicAdmin/Dashboard';
import PatientsList from './pages/ClinicAdmin/PatientsList';
import AddPatient from './pages/ClinicAdmin/AddPatient';
import AppointmentsList from './pages/ClinicAdmin/AppointmentsList';
import BookAppointment from './pages/ClinicAdmin/BookAppointment';
import Doctors from './pages/ClinicAdmin/Doctors';
import Branding from './pages/ClinicAdmin/Branding';
import Settings from './pages/ClinicAdmin/Settings';
import Reports from './pages/ClinicAdmin/Reports';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/specialties" element={<Specialties />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ai-demo" element={<AIDemo />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/clinicpartner/clinicloginpage" element={<ClinicPartnerLogin />} />
          <Route path="/clinicpartner/set-password" element={<SetPassword />} />
          
          {/* Super Admin Routes */}
          <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/super-admin/clinics" element={<ClinicsList />} />
          <Route path="/super-admin/clinics/new" element={<CreateClinic />} />
          <Route path="/super-admin/clinics/:id/edit" element={<EditClinic />} />
          <Route path="/super-admin/notifications" element={<Notifications />} />
          
          {/* Clinic Admin Routes */}
          <Route path="/clinic/dashboard" element={<ClinicDashboard />} />
          <Route path="/clinic/patients" element={<PatientsList />} />
          <Route path="/clinic/patients/new" element={<AddPatient />} />
          <Route path="/clinic/appointments" element={<AppointmentsList />} />
          <Route path="/clinic/appointments/new" element={<BookAppointment />} />
          <Route path="/clinic/doctors" element={<Doctors />} />
          <Route path="/clinic/branding" element={<Branding />} />
          <Route path="/clinic/settings" element={<Settings />} />
          <Route path="/clinic/reports" element={<Reports />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
