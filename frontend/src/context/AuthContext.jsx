import React, { createContext, useState, useEffect } from "react";
import { getUserProfile } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser ] = useState(() => {
    const storedUser  = localStorage.getItem("user");
    
    // Attempt to parse the stored user data
    try {
      return storedUser  ? JSON.parse(storedUser ) : null;
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return null; // Return null if parsing fails
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const userData = await getUserProfile();
      setUser (userData);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData)); // Store user data in localStorage
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser (null);
      setIsAuthenticated(false);
      localStorage.removeItem("user"); // Remove user data from localStorage on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser ,
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};