import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, LayoutDashboard, Users, Calendar, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const ClinicAdminLayout = ({ children }) => {
  const { logout } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside data-testid="clinic-admin-sidebar" className="sidebar" style={{ width: '260px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Activity size={32} color="hsl(199, 89%, 37%)" />
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>CliniKQ</h2>
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
