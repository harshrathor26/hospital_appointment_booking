import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppointmentService from '../../services/appointment.service';
import DoctorService from '../../services/doctor.service';
import AuthService from '../../services/auth.service';

const BookAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();

  const prefilledDoctor = location.state?.doctor || null;

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(prefilledDoctor?.id || '');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (!prefilledDoctor) {
      DoctorService.getAllDoctors()
        .then((data) => setDoctors(data))
        .catch(() => {});
    }
  }, [prefilledDoctor]);

  const selectedDoctor = prefilledDoctor || doctors.find((d) => d.id === Number(selectedDoctorId));

  const handleReview = (e) => {
    e.preventDefault();
    setError('');
    if (!selectedDoctorId || !appointmentDate || !appointmentTime) {
      setError('Please fill in all required fields.');
      return;
    }
    setShowSummary(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const dateTime = `${appointmentDate}T${appointmentTime}:00`;
      await AppointmentService.bookAppointment({
        patientId: user.id,
        doctorId: Number(selectedDoctorId),
        appointmentDate: dateTime,
        notes,
      });
      setSuccess('Appointment booked successfully!');
      setTimeout(() => navigate('/patient/appointments'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment.');
      setShowSummary(false);
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="booking-container">
      <div className="dashboard-header">
        <h1>Book Appointment 📅</h1>
        <p>Schedule a visit with your preferred doctor</p>
      </div>

      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {success && <div className="alert alert-success">✅ {success}</div>}

      {!showSummary ? (
        <div className="card">
          <form onSubmit={handleReview}>
            {prefilledDoctor ? (
              <div className="form-group">
                <label>Selected Doctor</label>
                <div className="doctor-card" style={{ marginBottom: 0 }}>
                  <div className="doctor-card-header">
                    <div className="doctor-avatar">{prefilledDoctor.user?.username?.charAt(0)?.toUpperCase()}</div>
                    <div>
                      <h3>Dr. {prefilledDoctor.user?.username}</h3>
                      <div className="doctor-spec">{prefilledDoctor.specialization}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="book-doctor">Select Doctor</label>
                <select
                  id="book-doctor"
                  className="form-control"
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  required
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      Dr. {d.user?.username} — {d.specialization}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="book-date">Date</label>
                <input
                  id="book-date"
                  type="date"
                  className="form-control"
                  value={appointmentDate}
                  min={today}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="book-time">Time</label>
                <input
                  id="book-time"
                  type="time"
                  className="form-control"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="book-notes">Notes / Reason for Visit</label>
              <textarea
                id="book-notes"
                className="form-control"
                placeholder="Briefly describe your symptoms or reason…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Review Appointment
            </button>
          </form>
        </div>
      ) : (
        <div className="card">
          <h3 className="section-title" style={{ marginBottom: 20 }}>Confirm Your Appointment</h3>

          <div className="booking-summary">
            <div className="summary-row">
              <span className="label">Doctor</span>
              <span>Dr. {selectedDoctor?.user?.username}</span>
            </div>
            <div className="summary-row">
              <span className="label">Specialization</span>
              <span>{selectedDoctor?.specialization}</span>
            </div>
            <div className="summary-row">
              <span className="label">Date</span>
              <span>{new Date(appointmentDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="summary-row">
              <span className="label">Time</span>
              <span>{appointmentTime}</span>
            </div>
            {notes && (
              <div className="summary-row">
                <span className="label">Notes</span>
                <span>{notes}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-secondary" onClick={() => setShowSummary(false)} style={{ flex: 1 }}>
              ← Go Back
            </button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Booking…' : '✅ Confirm Booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
