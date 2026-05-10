import { Navigate, Outlet } from 'react-router-dom';

export default function AuthRoute() {
  const isAuthenticated = !!localStorage.getItem('token');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
