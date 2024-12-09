import { api, handleApiError } from "../utils/api";

export const updateUserProfile = async (userData) => {
  try {
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      formData.append(key, userData[key]);
    });

    const response = await api.patch("/user", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

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

export const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const response = await api.post(`/reset-password/${resetPasswordToken}`, {
      password: newPassword,
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

// Existing methods...
export const getUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};