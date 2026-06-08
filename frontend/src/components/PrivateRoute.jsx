import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../services/auth.service';

const PrivateRoute = ({ allowedRoles }) => {
  const isLoggedIn = AuthService.isLoggedIn();
  const user = AuthService.getCurrentUser();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user) {
    const userRole = user.role?.replace('ROLE_', '');
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute;
