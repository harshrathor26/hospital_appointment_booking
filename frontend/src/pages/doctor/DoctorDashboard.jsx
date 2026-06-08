import { useState, useEffect } from 'react';
import AppointmentService from '../../services/appointment.service';
import AuthService from '../../services/auth.service';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
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
      alert('Failed to update appointment.');
    }
  };

  const pending = appointments.filter((a) => a.status === 'PENDING');
  const confirmed = appointments.filter((a) => a.status === 'CONFIRMED');
  const completed = appointments.filter((a) => a.status === 'COMPLETED');

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysAppts = appointments.filter(
    (a) => a.appointmentDate?.startsWith(todayStr) && (a.status === 'CONFIRMED' || a.status === 'PENDING')
  );

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, Dr. {user?.username} 👋</h1>
        <p>Manage your appointments and schedule</p>
      </div>

      {/* Stats */}
      <div className="stats-grid stagger">
        <div className="stat-card">
          <div className="stat-icon teal">📅</div>
          <div className="stat-info">
            <h3>{appointments.length}</h3>
            <p>Total Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">⏳</div>
          <div className="stat-info">
            <h3>{pending.length}</h3>
            <p>Pending Requests</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">📆</div>
          <div className="stat-info">
            <h3>{todaysAppts.length}</h3>
            <p>Today's Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div className="stat-info">
            <h3>{completed.length}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Today's Schedule */}
        <div className="card">
          <div className="card-header">
            <h3 className="section-title">Today's Schedule</h3>
          </div>
          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : todaysAppts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No appointments today</h3>
              <p>Enjoy your free day!</p>
            </div>
          ) : (
            todaysAppts.map((appt) => (
              <div className="appointment-card" key={appt.id}>
                <div className="appointment-info">
                  <h4>{appt.patient?.user?.username || 'Patient'}</h4>
                  <div className="appt-meta">{formatTime(appt.appointmentDate)} • {appt.notes || 'No notes'}</div>
                </div>
                <span className={`badge badge-${appt.status.toLowerCase()}`}>{appt.status}</span>
              </div>
            ))
          )}
        </div>

        {/* Pending Requests */}
        <div className="card">
          <div className="card-header">
            <h3 className="section-title">Pending Requests ({pending.length})</h3>
          </div>
          {pending.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✨</div>
              <h3>All caught up!</h3>
              <p>No pending requests to review.</p>
            </div>
          ) : (
            pending.slice(0, 5).map((appt) => (
              <div className="appointment-card" key={appt.id}>
                <div className="appointment-info">
                  <h4>{appt.patient?.user?.username || 'Patient'}</h4>
                  <div className="appt-meta">{formatDate(appt.appointmentDate)} at {formatTime(appt.appointmentDate)}</div>
                </div>
                <div className="appointment-actions">
                  <button className="btn btn-success btn-sm" onClick={() => handleAction(appt.id, 'CONFIRMED')}>
                    ✓ Accept
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleAction(appt.id, 'CANCELLED')}>
                    ✗ Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
