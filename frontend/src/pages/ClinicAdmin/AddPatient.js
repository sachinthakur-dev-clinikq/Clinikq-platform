import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClinicAdminLayout from '../../components/ClinicAdminLayout';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';
import { ArrowLeft } from 'lucide-react';

const AddPatient = () => {
  useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: 'Male',
    notes: ''
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
      await api.post('/clinic-admin/patients', {
        ...formData,
        age: parseInt(formData.age)
      });
      navigate('/clinic/patients');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClinicAdminLayout>
      <div data-testid="add-patient-page">
        <div style={{ marginBottom: '2rem' }}>
          <button data-testid="back-to-patients" onClick={() => navigate('/clinic/patients')} style={{ background: 'none', border: 'none', color: 'hsl(199, 89%, 37%)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem', fontWeight: '500', padding: 0 }}>
            <ArrowLeft size={18} />
            Back to Patients
          </button>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', border: '1px solid hsl(214, 32%, 91%)', maxWidth: '700px' }}>
          <h1 style={{ marginTop: 0 }}>Add New Patient</h1>

          {error && (
            <div data-testid="patient-error" style={{ background: 'hsl(0, 84%, 95%)', color: 'hsl(0, 70%, 40%)', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form data-testid="add-patient-form" onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="name">Name *</label>
                <input
                  data-testid="patient-name-input"
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone *</label>
                <input
                  data-testid="patient-phone-input"
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="age">Age *</label>
                <input
                  data-testid="patient-age-input"
                  id="age"
                  name="age"
                  type="number"
                  min="0"
                  max="150"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="gender">Gender *</label>
                <select
                  data-testid="patient-gender-select"
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="notes">Notes</label>
                <textarea
                  data-testid="patient-notes-textarea"
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button data-testid="submit-patient-button" type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Patient'}
              </button>
              <button data-testid="cancel-patient-button" type="button" className="btn-secondary" onClick={() => navigate('/clinic/patients')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </ClinicAdminLayout>
  );
};

export default AddPatient;
