import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClinicAdminLayout from '../../components/ClinicAdminLayout';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const AppointmentsList = () => {
  useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await api.get('/clinic-admin/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'booked': return 'badge-trial';
      case 'completed': return 'badge-active';
      case 'cancelled': return 'badge-suspended';
      case 'no_show': return 'badge-suspended';
      default: return '';
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await api.put(`/clinic-admin/appointments/${appointmentId}`, { status: newStatus });
      await loadAppointments();
    } catch (error) {
      console.error('Failed to update appointment:', error);
    }
  };

  return (
    <ClinicAdminLayout>
      <div data-testid="appointments-list-page">
        <div className="page-header">
          <h1>Appointments</h1>
          <button data-testid="book-appointment-button" className="btn-primary" onClick={() => navigate('/clinic/appointments/new')}>
            <Plus size={18} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} />
            Book Appointment
          </button>
        </div>

        {loading ? (
          <div data-testid="appointments-loading">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div data-testid="no-appointments" style={{ background: 'white', padding: '3rem', textAlign: 'center', borderRadius: '0.5rem', border: '1px solid hsl(214, 32%, 91%)' }}>
            <CalendarIcon size={48} color="hsl(215, 16%, 47%)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: 'hsl(215, 16%, 47%)', marginBottom: '1.5rem' }}>No appointments booked yet</p>
            <button className="btn-primary" onClick={() => navigate('/clinic/appointments/new')}>
              Book First Appointment
            </button>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '0.5rem', border: '1px solid hsl(214, 32%, 91%)', overflow: 'hidden' }}>
            <table data-testid="appointments-table" className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id} data-testid={`appointment-row-${appointment.id}`}>
                    <td style={{ fontWeight: '500', color: 'hsl(215, 20%, 15%)' }}>{appointment.patient_name || 'Unknown'}</td>
                    <td>{format(parseISO(appointment.slot_time), 'PPp')}</td>
                    <td>
                      <span data-testid={`appointment-status-${appointment.id}`} className={`badge ${getStatusBadgeClass(appointment.status)}`}>
                        {appointment.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{appointment.is_teleconsult ? 'Teleconsult' : 'In-person'}</td>
                    <td>
                      {appointment.status === 'booked' && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            data-testid={`complete-appointment-${appointment.id}`}
                            onClick={() => handleStatusChange(appointment.id, 'completed')}
                            style={{ background: 'hsl(158, 64%, 38%)', color: 'white', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.8125rem' }}
                          >
                            Complete
                          </button>
                          <button
                            data-testid={`cancel-appointment-${appointment.id}`}
                            onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                            style={{ background: 'hsl(0, 84%, 60%)', color: 'white', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.8125rem' }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
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

export default AppointmentsList;
