import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentService from '../../services/appointment.service';
import AuthService from '../../services/auth.service';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await AppointmentService.getPatientAppointments(user.id);
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load appointments', err);
    } finally {
      setLoading(false);
    }
  };

  const upcoming = appointments.filter((a) => a.status === 'PENDING' || a.status === 'CONFIRMED');
  const completed = appointments.filter((a) => a.status === 'COMPLETED');
  const cancelled = appointments.filter((a) => a.status === 'CANCELLED');

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const getDay = (dateStr) => new Date(dateStr).getDate();
  const getMonth = (dateStr) => new Date(dateStr).toLocaleString('en-IN', { month: 'short' });

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.username} 👋</h1>
        <p>Here's an overview of your appointments</p>
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
          <div className="stat-icon blue">⏳</div>
          <div className="stat-info">
            <h3>{upcoming.length}</h3>
            <p>Upcoming</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div className="stat-info">
            <h3>{completed.length}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">❌</div>
          <div className="stat-info">
            <h3>{cancelled.length}</h3>
            <p>Cancelled</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="btn btn-primary" onClick={() => navigate('/patient/book')}>
          📅 Book Appointment
        </button>
        <button className="btn btn-outline" onClick={() => navigate('/patient/doctors')}>
          🔍 Find a Doctor
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/patient/appointments')}>
          📋 View All Appointments
        </button>
      </div>

      {/* Upcoming Appointments */}
      <div className="card">
        <div className="card-header">
          <h3 className="section-title">Upcoming Appointments</h3>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : upcoming.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No upcoming appointments</h3>
            <p>Book an appointment with a doctor to get started.</p>
          </div>
        ) : (
          upcoming.slice(0, 5).map((appt) => (
            <div className="appointment-card" key={appt.id}>
              <div className="appointment-date-box">
                <div className="day">{getDay(appt.appointmentDate)}</div>
                <div className="month">{getMonth(appt.appointmentDate)}</div>
              </div>
              <div className="appointment-info">
                <h4>Dr. {appt.doctor?.user?.username || 'Doctor'}</h4>
                <div className="appt-meta">
                  {appt.doctor?.specialization} • {formatTime(appt.appointmentDate)}
                </div>
              </div>
              <div className="appointment-actions">
                <span className={`badge badge-${appt.status.toLowerCase()}`}>{appt.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
