import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, LayoutDashboard, Building2, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const SuperAdminLayout = ({ children }) => {
  const { logout } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside data-testid="super-admin-sidebar" className="sidebar" style={{ width: '260px', padding: '1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Activity size={32} color="hsl(199, 89%, 37%)" />
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>CliniKQ</h2>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'hsl(215, 16%, 47%)' }}>Super Admin</p>
            </div>
          </div>
        </div>

        <nav>
          <NavLink data-testid="nav-dashboard" to="/super-admin/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} style={{ marginRight: '0.75rem' }} />
            Dashboard
          </NavLink>
          <NavLink data-testid="nav-clinics" to="/super-admin/clinics" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Building2 size={18} style={{ marginRight: '0.75rem' }} />
            Clinics
          </NavLink>
          <NavLink data-testid="nav-notifications" to="/super-admin/notifications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Bell size={18} style={{ marginRight: '0.75rem' }} />
            Notifications
          </NavLink>
        </nav>

        <button data-testid="logout-button" onClick={logout} className="sidebar-link" style={{ width: '100%', marginTop: 'auto', position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', fontSize: 'inherit' }}>
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

export default SuperAdminLayout;
