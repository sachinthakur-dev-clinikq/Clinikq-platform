import React from 'react';
import SuperAdminLayout from '../../components/SuperAdminLayout';
import { Bell } from 'lucide-react';

const Notifications = () => {
  return (
    <SuperAdminLayout>
      <div data-testid="notifications-page">
        <h1 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', fontWeight: '600' }}>Notifications</h1>
        
        <div style={{ 
          background: 'white', 
          borderRadius: '0.5rem', 
          padding: '3rem', 
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <Bell size={48} color="hsl(215, 16%, 67%)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: '500', color: 'hsl(215, 20%, 40%)' }}>
            Notification system initializing
          </h2>
          <p style={{ margin: 0, color: 'hsl(215, 16%, 57%)', fontSize: '0.875rem' }}>
            Push notifications and alerts will appear here once configured.
          </p>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default Notifications;
