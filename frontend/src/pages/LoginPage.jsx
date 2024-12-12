import React, { useEffect } from "react";
import Login from "../components/auth/Login";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LayoutAuth from "../components/layout/LayoutAuth";

const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <LayoutAuth>
      <div className="flex items-center justify-center h-full w-full">
        <div className="w-full max-w-md p-6   ">
          <Login />
        </div>
      </div>
    </LayoutAuth>
  );
};

export default LoginPage;
