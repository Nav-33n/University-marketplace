import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from './tokenStorage';

const PrivateRoute = () => {
  const token = getToken(); // 🔐 Decrypt + retrieve
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
