import axios from "axios";

// Custom events for various API scenarios
const createApiEvent = (type) => new CustomEvent(type);

// API Events
export const API_EVENTS = {
  AUTH_ERROR: "auth-error",
  FORBIDDEN: "forbidden-error",
  NOT_FOUND: "not-found-error",
  VALIDATION_ERROR: "validation-error",
  NETWORK_ERROR: "network-error",
  TOKEN_REFRESH: "token-refresh",
};

// Create axios instance with enhanced config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Enhanced request interceptor
api.interceptors.request.use(
  (config) => {
    // Handle file uploads
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Cache busting for GET requests
    if (config.method === "get") {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    return config;
  },
  (error) => Promise.reject(handleApiError(error))
);

// Enhanced response interceptor
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await api.post("/auth/refresh-token", {
            refreshToken,
          });
          if (response.token) {
            localStorage.setItem("token", response.token);
            originalRequest.headers.Authorization = `Bearer ${response.token}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        handleAuthError();
      }
    }

    // Handle specific error types
    dispatchApiError(error);
    return Promise.reject(handleApiError(error));
  }
);

// Enhanced error handler with detailed error types
export const handleApiError = (error) => {
  if (error.response) {
    const errorData = {
      message: error.response.data.message || "An error occurred",
      status: error.response.status,
      data: error.response.data,
      type: "API_ERROR",
    };

    // Handle validation errors
    if (error.response.status === 400) {
      errorData.type = "VALIDATION_ERROR";
      errorData.validationErrors = error.response.data.errors;
    }

    return errorData;
  }

  if (error.request) {
    return {
      message: "Network error - No response received",
      status: 0,
      type: "NETWORK_ERROR",
    };
  }

  return {
    message: error.message || "Request setup error",
    type: "REQUEST_ERROR",
  };
};

// Enhanced error dispatcher
const dispatchApiError = (error) => {
  const status = error.response?.status;
  switch (status) {
    case 401:
      window.dispatchEvent(createApiEvent(API_EVENTS.AUTH_ERROR));
      break;
    case 403:
      window.dispatchEvent(createApiEvent(API_EVENTS.FORBIDDEN));
      break;
    case 404:
      window.dispatchEvent(createApiEvent(API_EVENTS.NOT_FOUND));
      break;
    case 400:
      window.dispatchEvent(createApiEvent(API_EVENTS.VALIDATION_ERROR));
      break;
    default:
      if (!error.response) {
        window.dispatchEvent(createApiEvent(API_EVENTS.NETWORK_ERROR));
      }
  }
};

// Handle authentication errors
const handleAuthError = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  window.dispatchEvent(createApiEvent(API_EVENTS.AUTH_ERROR));
};

// Enhanced retry mechanism with exponential backoff
export const retryRequest = async (fn, options = {}) => {
  const {
    retries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    shouldRetry = (error) => error.status !== 401 && error.status !== 403,
  } = options;

  let lastError;
  let delay = initialDelay;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (!shouldRetry(error)) throw error;

      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * 2, maxDelay);
    }
  }

  throw lastError;
};

// Health check with enhanced monitoring
export const checkApiHealth = async () => {
  try {
    const response = await retryRequest(() => api.get("/health"), {
      retries: 2,
      initialDelay: 500,
      shouldRetry: (error) => error.type === "NETWORK_ERROR",
    });
    return {
      status: response.status === "ok",
      timestamp: Date.now(),
      environment: process.env.NODE_ENV,
    };
  } catch (error) {
    return {
      status: false,
      error: error.message,
      timestamp: Date.now(),
    };
  }
};

export { api };
