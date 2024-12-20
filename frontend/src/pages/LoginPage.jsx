import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Login from "../components/auth/Login";
import LayoutAuth from "../components/layout/LayoutAuth";

const LoginPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <LayoutAuth>
      <div className="flex items-center justify-center h-full w-full">
        <div className="w-full max-w-md p-6">
          <Login />
        </div>
      </div>
    </LayoutAuth>
  );
};

export default LoginPage;
