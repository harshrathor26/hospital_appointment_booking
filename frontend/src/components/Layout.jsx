import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();
  const role = user?.role?.replace('ROLE_', '') || 'PATIENT';
  const initial = user?.username?.charAt(0)?.toUpperCase() || '?';

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  const patientLinks = [
    { to: '/patient/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/patient/doctors', icon: '🔍', label: 'Find Doctors' },
    { to: '/patient/book', icon: '📅', label: 'Book Appointment' },
    { to: '/patient/appointments', icon: '📋', label: 'My Appointments' },
  ];

  const doctorLinks = [
    { to: '/doctor/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/doctor/appointments', icon: '📋', label: 'Appointments' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  ];

  let navLinks = patientLinks;
  if (role === 'DOCTOR') navLinks = doctorLinks;
  if (role === 'ADMIN') navLinks = adminLinks;

  return (
    <div className="app-layout">
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={closeSidebar} />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">M</div>
          <span>MediBook</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Menu</div>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <span className="nav-icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">{initial}</div>
            <div className="user-info">
              <div className="user-name">{user?.username || 'User'}</div>
              <div className="user-role">{role.toLowerCase()}</div>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: 10 }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <div className="main-content">
        <header className="top-header">
          <div className="header-left">
            <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <div className="header-search">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search..." />
            </div>
          </div>
          <div className="header-right">
            <button className="header-btn">
              🔔
              <span className="badge-dot" />
            </button>
            <button className="header-btn" onClick={handleLogout} title="Logout">
              🚪
            </button>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
