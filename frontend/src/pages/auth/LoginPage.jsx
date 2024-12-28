import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Login from "../../components/pageComponents/auth/Login";
import LayoutAuth from "../../components/layout/LayoutAuth";
import { toast } from "react-toastify";

const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.from === "/logout") {
      toast.info("You have been logged out");
    }
  }, [location]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <LayoutAuth>
      <div className="w-full max-w-md mx-auto">
        <Login />
      </div>
    </LayoutAuth>
  );
};

export default LoginPage;
