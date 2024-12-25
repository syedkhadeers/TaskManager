import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // Add authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now(),
    };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear user session
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Handle other error cases
    if (error.response?.status === 403) {
      window.location.href = "/forbidden";
    }

    if (error.response?.status === 404) {
      window.location.href = "/not-found";
    }

    return Promise.reject(handleApiError(error));
  }
);

// Enhanced error handler
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const message = error.response.data.message || "An error occurred";
    const status = error.response.status;
    const data = error.response.data;

    return {
      message,
      status,
      data,
      type: "API_ERROR",
    };
  }

  if (error.request) {
    // Request made but no response
    return {
      message: "No response received from server",
      status: 0,
      type: "NETWORK_ERROR",
    };
  }

  // Error in request setup
  return {
    message: error.message || "Error setting up the request",
    type: "REQUEST_ERROR",
  };
};

// API status checker
export const checkApiHealth = async () => {
  try {
    const response = await api.get("/health");
    return response.status === "ok";
  } catch {
    return false;
  }
};

// Retry mechanism for failed requests
export const retryRequest = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1, delay * 2);
  }
};

export { api };
