import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SuperAdminLayout from '../../components/SuperAdminLayout';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';
import { Plus, Edit, TrendingUp } from 'lucide-react';

const ClinicsList = () => {
  useAuth();
  const navigate = useNavigate();
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClinics();
  }, []);

  const loadClinics = async () => {
    try {
      const response = await api.get('/super-admin/clinics');
      setClinics(response.data);
    } catch (error) {
      console.error('Failed to load clinics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active': return 'badge-active';
      case 'trial': return 'badge-trial';
      case 'suspended': return 'badge-suspended';
      default: return '';
    }
  };

  return (
    <SuperAdminLayout>
      <div data-testid="clinics-list-page">
        <div className="page-header">
          <h1>Clinics</h1>
          <button data-testid="create-clinic-button" className="btn-primary" onClick={() => navigate('/super-admin/clinics/new')}>
            <Plus size={18} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} />
            Create Clinic
          </button>
        </div>

        {loading ? (
          <div data-testid="clinics-loading">Loading clinics...</div>
        ) : clinics.length === 0 ? (
          <div data-testid="no-clinics" style={{ background: 'white', padding: '3rem', textAlign: 'center', borderRadius: '0.5rem', border: '1px solid hsl(214, 32%, 91%)' }}>
            <Building2 size={48} color="hsl(215, 16%, 47%)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: 'hsl(215, 16%, 47%)', marginBottom: '1.5rem' }}>No clinics created yet</p>
            <button className="btn-primary" onClick={() => navigate('/super-admin/clinics/new')}>
              Create First Clinic
            </button>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '0.5rem', border: '1px solid hsl(214, 32%, 91%)', overflow: 'hidden' }}>
            <table data-testid="clinics-table" className="table">
              <thead>
                <tr>
                  <th>Clinic Name</th>
                  <th>Type</th>
                  <th>City</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Subdomain</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clinics.map((clinic) => (
                  <tr key={clinic.id} data-testid={`clinic-row-${clinic.id}`}>
                    <td style={{ fontWeight: '500', color: 'hsl(215, 20%, 15%)' }}>{clinic.clinic_name}</td>
                    <td>{clinic.clinic_type}</td>
                    <td>{clinic.city}</td>
                    <td>{clinic.contact_person}</td>
                    <td>
                      <span data-testid={`clinic-status-${clinic.id}`} className={`badge ${getStatusBadgeClass(clinic.subscription_status)}`}>
                        {clinic.subscription_status}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{clinic.slug}.clinikq.com</td>
                    <td>
                      <button 
                        data-testid={`edit-clinic-${clinic.id}`}
                        onClick={() => navigate(`/super-admin/clinics/${clinic.id}/edit`)}
                        style={{ background: 'none', border: 'none', color: 'hsl(199, 89%, 37%)', cursor: 'pointer', padding: '0.25rem 0.5rem' }}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        data-testid={`view-stats-${clinic.id}`}
                        onClick={() => navigate(`/super-admin/clinics/${clinic.id}/stats`)}
                        style={{ background: 'none', border: 'none', color: 'hsl(158, 64%, 38%)', cursor: 'pointer', padding: '0.25rem 0.5rem' }}
                      >
                        <TrendingUp size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
};

export default ClinicsList;
