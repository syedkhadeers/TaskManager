import { api, handleApiError } from "../utils/api";

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

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/login", credentials);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const logoutUser = async () => {
  try {
    await api.post("/logout");
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/user");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/forgot-password", { email });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const resetPassword = async (resetPasswordToken, password) => {
  try {
    const response = await api.post(`/reset-password/${resetPasswordToken}`, {
      password,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.patch("/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const requestEmailVerification = async () => {
  try {
    const response = await api.post("/verify-email");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const verifyEmail = async (verificationToken) => {
  try {
    const response = await api.post(`/verify-user/${verificationToken}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
