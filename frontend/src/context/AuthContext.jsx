import { createContext, useState, useEffect, useCallback } from "react";
import * as authService from "../services/auth/authServices";
import { API_EVENTS } from "../utils/api";

const STORAGE_KEYS = {
  TOKEN: "token",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
};

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getUserFromStorage());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAuthenticated = authService.isAuthenticated();

const handleLogin = useCallback(async (credentials) => {
  try {
    setIsLoading(true);
    console.log("AuthContext: Login attempt with:", credentials);
    const response = await authService.loginUser(credentials);
    console.log("AuthContext: Login response:", response);
    setUser(response.user);
    console.log("AuthContext: User set to:", response.user);
    setError(null);
    return response;
  } catch (error) {
    console.log("AuthContext: Login error:", error);
    setError(error.message);
    throw error;
  } finally {
    setIsLoading(false);
  }
}, []);


  const handleRegister = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      const response = await authService.registerUser(userData);
      setUser(response.user);
      setError(null);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

 const handleLogout = useCallback(async () => {
   try {
     setIsLoading(true);
     await authService.logoutUser();
     localStorage.clear();
     setUser(null);
   } catch (error) {
     console.error("Logout error in context:", error);
     throw error;
   } finally {
     setIsLoading(false);
   }
 }, []);


  const updateUserProfile = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      const response = await authService.getCurrentUser();
      setUser(response.user);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleVerifyEmail = useCallback(async (token) => {
    try {
      setIsLoading(true);
      return await authService.verifyEmail(token);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleForgotPassword = useCallback(async (email) => {
    try {
      setIsLoading(true);
      return await authService.forgotPassword(email);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleResetPassword = useCallback(async (token, password) => {
    try {
      setIsLoading(true);
      return await authService.resetPassword(token, password);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChangePassword = useCallback(async (passwordData) => {
    try {
      setIsLoading(true);
      return await authService.changePassword(passwordData);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);



  useEffect(() => {
    const handleAuthError = () => {
      setUser(null);
      setError("Authentication failed");
    };

    window.addEventListener(API_EVENTS.AUTH_ERROR, handleAuthError);
    return () =>
      window.removeEventListener(API_EVENTS.AUTH_ERROR, handleAuthError);
  }, []);

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    error,
    handleLogin,
    handleLogout,
    handleRegister,
    updateUserProfile,
    handleVerifyEmail,
    handleForgotPassword,
    handleResetPassword,
    handleChangePassword,
    setError,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
