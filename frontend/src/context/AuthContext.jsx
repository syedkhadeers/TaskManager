import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
} from "../services/auth/authServices";

export const AuthContext = createContext();

const TOKEN_KEY = "token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      setIsAuthenticated(false);
      return;
    }

    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Auth status check failed:", error);
      localStorage.removeItem(TOKEN_KEY);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = async (credentials) => {
    setIsLoading(true);
    try {
      const { token, user } = await loginUser(credentials);
      localStorage.setItem(TOKEN_KEY, token);
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      setIsAuthenticated(false);
      throw new Error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      setErrors({});
    }
  };

  useEffect(() => {
    checkAuthStatus();
    return () => {
      setIsLoading(false);
      setErrors({});
    };
  }, [checkAuthStatus]);

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    errors,
    handleLogin,
    handleLogout,
    checkAuthStatus,
    setUser,
    setIsAuthenticated,
    setErrors,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
