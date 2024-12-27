import axios from "axios";

// Custom event for auth errors
export const createAuthErrorEvent = () => new CustomEvent("auth-error");

// Create axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.params = {
      ...config.params,
      _t: Date.now(),
    };
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(createAuthErrorEvent());
      return Promise.reject(handleApiError(error));
    }

    if (error.response?.status === 403) {
      const forbiddenEvent = new CustomEvent("forbidden-error");
      window.dispatchEvent(forbiddenEvent);
    }

    if (error.response?.status === 404) {
      const notFoundEvent = new CustomEvent("not-found-error");
      window.dispatchEvent(notFoundEvent);
    }

    return Promise.reject(handleApiError(error));
  }
);

// Enhanced error handler
export const handleApiError = (error) => {
  if (error.response) {
    return {
      message: error.response.data.message || "An error occurred",
      status: error.response.status,
      data: error.response.data,
      type: "API_ERROR",
    };
  }

  if (error.request) {
    return {
      message: "No response received from server",
      status: 0,
      type: "NETWORK_ERROR",
    };
  }

  return {
    message: error.message || "Error setting up the request",
    type: "REQUEST_ERROR",
  };
};

// API status checker with retry mechanism
export const checkApiHealth = async () => {
  try {
    const response = await retryRequest(() => api.get("/health"));
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
