import React, { useEffect, useState } from 'react';
import SuperAdminLayout from '../../components/SuperAdminLayout';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';
import { Building2, Activity, Users, Calendar, MessageSquare, Phone, Bell } from 'lucide-react';

const SuperAdminDashboard = () => {
  useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const response = await api.get('/super-admin/dashboard');
      setMetrics(response.data);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div data-testid="loading-state">Loading...</div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div data-testid="super-admin-dashboard">
        <div className="page-header">
          <h1>Dashboard</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <div data-testid="metric-total-clinics" className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3>Total Clinics</h3>
              <Building2 size={20} color="hsl(199, 89%, 37%)" />
            </div>
            <p>{metrics?.total_clinics || 0}</p>
          </div>

          <div data-testid="metric-active-clinics" className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3>Active Clinics</h3>
              <Activity size={20} color="hsl(158, 64%, 38%)" />
            </div>
            <p>{metrics?.active_clinics || 0}</p>
          </div>

          <div data-testid="metric-trial-clinics" className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3>Trial Clinics</h3>
              <Users size={20} color="hsl(45, 93%, 47%)" />
            </div>
            <p>{metrics?.trial_clinics || 0}</p>
          </div>

          <div data-testid="metric-suspended-clinics" className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3>Suspended</h3>
              <Activity size={20} color="hsl(0, 84%, 60%)" />
            </div>
            <p>{metrics?.suspended_clinics || 0}</p>
          </div>

          <div data-testid="metric-total-appointments" className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3>Total Appointments</h3>
              <Calendar size={20} color="hsl(199, 89%, 37%)" />
            </div>
            <p>{metrics?.total_appointments || 0}</p>
          </div>

          <div data-testid="metric-upcoming-renewals" className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3>Upcoming Renewals</h3>
              <Bell size={20} color="hsl(25, 95%, 47%)" />
            </div>
            <p>{metrics?.upcoming_renewals || 0}</p>
          </div>

          <div data-testid="metric-ai-usage" className="metric-card" style={{ opacity: 0.6 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3>AI Receptionist</h3>
              <Phone size={20} color="hsl(215, 16%, 47%)" />
            </div>
            <p style={{ fontSize: '1rem', color: 'hsl(215, 16%, 47%)' }}>Coming Soon</p>
          </div>

          <div data-testid="metric-whatsapp" className="metric-card" style={{ opacity: 0.6 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3>WhatsApp Messages</h3>
              <MessageSquare size={20} color="hsl(215, 16%, 47%)" />
            </div>
            <p style={{ fontSize: '1rem', color: 'hsl(215, 16%, 47%)' }}>Coming Soon</p>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboard;
