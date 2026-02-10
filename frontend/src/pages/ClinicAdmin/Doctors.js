import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClinicAdminLayout from '../../components/ClinicAdminLayout';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';
import { Plus, Edit, ToggleLeft, ToggleRight } from 'lucide-react';

const DoctorsList = () => {
  useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    speciality: '',
    consultation_fee: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const response = await api.get('/clinic-admin/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Failed to load doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        consultation_fee: parseFloat(formData.consultation_fee)
      };

      if (editingDoctor) {
        await api.put(`/clinic-admin/doctors/${editingDoctor.id}`, data);
      } else {
        await api.post('/clinic-admin/doctors', data);
      }

      setShowModal(false);
      setEditingDoctor(null);
      setFormData({ name: '', speciality: '', consultation_fee: '', phone: '', email: '' });
      await loadDoctors();
    } catch (error) {
      console.error('Failed to save doctor:', error);
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      speciality: doctor.speciality,
      consultation_fee: doctor.consultation_fee.toString(),
      phone: doctor.phone || '',
      email: doctor.email || ''
    });
    setShowModal(true);
  };

  const toggleStatus = async (doctor) => {
    try {
      await api.put(`/clinic-admin/doctors/${doctor.id}`, {
        is_active: !doctor.is_active
      });
      await loadDoctors();
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  return (
    <ClinicAdminLayout>
      <div data-testid="doctors-list-page">
        <div className="page-header">
          <h1>Doctors & Staff</h1>
          <button
            data-testid="add-doctor-button"
            className="btn-primary"
            onClick={() => {
              setEditingDoctor(null);
              setFormData({ name: '', speciality: '', consultation_fee: '', phone: '', email: '' });
              setShowModal(true);
            }}
          >
            <Plus size={18} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} />
            Add Doctor
          </button>
        </div>

        {loading ? (
          <div data-testid="doctors-loading">Loading doctors...</div>
        ) : doctors.length === 0 ? (
          <div data-testid="no-doctors" style={{ background: 'white', padding: '3rem', textAlign: 'center', borderRadius: '0.5rem', border: '1px solid hsl(214, 32%, 91%)' }}>
            <p style={{ color: 'hsl(215, 16%, 47%)', marginBottom: '1.5rem' }}>No doctors added yet</p>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              Add First Doctor
            </button>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '0.5rem', border: '1px solid hsl(214, 32%, 91%)', overflow: 'hidden' }}>
            <table data-testid="doctors-table" className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Speciality</th>
                  <th>Consultation Fee</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.id} data-testid={`doctor-row-${doctor.id}`}>
                    <td style={{ fontWeight: '500', color: 'hsl(215, 20%, 15%)' }}>{doctor.name}</td>
                    <td>{doctor.speciality}</td>
                    <td>₹{doctor.consultation_fee}</td>
                    <td>{doctor.phone || '-'}</td>
                    <td>
                      <button
                        data-testid={`toggle-doctor-${doctor.id}`}
                        onClick={() => toggleStatus(doctor)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        {doctor.is_active ? (
                          <ToggleRight size={28} color="hsl(158, 64%, 38%)" />
                        ) : (
                          <ToggleLeft size={28} color="hsl(215, 16%, 67%)" />
                        )}
                      </button>
                    </td>
                    <td>
                      <button
                        data-testid={`edit-doctor-${doctor.id}`}
                        onClick={() => handleEdit(doctor)}
                        style={{ background: 'none', border: 'none', color: 'hsl(199, 89%, 37%)', cursor: 'pointer', padding: '0.25rem 0.5rem' }}
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div data-testid="doctor-modal" style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }}>
              <h2 style={{ marginTop: 0 }}>{editingDoctor ? 'Edit Doctor' : 'Add Doctor'}</h2>

              <form data-testid="doctor-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    data-testid="doctor-name-input"
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="speciality">Speciality *</label>
                  <input
                    data-testid="doctor-speciality-input"
                    id="speciality"
                    type="text"
                    value={formData.speciality}
                    onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                    required
                    placeholder="e.g., General Physician, Cardiologist"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="consultation_fee">Consultation Fee (₹) *</label>
                  <input
                    data-testid="doctor-fee-input"
                    id="consultation_fee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.consultation_fee}
                    onChange={(e) => setFormData({ ...formData, consultation_fee: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    data-testid="doctor-phone-input"
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    data-testid="doctor-email-input"
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button data-testid="submit-doctor-button" type="submit" className="btn-primary">
                    {editingDoctor ? 'Update' : 'Add'} Doctor
                  </button>
                  <button
                    data-testid="cancel-doctor-button"
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setEditingDoctor(null);
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

export default DoctorsList;
