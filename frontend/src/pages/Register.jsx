import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import DepartmentService from '../services/department.service';

const Register = () => {
  const [role, setRole] = useState('PATIENT');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    departmentId: '',
    specialization: '',
    experienceYears: '',
    qualifications: '',
  });
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    DepartmentService.getAllDepartments()
      .then((data) => setDepartments(data))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const payload = {
      username: formData.username,
      password: formData.password,
      role,
    };

    if (role === 'PATIENT') {
      payload.phone = formData.phone;
      payload.address = formData.address;
      payload.dateOfBirth = formData.dateOfBirth;
    } else {
      payload.departmentId = Number(formData.departmentId);
      payload.specialization = formData.specialization;
      payload.experienceYears = Number(formData.experienceYears);
      payload.qualifications = formData.qualifications;
    }

    try {
      await AuthService.register(payload);
      setSuccess('Registration successful! Redirecting to login…');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero-content">
          <div className="hero-logo">🏥</div>
          <h1>Join MediBook</h1>
          <p>
            Create an account as a patient or doctor. Start managing your
            appointments and healthcare journey today.
          </p>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Fill in your details to get started</p>

          <div className="role-toggle">
            <button className={role === 'PATIENT' ? 'active' : ''} onClick={() => setRole('PATIENT')} type="button">
              🧑 Patient
            </button>
            <button className={role === 'DOCTOR' ? 'active' : ''} onClick={() => setRole('DOCTOR')} type="button">
              🩺 Doctor
            </button>
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}
          {success && <div className="alert alert-success">✅ {success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reg-username">Username</label>
                <input id="reg-username" type="text" name="username" className="form-control" placeholder="Choose a username" value={formData.username} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="reg-password">Password</label>
                <input id="reg-password" type="password" name="password" className="form-control" placeholder="Create a password" value={formData.password} onChange={handleChange} required />
              </div>
            </div>

            {role === 'PATIENT' ? (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="reg-phone">Phone</label>
                    <input id="reg-phone" type="tel" name="phone" className="form-control" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="reg-dob">Date of Birth</label>
                    <input id="reg-dob" type="date" name="dateOfBirth" className="form-control" value={formData.dateOfBirth} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="reg-address">Address</label>
                  <input id="reg-address" type="text" name="address" className="form-control" placeholder="Your address" value={formData.address} onChange={handleChange} />
                </div>
              </>
            ) : (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="reg-dept">Department</label>
                    <select id="reg-dept" name="departmentId" className="form-control" value={formData.departmentId} onChange={handleChange} required>
                      <option value="">Select department</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="reg-spec">Specialization</label>
                    <input id="reg-spec" type="text" name="specialization" className="form-control" placeholder="e.g. Cardiologist" value={formData.specialization} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="reg-exp">Experience (years)</label>
                    <input id="reg-exp" type="number" name="experienceYears" className="form-control" placeholder="e.g. 5" value={formData.experienceYears} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="reg-qual">Qualifications</label>
                    <input id="reg-qual" type="text" name="qualifications" className="form-control" placeholder="e.g. MBBS, MD" value={formData.qualifications} onChange={handleChange} required />
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
