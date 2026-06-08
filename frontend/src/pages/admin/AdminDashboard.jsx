import { useState } from 'react';

const AdminDashboard = () => {
  // Mock data since we don't have admin-specific APIs yet
  const [stats] = useState({
    totalPatients: 124,
    totalDoctors: 18,
    totalAppointments: 567,
    departments: 8,
  });

  const recentRegistrations = [
    { id: 1, name: 'Rahul Sharma', type: 'Patient', date: '2026-06-03' },
    { id: 2, name: 'Dr. Priya Gupta', type: 'Doctor', date: '2026-06-02' },
    { id: 3, name: 'Amit Patel', type: 'Patient', date: '2026-06-01' },
    { id: 4, name: 'Dr. Vikram Singh', type: 'Doctor', date: '2026-05-31' },
    { id: 5, name: 'Sneha Roy', type: 'Patient', date: '2026-05-30' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard 🛡️</h1>
        <p>System overview and management</p>
      </div>

      {/* Stats */}
      <div className="stats-grid stagger">
        <div className="stat-card">
          <div className="stat-icon blue">🧑</div>
          <div className="stat-info">
            <h3>{stats.totalPatients}</h3>
            <p>Total Patients</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">🩺</div>
          <div className="stat-info">
            <h3>{stats.totalDoctors}</h3>
            <p>Total Doctors</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon teal">📅</div>
          <div className="stat-info">
            <h3>{stats.totalAppointments}</h3>
            <p>Total Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">🏥</div>
          <div className="stat-info">
            <h3>{stats.departments}</h3>
            <p>Departments</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Activity Overview */}
        <div className="card">
          <div className="card-header">
            <h3 className="section-title">Activity Overview</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Appointments this month', value: 87, max: 100, color: 'var(--accent-primary)' },
              { label: 'New Registrations', value: 23, max: 50, color: 'var(--accent-secondary)' },
              { label: 'Completed Visits', value: 64, max: 87, color: 'var(--success)' },
              { label: 'Cancellation Rate', value: 12, max: 100, color: 'var(--warning)' },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span className="text-sm text-muted">{item.label}</span>
                  <span className="text-sm" style={{ fontWeight: 600 }}>{item.value}{item.label.includes('Rate') ? '%' : ''}</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg-glass)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${(item.value / item.max) * 100}%`,
                    background: item.color,
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 1s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="card">
          <div className="card-header">
            <h3 className="section-title">Recent Registrations</h3>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentRegistrations.map((reg) => (
                  <tr key={reg.id}>
                    <td>{reg.name}</td>
                    <td>
                      <span className={`badge ${reg.type === 'Doctor' ? 'badge-confirmed' : 'badge-pending'}`}>
                        {reg.type}
                      </span>
                    </td>
                    <td>{new Date(reg.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
