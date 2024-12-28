import { api, handleApiError, retryRequest } from "../../utils/api.js";

// Constants for token management
const TOKEN_KEY = "token";
const USER_KEY = "user";
const REFRESH_TOKEN_KEY = "refreshToken";

// Enhanced helper functions
const saveUserData = (data) => {
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
};

const clearUserData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const registerUser = async (userData) => {
  try {
    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value, value.name);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const response = await retryRequest(() =>
      api.post("/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      })
    );

    saveUserData(response);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/login", credentials);
    saveUserData(response);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const logoutUser = async () => {
  try {
    await api.post("/logout");
    clearUserData();
  } catch (error) {
    clearUserData();
    throw handleApiError(error);
  }
};

export const verifyEmail = async (token) => {
  try {
    const response = await api.post(`/verify/${token}`);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/forgot-password", { email });
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await api.post(`/reset-password/${token}`, { password });
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await api.patch("/change-password", passwordData);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const checkLoginStatus = async () => {
  try {
    const response = await api.get("/status");
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await retryRequest(() => api.get("/user"));
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};
