import React, { useEffect, useState } from 'react';
import ClinicAdminLayout from '../../components/ClinicAdminLayout';
import api from '../../api';
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, Clock } from 'lucide-react';

const Reports = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    loadMetrics();
  }, [dateRange]);

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

  const reports = [
    {
      title: 'Patient Analytics',
      icon: Users,
      stats: [
        { label: 'Total Patients', value: metrics?.total_patients || 0 },
        { label: 'New This Month', value: metrics?.new_patients || 0 },
        { label: 'Growth Rate', value: '+12%' },
      ]
    },
    {
      title: 'Appointment Metrics',
      icon: Calendar,
      stats: [
        { label: 'Total Appointments', value: (metrics?.today_appointments || 0) + (metrics?.upcoming_appointments || 0) },
        { label: 'Completion Rate', value: '94%' },
        { label: 'No-show Rate', value: `${((metrics?.no_shows || 0) / Math.max(1, (metrics?.today_appointments || 1)) * 100).toFixed(1)}%` },
      ]
    },
    {
      title: 'Revenue Insights',
      icon: DollarSign,
      stats: [
        { label: 'This Month', value: '₹1,25,000' },
        { label: 'vs Last Month', value: '+15%' },
        { label: 'Outstanding', value: '₹12,500' },
      ]
    },
    {
      title: 'Operational Efficiency',
      icon: Clock,
      stats: [
        { label: 'Avg Wait Time', value: '12 min' },
        { label: 'Consultation Time', value: '18 min' },
        { label: 'Utilization', value: '78%' },
      ]
    },
  ];

  return (
    <ClinicAdminLayout>
      <div data-testid="reports-page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>Reports & Analytics</h1>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: '1px solid hsl(214, 32%, 91%)' }}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {loading ? (
          <p>Loading reports...</p>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {reports.map((report, i) => (
                <div key={i} style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{ width: '40px', height: '40px', background: 'hsl(262, 83%, 95%)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(262, 83%, 58%)' }}>
                      <report.icon size={20} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>{report.title}</h3>
                  </div>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {report.stats.map((stat, j) => (
                      <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: j < report.stats.length - 1 ? '1px solid hsl(214, 32%, 95%)' : 'none' }}>
                        <span style={{ color: 'hsl(215, 16%, 47%)', fontSize: '0.875rem' }}>{stat.label}</span>
                        <span style={{ fontWeight: '600', color: stat.value.includes('+') ? 'hsl(158, 64%, 38%)' : stat.value.includes('-') ? 'hsl(0, 84%, 60%)' : 'hsl(215, 20%, 15%)' }}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Chart placeholder */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <BarChart3 size={24} color="hsl(262, 83%, 58%)" />
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600' }}>Appointment Trends</h3>
              </div>
              <div style={{ height: '250px', background: 'hsl(210, 40%, 98%)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(215, 16%, 47%)' }}>
                <div style={{ textAlign: 'center' }}>
                  <TrendingUp size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <p style={{ margin: 0 }}>Chart visualization coming soon</p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>Connect analytics service to enable charts</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ClinicAdminLayout>
  );
};

export default Reports;
