import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorService from '../../services/doctor.service';
import DepartmentService from '../../services/department.service';

const DoctorSearch = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    DepartmentService.getAllDepartments()
      .then((data) => setDepartments(data))
      .catch(() => {});
    loadDoctors();
  }, []);

  const loadDoctors = async (deptId) => {
    setLoading(true);
    try {
      let data;
      if (deptId) {
        data = await DoctorService.getDoctorsByDepartment(deptId);
      } else {
        data = await DoctorService.getAllDoctors();
      }
      setDoctors(data);
    } catch (err) {
      console.error('Failed to load doctors', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeptChange = (e) => {
    const val = e.target.value;
    setSelectedDept(val);
    loadDoctors(val || null);
  };

  const filteredDoctors = doctors.filter((doc) => {
    const name = doc.user?.username?.toLowerCase() || '';
    const spec = doc.specialization?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();
    return name.includes(term) || spec.includes(term);
  });

  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Find a Doctor 🔍</h1>
        <p>Browse our qualified doctors and book an appointment</p>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or specialization…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="form-control" value={selectedDept} onChange={handleDeptChange} style={{ maxWidth: 220 }}>
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : filteredDoctors.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🩺</div>
          <h3>No doctors found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="doctor-grid stagger">
          {filteredDoctors.map((doc, i) => (
            <div className="doctor-card" key={doc.id} style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="doctor-card-header">
                <div className="doctor-avatar">{getInitial(doc.user?.username)}</div>
                <div>
                  <h3>Dr. {doc.user?.username || 'Unknown'}</h3>
                  <div className="doctor-spec">{doc.specialization}</div>
                </div>
              </div>
              <div className="doctor-card-body">
                <div className="doctor-detail">
                  <span className="detail-icon">🏥</span>
                  {doc.department?.name || 'General'}
                </div>
                <div className="doctor-detail">
                  <span className="detail-icon">⏱️</span>
                  {doc.experienceYears} years experience
                </div>
                <div className="doctor-detail">
                  <span className="detail-icon">🎓</span>
                  {doc.qualifications}
                </div>
              </div>
              <button
                className="btn btn-primary btn-sm"
                style={{ width: '100%' }}
                onClick={() => navigate('/patient/book', { state: { doctor: doc } })}
              >
                📅 Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorSearch;
