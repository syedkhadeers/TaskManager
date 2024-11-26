// src/components/common/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const PrivateRoute = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // If loading, you may want to render a loading spinner or nothing
  if (isLoading) {
    return <div>Loading...</div>; // Or any loading spinner
  }

  // If the user is authenticated, return the element; otherwise, redirect to login
  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;