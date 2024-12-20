import { api, handleApiError } from "../utils/api";

export const updateUserProfile = async (userData) => {
  try {
    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await api.patch("/user", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const addUser = async (userData) => {
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

// export const deleteUser = async (userId) => {
//   try {
//     const response = await api.delete(`/admin/users/${userId}`);
//     return response.data;
//   } catch (error) {
//     throw handleApiError(error);
//   }
// };

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Delete user error:", error);
    throw error;
  }
};

export const updateOtherUser = async (userId, userData) => {
  try {
    

    const formData = new FormData();

    // Add userId to formData
    formData.append("userId", userId);

    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await api.patch(`/update-user/${userId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.log("Error details:", error.response?.data); // Add this log
    throw handleApiError(error);
  }
};

