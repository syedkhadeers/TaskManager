import { api, handleApiError, retryRequest } from "../../utils/api";

const prepareFormData = (userData) => {
  const formData = new FormData();
  Object.entries(userData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === "photo" && value instanceof File) {
        formData.append("photo", value);
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }
  });
  return formData;
};

export const updateUserProfile = async (userData) => {
  try {
    const formData = prepareFormData(userData);
    const response = await retryRequest(() =>
      api.patch("/user/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      })
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getAllUsers = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await retryRequest(() =>
      api.get(`/users${queryString ? `?${queryString}` : ""}`)
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getUsersByRole = async (role) => {
  try {
    const response = await retryRequest(() => api.get(`/users/role/${role}`));
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const addUser = async (userData) => {
  try {
    const formData = prepareFormData(userData);
    const response = await retryRequest(() =>
      api.post("/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      })
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await retryRequest(() => api.delete(`/users/${userId}`));
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateUserById = async (userId, userData) => {
  try {
    const formData = prepareFormData(userData);
    const response = await retryRequest(() =>
      api.patch(`/users/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      })
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await retryRequest(() => api.get(`/users/${userId}`));
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await api.patch("/users/change-password", passwordData);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const changeUserPassword = async (userId, passwordData) => {
  try {
    const response = await api.patch(
      `/users/${userId}/change-password`,
      passwordData
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export default {
  updateUserProfile,
  getAllUsers,
  getUsersByRole,
  addUser,
  deleteUser,
  updateUserById,
  getUserById,
  changePassword,
  changeUserPassword,
};
