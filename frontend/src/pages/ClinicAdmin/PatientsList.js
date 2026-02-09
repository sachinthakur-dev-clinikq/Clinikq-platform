import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClinicAdminLayout from '../../components/ClinicAdminLayout';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';
import { Plus, Edit } from 'lucide-react';

const PatientsList = () => {
  useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await api.get('/clinic-admin/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Failed to load patients:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClinicAdminLayout>
      <div data-testid="patients-list-page">
        <div className="page-header">
          <h1>Patients</h1>
          <button data-testid="add-patient-button" className="btn-primary" onClick={() => navigate('/clinic/patients/new')}>
            <Plus size={18} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} />
            Add Patient
          </button>
        </div>

        {loading ? (
          <div data-testid="patients-loading">Loading patients...</div>
        ) : patients.length === 0 ? (
          <div data-testid="no-patients" style={{ background: 'white', padding: '3rem', textAlign: 'center', borderRadius: '0.5rem', border: '1px solid hsl(214, 32%, 91%)' }}>
            <p style={{ color: 'hsl(215, 16%, 47%)', marginBottom: '1.5rem' }}>No patients added yet</p>
            <button className="btn-primary" onClick={() => navigate('/clinic/patients/new')}>
              Add First Patient
            </button>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '0.5rem', border: '1px solid hsl(214, 32%, 91%)', overflow: 'hidden' }}>
            <table data-testid="patients-table" className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} data-testid={`patient-row-${patient.id}`}>
                    <td style={{ fontWeight: '500', color: 'hsl(215, 20%, 15%)' }}>{patient.name}</td>
                    <td>{patient.phone}</td>
                    <td>{patient.age}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.notes || '-'}</td>
                    <td>
                      <span className={`badge ${patient.is_active ? 'badge-active' : 'badge-suspended'}`}>
                        {patient.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button 
                        data-testid={`edit-patient-${patient.id}`}
                        onClick={() => navigate(`/clinic/patients/${patient.id}/edit`)}
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
      </div>
    </ClinicAdminLayout>
  );
};

export default PatientsList;
