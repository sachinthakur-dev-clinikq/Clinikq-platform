import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClinicAdminLayout from '../../components/ClinicAdminLayout';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';
import { ArrowLeft } from 'lucide-react';

const BookAppointment = () => {
  useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    patient_id: '',
    slot_time: '',
    is_teleconsult: false
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await api.get('/clinic-admin/patients');
      setPatients(response.data.filter(p => p.is_active));
    } catch (error) {
      console.error('Failed to load patients:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/clinic-admin/appointments', formData);
      navigate('/clinic/appointments');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClinicAdminLayout>
      <div data-testid="book-appointment-page">
        <div style={{ marginBottom: '2rem' }}>
          <button data-testid="back-to-appointments" onClick={() => navigate('/clinic/appointments')} style={{ background: 'none', border: 'none', color: 'hsl(199, 89%, 37%)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem', fontWeight: '500', padding: 0 }}>
            <ArrowLeft size={18} />
            Back to Appointments
          </button>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', border: '1px solid hsl(214, 32%, 91%)', maxWidth: '700px' }}>
          <h1 style={{ marginTop: 0 }}>Book Appointment</h1>

          {error && (
            <div data-testid="appointment-error" style={{ background: 'hsl(0, 84%, 95%)', color: 'hsl(0, 70%, 40%)', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form data-testid="book-appointment-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="patient_id">Patient *</label>
              <select
                data-testid="appointment-patient-select"
                id="patient_id"
                name="patient_id"
                value={formData.patient_id}
                onChange={handleChange}
                required
              >
                <option value="">Select a patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} - {patient.phone}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="slot_time">Appointment Date & Time *</label>
              <input
                data-testid="appointment-datetime-input"
                id="slot_time"
                name="slot_time"
                type="datetime-local"
                value={formData.slot_time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  data-testid="appointment-teleconsult-checkbox"
                  type="checkbox"
                  name="is_teleconsult"
                  checked={formData.is_teleconsult}
                  onChange={handleChange}
                  style={{ width: 'auto' }}
                />
                Teleconsultation
              </label>
            </div>

            {patients.length === 0 && (
              <div style={{ background: 'hsl(45, 93%, 95%)', color: 'hsl(25, 95%, 30%)', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                No active patients found. Please add a patient first.
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button 
                data-testid="submit-appointment-button" 
                type="submit" 
                className="btn-primary" 
                disabled={loading || patients.length === 0}
              >
                {loading ? 'Booking...' : 'Book Appointment'}
              </button>
              <button data-testid="cancel-appointment-button" type="button" className="btn-secondary" onClick={() => navigate('/clinic/appointments')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </ClinicAdminLayout>
  );
};

export default BookAppointment;
