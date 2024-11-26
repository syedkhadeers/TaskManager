import { api, handleApiError } from "../utils/api";

const createFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });
  return formData;
};

export const registerUser  = async (userData) => {
  try {
    const formData = createFormData(userData);
    const response = await api.post("/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const loginUser  = async (credentials) => {
  try {
    const response = await api.post("/login", credentials);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post("/logout");
    localStorage.removeItem("user"); // Clear user data on logout
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get("/user");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const formData = createFormData(userData);
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