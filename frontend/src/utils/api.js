import axios from "axios";

const API_URL = "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

// Improved error handling to provide more context
export const handleApiError = (error) => {
  if (error.response) {
    return {
      message: error.response.data.message || "An error occurred",
      status: error.response.status,
    };
  }
  return { message: "Network error. Please try again.", status: 500 };
};
