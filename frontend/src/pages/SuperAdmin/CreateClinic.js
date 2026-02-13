import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SuperAdminLayout from '../../components/SuperAdminLayout';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';
import { ArrowLeft } from 'lucide-react';

const CreateClinic = () => {
  useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activationLink, setActivationLink] = useState('');
  
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
    monthly_fee: 0,
    brand_color: '#0284C7',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/super-admin/clinics', formData);
      setActivationLink(response.data.activation_link);
      // Show success message with activation link
      alert(`Clinic created successfully!\n\nActivation Link: ${response.data.activation_link}\n\nThis link should be sent to: ${formData.email}`);
      navigate('/super-admin/clinics');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create clinic');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SuperAdminLayout>
      <div data-testid="create-clinic-page">
        <div style={{ marginBottom: '2rem' }}>
          <button data-testid="back-button" onClick={() => navigate('/super-admin/clinics')} style={{ background: 'none', border: 'none', color: 'hsl(199, 89%, 37%)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem', fontWeight: '500', padding: 0 }}>
            <ArrowLeft size={18} />
            Back to Clinics
          </button>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', border: '1px solid hsl(214, 32%, 91%)', maxWidth: '800px' }}>
          <h1 style={{ marginTop: 0 }}>Create New Clinic</h1>

          {error && (
            <div data-testid="error-message" style={{ background: 'hsl(0, 84%, 95%)', color: 'hsl(0, 70%, 40%)', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form data-testid="clinic-form" onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <label htmlFor="clinic_name">Clinic Name *</label>
                <input
                  data-testid="input-clinic-name"
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
                  data-testid="input-clinic-type"
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
                  data-testid="input-city"
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
                  data-testid="input-contact-person"
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
                  data-testid="input-phone"
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
                  data-testid="input-email"
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
                  data-testid="input-slot-duration"
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
                  data-testid="input-subscription-status"
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
                  data-testid="input-setup-fee"
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
                  data-testid="input-monthly-fee"
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
              <button data-testid="submit-clinic-button" type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Clinic'}
              </button>
              <button data-testid="cancel-button" type="button" className="btn-secondary" onClick={() => navigate('/super-admin/clinics')}>
                Cancel
              </button>
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'hsl(210, 40%, 98%)', borderRadius: '0.375rem', fontSize: '0.875rem', color: 'hsl(215, 16%, 47%)' }}>
              <strong>Note:</strong> A default admin account will be created with email as login and password: <strong>clinic@123</strong>
            </div>
          </form>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default CreateClinic;
