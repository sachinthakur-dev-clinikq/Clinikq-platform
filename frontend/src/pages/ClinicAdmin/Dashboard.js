import React, { useEffect, useState } from 'react';
import ClinicAdminLayout from '../../components/ClinicAdminLayout';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';
import { Calendar, Users, UserPlus, XCircle, Phone, Eye, UserCheck, Clock, AlertCircle } from 'lucide-react';

const ClinicDashboard = () => {
  useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const response = await api.get('/clinic-admin/dashboard');
      setMetrics(response.data);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ClinicAdminLayout>
        <div data-testid="clinic-dashboard-loading">Loading...</div>
      </ClinicAdminLayout>
    );
  }

  return (
    <ClinicAdminLayout>
      <div data-testid="clinic-dashboard">
        <div className="page-header">
          <h1>Dashboard</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <div data-testid="metric-today-appointments" className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3>Today's Appointments</h3>
              <Calendar size={20} color="hsl(199, 89%, 37%)" />
            </div>
            <p>{metrics?.today_appointments || 0}</p>
          </div>

          <div data-testid="metric-upcoming-appointments" className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3>Upcoming Appointments</h3>
              <Calendar size={20} color="hsl(158, 64%, 38%)" />
            </div>
            <p>{metrics?.upcoming_appointments || 0}</p>
          </div>

          <div data-testid="metric-new-patients" className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3>New Patients (30d)</h3>
              <UserPlus size={20} color="hsl(158, 64%, 38%)" />
            </div>
            <p>{metrics?.new_patients || 0}</p>
          </div>

          <div data-testid="metric-total-patients" className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3>Total Patients</h3>
              <Users size={20} color="hsl(199, 89%, 37%)" />
            </div>
            <p>{metrics?.total_patients || 0}</p>
          </div>

          <div data-testid="metric-walk-ins" className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3>Walk-ins Today</h3>
              <UserCheck size={20} color="hsl(45, 93%, 47%)" />
            </div>
            <p>{metrics?.walk_ins || 0}</p>
          </div>

          <div data-testid="metric-pending-followups" className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3>Pending Follow-ups</h3>
              <Clock size={20} color="hsl(25, 95%, 47%)" />
            </div>
            <p>{metrics?.pending_followups || 0}</p>
          </div>

          <div data-testid="metric-no-shows" className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3>No-shows</h3>
              <AlertCircle size={20} color="hsl(0, 84%, 60%)" />
            </div>
            <p>{metrics?.no_shows || 0}</p>
          </div>

          <div data-testid="metric-cancelled" className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3>Cancelled</h3>
              <XCircle size={20} color="hsl(0, 84%, 60%)" />
            </div>
            <p>{metrics?.cancelled_appointments || 0}</p>
          </div>

          <div data-testid="metric-missed-calls" className="metric-card" style={{ opacity: 0.6 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3>Missed Calls</h3>
              <Phone size={20} color="hsl(215, 16%, 47%)" />
            </div>
            <p style={{ fontSize: '1rem', color: 'hsl(215, 16%, 47%)' }}>Coming Soon</p>
          </div>

          <div data-testid="metric-website-visits" className="metric-card" style={{ opacity: 0.6 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3>Website Visits</h3>
              <Eye size={20} color="hsl(215, 16%, 47%)" />
            </div>
            <p style={{ fontSize: '1rem', color: 'hsl(215, 16%, 47%)' }}>Coming Soon</p>
          </div>
        </div>
      </div>
    </ClinicAdminLayout>
  );
};

export default ClinicDashboard;
