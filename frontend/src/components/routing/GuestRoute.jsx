import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const GuestRoute = () => {
  const { token } = useAuth();
  return !token ? <Outlet /> : <Navigate to="/" replace />;
};

export default GuestRoute; 