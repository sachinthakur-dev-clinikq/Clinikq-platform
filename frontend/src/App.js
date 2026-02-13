import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import '@/App.css';

import Login from './pages/Login';
import ClinicPartnerLogin from './pages/ClinicPartnerLogin';
import SetPassword from './pages/SetPassword';
import SuperAdminDashboard from './pages/SuperAdmin/Dashboard';
import ClinicsList from './pages/SuperAdmin/ClinicsList';
import CreateClinic from './pages/SuperAdmin/CreateClinic';
import EditClinic from './pages/SuperAdmin/EditClinic';
import ClinicDashboard from './pages/ClinicAdmin/Dashboard';
import PatientsList from './pages/ClinicAdmin/PatientsList';
import AddPatient from './pages/ClinicAdmin/AddPatient';
import AppointmentsList from './pages/ClinicAdmin/AppointmentsList';
import BookAppointment from './pages/ClinicAdmin/BookAppointment';
import ClinicSettings from './pages/ClinicAdmin/Settings';
import DoctorsList from './pages/ClinicAdmin/Doctors';
import Branding from './pages/ClinicAdmin/Branding';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Phase 2.6: Clinic Partner Routes */}
          <Route path="/clinicpartner/clinicloginpage" element={<ClinicPartnerLogin />} />
          <Route path="/clinicpartner/set-password" element={<SetPassword />} />
          
          {/* Super Admin Routes */}
          <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/super-admin/clinics" element={<ClinicsList />} />
          <Route path="/super-admin/clinics/new" element={<CreateClinic />} />
          <Route path="/super-admin/clinics/:id/edit" element={<EditClinic />} />
          
          {/* Clinic Admin Routes */}
          <Route path="/clinic/dashboard" element={<ClinicDashboard />} />
          <Route path="/clinic/patients" element={<PatientsList />} />
          <Route path="/clinic/patients/new" element={<AddPatient />} />
          <Route path="/clinic/appointments" element={<AppointmentsList />} />
          <Route path="/clinic/appointments/new" element={<BookAppointment />} />
          <Route path="/clinic/doctors" element={<DoctorsList />} />
          <Route path="/clinic/branding" element={<Branding />} />
          <Route path="/clinic/settings" element={<ClinicSettings />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
