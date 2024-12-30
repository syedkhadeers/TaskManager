import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

const PrivateRoute = ({
  element,
  allowedRoles = [],
  redirectPath = "/login",
  requireVerified = false,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth status
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate to={redirectPath} state={{ from: location.pathname }} replace />
    );
  }

  // Check email verification if required
  if (requireVerified && !user?.isVerified) {
    return (
      <Navigate
        to="/verify-email"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Check role-based access
  if (allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some(
      (role) => user?.role?.toLowerCase() === role.toLowerCase()
    );

    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return element;
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  redirectPath: PropTypes.string,
  requireVerified: PropTypes.bool,
};

export default PrivateRoute;

/* Usage Examples:

// Basic protected route
<PrivateRoute element={<Dashboard />} />

// Admin only route
<PrivateRoute 
  element={<AdminPanel />} 
  allowedRoles={["admin"]} 
/>

// Verified users only
<PrivateRoute 
  element={<Settings />} 
  requireVerified={true} 
/>

// Multiple roles with custom redirect
<PrivateRoute 
  element={<Reports />} 
  allowedRoles={["admin", "manager"]} 
  redirectPath="/access-denied" 
/>
*/
