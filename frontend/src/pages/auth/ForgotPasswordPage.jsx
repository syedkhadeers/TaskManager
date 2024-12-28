import React, { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LayoutAuth from "../../components/layout/LayoutAuth";
import ForgotPassword from "../../components/pageComponents/auth/ForgotPassword";

const ForgotPasswordPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("You have already logged in");
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <LayoutAuth>
      <div className="flex items-center justify-center h-full w-full">
        <div className="w-full max-w-md p-6   ">
          <ForgotPassword />
        </div>
      </div>
    </LayoutAuth>
  );
};

export default ForgotPasswordPage;
