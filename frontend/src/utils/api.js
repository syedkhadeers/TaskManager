import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";

// Event types for API-related events
export const API_EVENTS = {
  AUTH_ERROR: "auth-error",
  SERVER_ERROR: "server-error",
  NETWORK_ERROR: "network-error",
  VALIDATION_ERROR: "validation-error",
};

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to handle auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor with enhanced error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.clear();
      window.dispatchEvent(new CustomEvent(API_EVENTS.AUTH_ERROR));
      window.location.href = "/login";
    }

    // Handle network errors
    if (!error.response) {
      window.dispatchEvent(
        new CustomEvent(API_EVENTS.NETWORK_ERROR, {
          detail: "Network connection failed",
        })
      );
    }

    // Handle validation errors
    if (error.response?.status === 400) {
      window.dispatchEvent(
        new CustomEvent(API_EVENTS.VALIDATION_ERROR, {
          detail: error.response.data,
        })
      );
    }

    return Promise.reject({
      message: error.response?.data?.message || "An error occurred",
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

// API endpoints organized by feature
export const endpoints = {
  auth: {
    login: (credentials) => api.post("/login", credentials),
    register: (userData) => api.post("/register", userData),
    logout: () => api.post("/logout"),
    verifyEmail: (data) => api.post("/verify-email", data),
    forgotPassword: (email) => api.post("/forgot-password", email),
    resetPassword: (token, data) => api.post(`/reset-password/${token}`, data),
    changePassword: (data) => api.patch("/change-password", data),
    checkLoginStatus: () => api.get("/status"),
    getCurrentUser: () => api.get("/user/me"),
  },

  users: {
    getProfile: () => api.get("/user/me"),
    updateProfile: (data) => api.patch("/user/me", data),
    getAllUsers: () => api.get("/users"),
    getUserById: (id) => api.get(`/users/${id}`),
    getUsersByRole: (role) => api.get(`/users/role/${role}`),
    updateUser: (id, data) => api.patch(`/users/${id}`, data),
    deleteUser: (id) => api.delete(`/users/${id}`),
  },

  rooms: {
    getAll: () => api.get("/rooms"),
    getOne: (id) => api.get(`/rooms/${id}`),
    create: (data) => api.post("/rooms", data),
    update: (id, data) => api.patch(`/rooms/${id}`, data),
    delete: (id) => api.delete(`/rooms/${id}`),
  },

  customers: {
    getAll: () => api.get("/customers"),
    getOne: (id) => api.get(`/customers/${id}`),
    create: (data) => api.post("/customers", data),
    update: (id, data) => api.patch(`/customers/${id}`, data),
    delete: (id) => api.delete(`/customers/${id}`),
  },
};

export default api;
