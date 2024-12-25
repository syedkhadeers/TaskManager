import { api, handleApiError, retryRequest } from "../../utils/api.js";

// Constants for token management
const TOKEN_KEY = "token";
const USER_KEY = "user";

// Helper functions
const saveUserData = (data) => {
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data));
};

const clearUserData = () => {
  localStorage.removeItem(TOKEN_KEY);
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
          // You can use this for upload progress
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      })
    );

    saveUserData(response.data);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await retryRequest(() => api.post("/login", credentials));
    saveUserData(response.data);
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
    clearUserData(); // Clear data even if API call fails
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

export const forgotPassword = async (email) => {
  try {
    const response = await retryRequest(() =>
      api.post("/forgot-password", { email })
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const resetPassword = async (resetPasswordToken, password) => {
  try {
    const response = await retryRequest(() =>
      api.post(`/reset-password/${resetPasswordToken}`, {
        password,
      })
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const changePassword = async (passwords) => {
  try {
    const response = await retryRequest(() =>
      api.patch("/change-password", passwords)
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const requestEmailVerification = async () => {
  try {
    const response = await retryRequest(() => api.post("/verify-email"));
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const verifyEmail = async (verificationToken) => {
  try {
    const response = await retryRequest(() =>
      api.post(`/verify-user/${verificationToken}`)
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

// New utility functions
export const isAuthenticated = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};

export const getStoredUser = () => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await retryRequest(() =>
      api.patch("/user/profile", userData)
    );
    const updatedUser = { ...getStoredUser(), ...response.data };
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};
