import { api, handleApiError } from "../../utils/api";

const prepareFormData = (userData) => {
  const formData = new FormData();
  Object.entries(userData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === "photo" && value instanceof File) {
        formData.append("photo", value); // Ensure photo is appended as a file
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
    const response = await api.patch("/user", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to update user profile");
  }
};


export const getAllUsers = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(
      `/users${queryString ? `?${queryString}` : ""}`
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch users");
  }
};


export const addUser = async (userData) => {
  try {
    const formData = prepareFormData(userData);
    const response = await api.post("/add-user", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to add user");
  }
};



export const deleteUser = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to delete user");
  }
};


export const updateUserById = async (userId, userData) => {
  try {
    if (!userId) throw new Error("User ID is required");
    const formData = prepareFormData({ ...userData, userId });

    const response = await api.patch(`/update-user/${userId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to update user");
  }
};


export const getUserById = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");
    const response = await api.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch user details");
  }
};


export const batchUpdateUsers = async (users) => {
  try {
    const response = await api.patch("/users/batch", { users });
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to batch update users");
  }
};


export const exportUsers = async (filters = {}) => {
  try {
    const response = await api.get("/users/export", {
      params: filters,
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to export users");
  }
};


// change-me-password 
export const changeMePassword = async (passwordData) => {
  try {
    const response = await api.patch("/change-me-password", {
      oldPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to change password");
  }
};


// change-user-password
export const changeUserPassword = async (userId, passwordData) => {
  try {
    if (!userId) throw new Error("User ID is required");
    const response = await api.patch(`/change-user-password/${userId}`, {
      newPassword: passwordData.newPassword,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to change user's password");
  }
};