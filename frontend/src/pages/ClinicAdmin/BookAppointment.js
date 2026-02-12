import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClinicAdminLayout from '../../components/ClinicAdminLayout';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';
import { ArrowLeft, Plus } from 'lucide-react';

const BookAppointment = () => {
  useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [creatingPatient, setCreatingPatient] = useState(false);
  
  const [formData, setFormData] = useState({
    patient_id: '',
    slot_time: '',
    is_teleconsult: false
  });

  const [newPatientData, setNewPatientData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: 'Male',
    notes: ''
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

  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    setNewPatientData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    setCreatingPatient(true);

    try {
      const response = await api.post('/clinic-admin/patients', {
        ...newPatientData,
        age: parseInt(newPatientData.age) || 0
      });

      // Add new patient to list
      const newPatient = response.data;
      setPatients(prev => [...prev, newPatient]);

      // Auto-select the newly created patient
      setFormData(prev => ({ ...prev, patient_id: newPatient.id }));

      // Close modal and reset form
      setShowPatientModal(false);
      setNewPatientData({ name: '', phone: '', age: '', gender: 'Male', notes: '' });
    } catch (err) {
      console.error('Failed to create patient:', err);
      alert('Failed to create patient');
    } finally {
      setCreatingPatient(false);
    }
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
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <select
                  data-testid="appointment-patient-select"
                  id="patient_id"
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleChange}
                  required
                  style={{ flex: 1 }}
                >
                  <option value="">Select a patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} - {patient.phone}
                    </option>
                  ))}
                </select>
                <button
                  data-testid="add-patient-inline-button"
                  type="button"
                  onClick={() => setShowPatientModal(true)}
                  className="btn-secondary"
                  style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Plus size={16} />
                  Add New Patient
                </button>
              </div>
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

        {/* Inline Add Patient Modal */}
        {showPatientModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div data-testid="inline-patient-modal" style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }}>
              <h2 style={{ marginTop: 0 }}>Add New Patient</h2>

              <form data-testid="inline-patient-form" onSubmit={handleCreatePatient}>
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    data-testid="inline-patient-name"
                    id="name"
                    name="name"
                    type="text"
                    value={newPatientData.name}
                    onChange={handlePatientChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone *</label>
                  <input
                    data-testid="inline-patient-phone"
                    id="phone"
                    name="phone"
                    type="tel"
                    value={newPatientData.phone}
                    onChange={handlePatientChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <input
                    data-testid="inline-patient-age"
                    id="age"
                    name="age"
                    type="number"
                    min="0"
                    max="150"
                    value={newPatientData.age}
                    onChange={handlePatientChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gender">Gender *</label>
                  <select
                    data-testid="inline-patient-gender"
                    id="gender"
                    name="gender"
                    value={newPatientData.gender}
                    onChange={handlePatientChange}
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    data-testid="inline-patient-notes"
                    id="notes"
                    name="notes"
                    value={newPatientData.notes}
                    onChange={handlePatientChange}
                    rows="2"
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button 
                    data-testid="submit-inline-patient-button" 
                    type="submit" 
                    className="btn-primary" 
                    disabled={creatingPatient}
                  >
                    {creatingPatient ? 'Adding...' : 'Add Patient'}
                  </button>
                  <button
                    data-testid="cancel-inline-patient-button"
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setShowPatientModal(false);
                      setNewPatientData({ name: '', phone: '', age: '', gender: 'Male', notes: '' });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ClinicAdminLayout>
  );
};

export default BookAppointment;
