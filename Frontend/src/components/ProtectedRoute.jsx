import { Navigate, useLocation } from 'react-router-dom';

/**
 * A wrapper component that redirects to the landing page if the user is not authenticated
 */
function ProtectedRoute({ children, isAuthenticated }) {
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Redirect to the landing page if not authenticated
    // Pass the current location so it can redirect back after login
    return <Navigate to="/welcome" state={{ from: location }} replace />;
  }
  
  // Render the children if authenticated
  return children;
}

export default ProtectedRoute;
