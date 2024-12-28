import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  registerUser,
  loginUser,
  logoutUser,
  checkLoginStatus,
  getCurrentUser,
} from "../services/auth/authServices";
import { API_EVENTS } from "../utils/api";

const AuthContext = createContext();
const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";
const ROUTE_KEY = "lastRoute";

function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: JSON.parse(localStorage.getItem(USER_KEY)) || null,
    isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
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
      const { user, isAuthenticated } = await checkLoginStatus();
      setAuthState((prev) => ({
        ...prev,
        user,
        isAuthenticated,
        isLoading: false,
        errors: {},
      }));
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setAuthState((prev) => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        errors: { auth: error.message },
      }));
    }
  }, []);

  const handleRegister = async (userData) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await registerUser(userData);
      const { token, refreshToken, user } = response;

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

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
        isLoading: false,
        errors: { register: error.message },
      }));
      throw error;
    }
  };

  const handleLogin = async (credentials) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await loginUser(credentials);
      const { token, refreshToken, user } = response;

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

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
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        errors: {},
        lastVisitedRoute: "/dashboard",
      });
    }
  };

  const updateUserProfile = async (userData) => {
    try {
      const updatedUser = await getCurrentUser();
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      setAuthState((prev) => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        errors: { profile: error.message },
      }));
      throw error;
    }
  };

  useEffect(() => {
    const handleAuthError = () => {
      handleLogout();
    };

    const handleTokenRefresh = (event) => {
      const { token } = event.detail;
      localStorage.setItem(TOKEN_KEY, token);
    };

    window.addEventListener(API_EVENTS.AUTH_ERROR, handleAuthError);
    window.addEventListener(API_EVENTS.TOKEN_REFRESH, handleTokenRefresh);
    checkAuthStatus();

    return () => {
      window.removeEventListener(API_EVENTS.AUTH_ERROR, handleAuthError);
      window.removeEventListener(API_EVENTS.TOKEN_REFRESH, handleTokenRefresh);
    };
  }, [checkAuthStatus]);

  const contextValue = useMemo(
    () => ({
      ...authState,
      handleLogin,
      handleLogout,
      handleRegister,
      updateUserProfile,
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
 