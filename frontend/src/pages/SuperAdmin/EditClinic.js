import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SuperAdminLayout from '../../components/SuperAdminLayout';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';
import { ArrowLeft, ToggleLeft, ToggleRight } from 'lucide-react';

const EditClinic = () => {
  useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [clinic, setClinic] = useState(null);
  
  const [formData, setFormData] = useState({
    clinic_name: '',
    clinic_type: 'Clinic',
    city: '',
    contact_person: '',
    phone: '',
    email: '',
    slot_duration: 20,
    subscription_status: 'trial',
    setup_fee: 0,
    monthly_fee: 0
  });

  useEffect(() => {
    loadClinic();
  }, [id]);

  const loadClinic = async () => {
    try {
      const response = await api.get(`/super-admin/clinics/${id}`);
      setClinic(response.data);
      setFormData({
        clinic_name: response.data.clinic_name,
        clinic_type: response.data.clinic_type,
        city: response.data.city,
        contact_person: response.data.contact_person,
        phone: response.data.phone,
        email: response.data.email,
        slot_duration: response.data.slot_duration,
        subscription_status: response.data.subscription_status,
        setup_fee: response.data.setup_fee,
        monthly_fee: response.data.monthly_fee
      });
    } catch (error) {
      console.error('Failed to load clinic:', error);
      setError('Failed to load clinic');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await api.put(`/super-admin/clinics/${id}`, formData);
      navigate('/super-admin/clinics');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update clinic');
    } finally {
      setSaving(false);
    }
  };

  const toggleFeature = async (feature) => {
    try {
      const enabled = !clinic.features[feature];
      await api.post(`/super-admin/clinics/${id}/toggle-feature`, { feature, enabled });
      setClinic(prev => ({
        ...prev,
        features: { ...prev.features, [feature]: enabled }
      }));
    } catch (err) {
      console.error('Failed to toggle feature:', err);
    }
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div data-testid="loading-state">Loading clinic...</div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div data-testid="edit-clinic-page">
        <div style={{ marginBottom: '2rem' }}>
          <button data-testid="back-to-clinics" onClick={() => navigate('/super-admin/clinics')} style={{ background: 'none', border: 'none', color: 'hsl(199, 89%, 37%)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem', fontWeight: '500', padding: 0 }}>
            <ArrowLeft size={18} />
            Back to Clinics
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', border: '1px solid hsl(214, 32%, 91%)' }}>
            <h1 style={{ marginTop: 0 }}>Edit Clinic</h1>

            {error && (
              <div data-testid="error-alert" style={{ background: 'hsl(0, 84%, 95%)', color: 'hsl(0, 70%, 40%)', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <form data-testid="edit-clinic-form" onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label htmlFor="clinic_name">Clinic Name *</label>
                  <input
                    data-testid="edit-clinic-name"
                    id="clinic_name"
                    name="clinic_name"
                    type="text"
                    value={formData.clinic_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="clinic_type">Clinic Type *</label>
                  <select
                    data-testid="edit-clinic-type"
                    id="clinic_type"
                    name="clinic_type"
                    value={formData.clinic_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="Clinic">Clinic</option>
                    <option value="Healthcare Center">Healthcare Center</option>
                    <option value="Diagnostic Center">Diagnostic Center</option>
                    <option value="Nursing Home">Nursing Home</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    data-testid="edit-city"
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact_person">Contact Person *</label>
                  <input
                    data-testid="edit-contact-person"
                    id="contact_person"
                    name="contact_person"
                    type="text"
                    value={formData.contact_person}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone *</label>
                  <input
                    data-testid="edit-phone"
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    data-testid="edit-email"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="slot_duration">Slot Duration (minutes) *</label>
                  <input
                    data-testid="edit-slot-duration"
                    id="slot_duration"
                    name="slot_duration"
                    type="number"
                    min="5"
                    step="5"
                    value={formData.slot_duration}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subscription_status">Subscription Status *</label>
                  <select
                    data-testid="edit-subscription-status"
                    id="subscription_status"
                    name="subscription_status"
                    value={formData.subscription_status}
                    onChange={handleChange}
                    required
                  >
                    <option value="trial">Trial</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="setup_fee">Setup Fee (₹)</label>
                  <input
                    data-testid="edit-setup-fee"
                    id="setup_fee"
                    name="setup_fee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.setup_fee}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="monthly_fee">Monthly Fee (₹)</label>
                  <input
                    data-testid="edit-monthly-fee"
                    id="monthly_fee"
                    name="monthly_fee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.monthly_fee}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button data-testid="save-changes-button" type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button data-testid="cancel-edit-button" type="button" className="btn-secondary" onClick={() => navigate('/super-admin/clinics')}>
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid hsl(214, 32%, 91%)', height: 'fit-content' }}>
            <h2 style={{ fontSize: '1.25rem', marginTop: 0 }}>Feature Toggles</h2>
            
            {clinic && Object.entries(clinic.features).map(([feature, enabled]) => (
              <div data-testid={`feature-toggle-${feature}`} key={feature} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid hsl(214, 32%, 91%)' }}>
                <span style={{ textTransform: 'capitalize', fontSize: '0.9375rem' }}>{feature.replace('_', ' ')}</span>
                <button
                  data-testid={`toggle-${feature}-button`}
                  onClick={() => toggleFeature(feature)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {enabled ? (
                    <ToggleRight size={32} color="hsl(158, 64%, 38%)" data-testid={`${feature}-enabled`} />
                  ) : (
                    <ToggleLeft size={32} color="hsl(215, 16%, 67%)" data-testid={`${feature}-disabled`} />
                  )}
                </button>
              </div>
            ))}

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'hsl(210, 40%, 98%)', borderRadius: '0.375rem', fontSize: '0.8125rem', color: 'hsl(215, 16%, 47%)' }}>
              <strong>Subdomain:</strong><br />
              <span style={{ fontFamily: 'monospace', color: 'hsl(199, 89%, 37%)' }}>{clinic?.slug}.clinikq.com</span>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default EditClinic;
