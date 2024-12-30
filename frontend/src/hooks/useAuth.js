import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return {
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    // isLoading: context.isLoading,
    error: context.error,
    login: context.handleLogin,
    logout: context.handleLogout,
    register: context.handleRegister,
    updateProfile: context.updateUserProfile,
    verifyEmail: context.handleVerifyEmail,
    forgotPassword: context.handleForgotPassword,
    resetPassword: context.handleResetPassword,
    changePassword: context.handleChangePassword,
    setError: context.setError,
    // checkAuthStatus: context.checkAuthStatus,
  };
};
