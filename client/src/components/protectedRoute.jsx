// components/ProtectedRoute.js
import { useUser } from '../context/UserContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useUser();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login with return url
    return <Navigate to="/page1" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;