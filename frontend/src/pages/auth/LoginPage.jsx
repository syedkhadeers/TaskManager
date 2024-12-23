import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Login from "../../components/auth/Login";
import LayoutAuth from "../../components/layout/LayoutAuth";
import { motion } from "framer-motion";

const LoginPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <LayoutAuth>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto"
      >
        <Login />
      </motion.div>
    </LayoutAuth>
  );
};

export default LoginPage;
