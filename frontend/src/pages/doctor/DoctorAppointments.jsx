import { useState, useEffect } from 'react';
import AppointmentService from '../../services/appointment.service';
import AuthService from '../../services/auth.service';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await AppointmentService.getDoctorAppointments(user.id);
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await AppointmentService.updateStatus(id, status);
      loadAppointments();
    } catch (err) {
      alert('Failed to update.');
    }
  };

  const filtered = appointments.filter((a) => {
    if (activeTab === 'pending') return a.status === 'PENDING';
    if (activeTab === 'confirmed') return a.status === 'CONFIRMED';
    if (activeTab === 'completed') return a.status === 'COMPLETED';
    if (activeTab === 'cancelled') return a.status === 'CANCELLED';
    return true;
  });

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Appointments 📋</h1>
        <p>Manage all your patient appointments</p>
      </div>

      <div className="tabs">
        {tabs.map((t) => (
          <button key={t.key} className={`tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No {activeTab !== 'all' ? activeTab : ''} appointments</h3>
          <p>There are no appointments matching this filter.</p>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((appt) => (
                  <tr key={appt.id}>
                    <td>{appt.patient?.user?.username || '—'}</td>
                    <td>{formatDate(appt.appointmentDate)}</td>
                    <td>{formatTime(appt.appointmentDate)}</td>
                    <td>
                      <span className={`badge badge-${appt.status.toLowerCase()}`}>
                        {appt.status}
                      </span>
                    </td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {appt.notes || '—'}
                    </td>
                    <td className="actions">
                      {appt.status === 'PENDING' && (
                        <>
                          <button className="btn btn-success btn-sm" onClick={() => handleAction(appt.id, 'CONFIRMED')}>
                            Confirm
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleAction(appt.id, 'CANCELLED')}>
                            Reject
                          </button>
                        </>
                      )}
                      {appt.status === 'CONFIRMED' && (
                        <button className="btn btn-primary btn-sm" onClick={() => handleAction(appt.id, 'COMPLETED')}>
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
