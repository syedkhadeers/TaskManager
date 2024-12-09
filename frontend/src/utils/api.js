// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true, // Important for cookie-based authentication
});

// Request interceptor to add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Optionally redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    throw new Error(error.response.data.message || "An error occurred");
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error("No response received from server");
  } else {
    // Something happened in setting up the request
    throw new Error("Error setting up the request");
  }
};

export { api };
