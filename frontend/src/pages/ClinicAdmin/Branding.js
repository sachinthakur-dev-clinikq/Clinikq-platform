import React, { useEffect, useState } from 'react';
import ClinicAdminLayout from '../../components/ClinicAdminLayout';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';
import { Save, Upload, Palette, Building2 } from 'lucide-react';

const Branding = () => {
  useAuth();
  const [branding, setBranding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    loadBranding();
  }, []);

  const loadBranding = async () => {
    try {
      const response = await api.get('/clinic-admin/branding');
      setBranding(response.data);
    } catch (error) {
      console.error('Failed to load branding:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBranding(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLogoFile(file);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/clinic-admin/branding/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setBranding(prev => ({ ...prev, logo_path: response.data.path }));
      setSuccess('Logo uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to upload logo:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setSaving(true);

    try {
      await api.put('/clinic-admin/branding', {
        display_name: branding.display_name,
        brand_color: branding.brand_color,
        address: branding.address,
        contact_phone: branding.contact_phone,
        contact_email: branding.contact_email
      });
      setSuccess('Branding updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to save branding:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ClinicAdminLayout>
        <div data-testid="branding-loading">Loading...</div>
      </ClinicAdminLayout>
    );
  }

  return (
    <ClinicAdminLayout>
      <div data-testid="branding-page">
        <div className="page-header">
          <h1>Clinic Branding</h1>
        </div>

        {success && (
          <div data-testid="branding-success" style={{ background: 'hsl(142, 76%, 87%)', color: 'hsl(142, 71%, 25%)', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {success}
          </div>
        )}

        <form data-testid="branding-form" onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Logo Upload */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid hsl(214, 32%, 91%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Upload size={24} color="hsl(199, 89%, 37%)" />
                <h2 style={{ margin: 0, fontSize: '1.125rem' }}>Clinic Logo</h2>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {branding?.logo_path && (
                  <div style={{ width: '100px', height: '100px', border: '1px solid hsl(214, 32%, 91%)', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'hsl(210, 40%, 98%)' }}>
                    <img src={branding.logo_path} alt="Clinic Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                )}

                <div>
                  <input
                    data-testid="logo-upload-input"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    style={{ display: 'none' }}
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" className="btn-secondary" style={{ cursor: 'pointer', display: 'inline-block' }}>
                    Upload Logo
                  </label>
                  <p style={{ fontSize: '0.875rem', color: 'hsl(215, 16%, 47%)', marginTop: '0.5rem' }}>
                    Recommended: Square image, PNG or JPG
                  </p>
                </div>
              </div>
            </div>

            {/* Brand Color */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid hsl(214, 32%, 91%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Palette size={24} color="hsl(199, 89%, 37%)" />
                <h2 style={{ margin: 0, fontSize: '1.125rem' }}>Brand Color</h2>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input
                  data-testid="brand-color-input"
                  type="color"
                  name="brand_color"
                  value={branding?.brand_color || '#0284C7'}
                  onChange={handleChange}
                  style={{ width: '80px', height: '80px', border: '1px solid hsl(214, 32%, 91%)', borderRadius: '0.375rem', cursor: 'pointer' }}
                />
                <div>
                  <p style={{ margin: 0, fontWeight: '500', color: 'hsl(215, 20%, 15%)' }}>{branding?.brand_color}</p>
                  <p style={{ fontSize: '0.875rem', color: 'hsl(215, 16%, 47%)', margin: '0.25rem 0 0 0' }}>
                    This color will be used across your clinic portal
                  </p>
                </div>
              </div>
            </div>

            {/* Clinic Profile */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid hsl(214, 32%, 91%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Building2 size={24} color="hsl(199, 89%, 37%)" />
                <h2 style={{ margin: 0, fontSize: '1.125rem' }}>Clinic Profile</h2>
              </div>

              <div style={{ display: 'grid', gap: '1.25rem' }}>
                <div className="form-group">
                  <label htmlFor="display_name">Display Name *</label>
                  <input
                    data-testid="display-name-input"
                    id="display_name"
                    name="display_name"
                    type="text"
                    value={branding?.display_name || ''}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <textarea
                    data-testid="address-input"
                    id="address"
                    name="address"
                    value={branding?.address || ''}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label htmlFor="contact_phone">Contact Phone</label>
                    <input
                      data-testid="contact-phone-input"
                      id="contact_phone"
                      name="contact_phone"
                      type="tel"
                      value={branding?.contact_phone || ''}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact_email">Contact Email</label>
                    <input
                      data-testid="contact-email-input"
                      id="contact_email"
                      name="contact_email"
                      type="email"
                      value={branding?.contact_email || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button data-testid="save-branding-button" type="submit" className="btn-primary" disabled={saving}>
              <Save size={18} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </ClinicAdminLayout>
  );
};

export default Branding;
