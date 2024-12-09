import React, { useEffect } from "react";
import Register from "../components/auth/Register";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import InitialNavbar from "../components/common/InitialNavbar";

const RegisterPage = () => {
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
        <Register />
      </div>
    </div>
  );
};

export default RegisterPage;
