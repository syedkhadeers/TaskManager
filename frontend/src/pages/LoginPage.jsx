import React, { useEffect } from "react";
import Login from "../components/auth/Login";
import InitialNavbar from "../components/common/InitialNavbar";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("You have already logged in");
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="bg-gradient-to-r from-purple-500 to-blue-500 min-h-screen flex flex-col">
      <InitialNavbar />
      <div className="flex items-center justify-center flex-grow py-8 px-6">
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
