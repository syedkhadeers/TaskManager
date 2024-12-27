import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
} from "../services/auth/authServices";

const AuthContext = createContext();
const TOKEN_KEY = "token";
const ROUTE_KEY = "lastRoute";

function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    errors: {},
    lastVisitedRoute: localStorage.getItem(ROUTE_KEY) || "/dashboard",
  });

  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
      }));
      return;
    }

    try {
      const userData = await getCurrentUser();
      setAuthState((prev) => ({
        ...prev,
        user: userData,
        isAuthenticated: true,
        isLoading: false,
        errors: {},
      }));
    } catch (error) {
      console.error("Auth status check failed:", error);
      localStorage.removeItem(TOKEN_KEY);
      setAuthState((prev) => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        errors: { auth: error.message },
      }));
    }
  }, []);

  const handleLogin = async (credentials) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const { token, user } = await loginUser(credentials);
      localStorage.setItem(TOKEN_KEY, token);
      setAuthState((prev) => ({
        ...prev,
        user,
        isAuthenticated: true,
        isLoading: false,
        errors: {},
      }));
      return user;
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: false,
        isLoading: false,
        errors: { login: error.message },
      }));
      throw error;
    }
  };

  const handleLogout = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        errors: {},
        lastVisitedRoute: "/dashboard",
      });
    }
  };

  useEffect(() => {
    const handleAuthError = () => {
      setAuthState((prev) => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        errors: { auth: "Authentication failed" },
      }));
    };

    window.addEventListener("auth-error", handleAuthError);
    checkAuthStatus();

    return () => {
      window.removeEventListener("auth-error", handleAuthError);
    };
  }, [checkAuthStatus]);

  const contextValue = useMemo(
    () => ({
      ...authState,
      handleLogin,
      handleLogout,
      checkAuthStatus,
      setAuthState,
    }),
    [authState, checkAuthStatus]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
