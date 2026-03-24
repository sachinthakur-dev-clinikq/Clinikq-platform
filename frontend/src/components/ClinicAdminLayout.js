import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, LayoutDashboard, Users, Calendar, Settings, LogOut, Stethoscope, Palette, BarChart3 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../api';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ClinicAdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const [branding, setBranding] = useState(null);

  useEffect(() => {
    loadBranding();
  }, []);

  const loadBranding = async () => {
    try {
      const response = await api.get('/clinic-admin/my-branding');
      setBranding(response.data);
    } catch (error) {
      console.error('Failed to load branding:', error);
    }
  };

  // Build full logo URL - logo_path from backend is relative (e.g., /uploads/clinic-logos/...)
  const displayLogo = branding?.logo_path ? `${BACKEND_URL}${branding.logo_path}` : null;
  const displayName = branding?.display_name || 'CliniKQ';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside data-testid="clinic-admin-sidebar" className="sidebar" style={{ width: '260px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {displayLogo ? (
              <img 
                src={displayLogo} 
                alt={displayName}
                style={{ maxWidth: '40px', maxHeight: '40px', objectFit: 'contain' }}
                data-testid="clinic-sidebar-logo"
              />
            ) : (
              <Activity size={32} color="hsl(199, 89%, 37%)" data-testid="default-sidebar-logo" />
            )}
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>{displayName}</h2>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'hsl(215, 16%, 47%)' }}>Clinic Admin</p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          <NavLink data-testid="nav-clinic-dashboard" to="/clinic/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} style={{ marginRight: '0.75rem' }} />
            Dashboard
          </NavLink>
          <NavLink data-testid="nav-patients" to="/clinic/patients" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Users size={18} style={{ marginRight: '0.75rem' }} />
            Patients
          </NavLink>
          <NavLink data-testid="nav-appointments" to="/clinic/appointments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Calendar size={18} style={{ marginRight: '0.75rem' }} />
            Appointments
          </NavLink>
          <NavLink data-testid="nav-doctors" to="/clinic/doctors" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Stethoscope size={18} style={{ marginRight: '0.75rem' }} />
            Doctors
          </NavLink>
          <NavLink data-testid="nav-branding" to="/clinic/branding" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Palette size={18} style={{ marginRight: '0.75rem' }} />
            Branding
          </NavLink>
          <NavLink data-testid="nav-reports" to="/clinic/reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <BarChart3 size={18} style={{ marginRight: '0.75rem' }} />
            Reports
          </NavLink>
          <NavLink data-testid="nav-settings" to="/clinic/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Settings size={18} style={{ marginRight: '0.75rem' }} />
            Settings
          </NavLink>
        </nav>

        <button data-testid="clinic-logout-button" onClick={logout} className="sidebar-link" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', fontSize: 'inherit' }}>
          <LogOut size={18} style={{ marginRight: '0.75rem' }} />
          Logout
        </button>
      </aside>

      <main style={{ flex: 1, padding: '2rem', background: 'hsl(0, 0%, 98%)' }}>
        {children}
      </main>
    </div>
  );
};

export default ClinicAdminLayout;
