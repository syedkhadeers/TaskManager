import { api, handleApiError } from "../utils/api";

// Auth Services

// Registration Service
export const registerUser = async (userData) => {
  try {
    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const response = await api.post("/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Login Service
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/login", credentials);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Logout Service
export const logoutUser = async () => {
  try {
    const response = await api.get("/logout");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Login Status Service from token
export const checkLoginStatus = async () => {
  try {
    const response = await api.get("/login-status");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// User Profile Services from path
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/user");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Update User Profile Service
export const updateCurrentUser = async (userData) => {
  try {
    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const response = await api.patch("/update-user", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Get All Users Service
export const getAllUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Get Single User Service
export const getOtherUser = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Add New User Service
export const addNewUser = async (userData) => {
  try {
    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const response = await api.post("/add-user", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Email Verification Services
export const sendVerificationEmail = async () => {
  try {
    const response = await api.post("/verify-email");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const verifyUserEmail = async (verificationToken) => {
  try {
    const response = await api.get(`/verify-user/${verificationToken}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Password Management Services
export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/forgot-password", { email });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const resetPassword = async (resetToken, password) => {
  try {
    const response = await api.put(`/reset-password/${resetToken}`, {
      password,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await api.patch("/change-password", passwordData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
