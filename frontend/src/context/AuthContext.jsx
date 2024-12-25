import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
} from "../services/authServices";

export const AuthContext = createContext();

const TOKEN_KEY = "token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      localStorage.removeItem(TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const { token, user } = await loginUser(credentials);
      localStorage.setItem(TOKEN_KEY, token);
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      throw new Error("Login failed. Please check your credentials.");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    handleLogin,
    handleLogout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
