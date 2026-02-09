import React, { useEffect, useState } from 'react';
import ClinicAdminLayout from '../../components/ClinicAdminLayout';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';
import { MessageSquare, Video, CreditCard, Pill, Save } from 'lucide-react';

const ClinicSettings = () => {
  useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await api.get('/clinic-admin/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setSaving(true);

    try {
      await api.put('/clinic-admin/settings', settings);
      setSuccess('Settings saved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ClinicAdminLayout>
        <div data-testid="settings-loading">Loading settings...</div>
      </ClinicAdminLayout>
    );
  }

  return (
    <ClinicAdminLayout>
      <div data-testid="clinic-settings-page">
        <div className="page-header">
          <h1>Settings</h1>
        </div>

        {success && (
          <div data-testid="settings-success" style={{ background: 'hsl(142, 76%, 87%)', color: 'hsl(142, 71%, 25%)', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {success}
          </div>
        )}

        <form data-testid="settings-form" onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* WhatsApp Settings */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid hsl(214, 32%, 91%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <MessageSquare size={24} color="hsl(158, 64%, 38%)" />
                <h2 style={{ margin: 0, fontSize: '1.125rem' }}>WhatsApp Notifications</h2>
              </div>
              
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    data-testid="whatsapp-enabled-checkbox"
                    type="checkbox"
                    name="whatsapp_enabled"
                    checked={settings?.whatsapp_enabled || false}
                    onChange={handleChange}
                    style={{ width: 'auto' }}
                  />
                  Enable WhatsApp Notifications
                </label>
              </div>
              
              <p style={{ fontSize: '0.875rem', color: 'hsl(215, 16%, 47%)', margin: 0 }}>
                Automatically send appointment reminders via WhatsApp (Coming Soon)
              </p>
            </div>

            {/* Teleconsultation Settings */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid hsl(214, 32%, 91%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Video size={24} color="hsl(199, 89%, 37%)" />
                <h2 style={{ margin: 0, fontSize: '1.125rem' }}>Teleconsultation</h2>
              </div>
              
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    data-testid="teleconsult-enabled-checkbox"
                    type="checkbox"
                    name="teleconsult_enabled"
                    checked={settings?.teleconsult_enabled || false}
                    onChange={handleChange}
                    style={{ width: 'auto' }}
                  />
                  Enable Teleconsultation
                </label>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    data-testid="teleconsult-followup-checkbox"
                    type="checkbox"
                    name="teleconsult_followup_only"
                    checked={settings?.teleconsult_followup_only || false}
                    onChange={handleChange}
                    style={{ width: 'auto' }}
                    disabled={!settings?.teleconsult_enabled}
                  />
                  Allow for follow-ups only
                </label>
              </div>
            </div>

            {/* Payment Settings */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid hsl(214, 32%, 91%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <CreditCard size={24} color="hsl(199, 89%, 37%)" />
                <h2 style={{ margin: 0, fontSize: '1.125rem' }}>Payment Details</h2>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label htmlFor="bank_account">Bank Account Number</label>
                  <input
                    data-testid="bank-account-input"
                    id="bank_account"
                    name="bank_account"
                    type="text"
                    value={settings?.bank_account || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="upi_id">UPI ID</label>
                  <input
                    data-testid="upi-id-input"
                    id="upi_id"
                    name="upi_id"
                    type="text"
                    value={settings?.upi_id || ''}
                    onChange={handleChange}
                    placeholder="example@upi"
                  />
                </div>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'hsl(215, 16%, 47%)', marginTop: '1rem', marginBottom: 0 }}>
                Payment QR code upload (Coming Soon)
              </p>
            </div>

            {/* Pharmacy Settings */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid hsl(214, 32%, 91%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Pill size={24} color="hsl(158, 64%, 38%)" />
                <h2 style={{ margin: 0, fontSize: '1.125rem' }}>Pharmacy Integration</h2>
              </div>
              
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    data-testid="pharmacy-enabled-checkbox"
                    type="checkbox"
                    name="pharmacy_enabled"
                    checked={settings?.pharmacy_enabled || false}
                    onChange={handleChange}
                    style={{ width: 'auto' }}
                  />
                  Enable Pharmacy Integration
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="pharmacy_name">Preferred Pharmacy Name</label>
                <input
                  data-testid="pharmacy-name-input"
                  id="pharmacy_name"
                  name="pharmacy_name"
                  type="text"
                  value={settings?.pharmacy_name || ''}
                  onChange={handleChange}
                  disabled={!settings?.pharmacy_enabled}
                />
              </div>

              <p style={{ fontSize: '0.875rem', color: 'hsl(215, 16%, 47%)', margin: 0 }}>
                Share prescriptions directly with pharmacy (Coming Soon)
              </p>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button data-testid="save-settings-button" type="submit" className="btn-primary" disabled={saving}>
              <Save size={18} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </ClinicAdminLayout>
  );
};

export default ClinicSettings;
