import { useState, useEffect } from 'react';
import AppointmentService from '../../services/appointment.service';
import AuthService from '../../services/auth.service';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await AppointmentService.getPatientAppointments(user.id);
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await AppointmentService.updateStatus(id, 'CANCELLED');
      loadAppointments();
    } catch (err) {
      alert('Failed to cancel appointment.');
    }
  };

  const filtered = appointments.filter((a) => {
    if (activeTab === 'upcoming') return a.status === 'PENDING' || a.status === 'CONFIRMED';
    if (activeTab === 'completed') return a.status === 'COMPLETED';
    if (activeTab === 'cancelled') return a.status === 'CANCELLED';
    return true;
  });

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'upcoming', label: 'Upcoming' },
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
        <h1>My Appointments 📋</h1>
        <p>View and manage all your appointments</p>
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
          <h3>No appointments found</h3>
          <p>You don't have any {activeTab !== 'all' ? activeTab : ''} appointments yet.</p>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Department</th>
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
                    <td>Dr. {appt.doctor?.user?.username || '—'}</td>
                    <td>{appt.doctor?.department?.name || '—'}</td>
                    <td>{formatDate(appt.appointmentDate)}</td>
                    <td>{formatTime(appt.appointmentDate)}</td>
                    <td>
                      <span className={`badge badge-${appt.status.toLowerCase()}`}>
                        {appt.status}
                      </span>
                    </td>
                    <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {appt.notes || '—'}
                    </td>
                    <td className="actions">
                      {appt.status === 'PENDING' && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleCancel(appt.id)}>
                          Cancel
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

export default MyAppointments;
