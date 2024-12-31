import api from "../../utils/api";

const prepareFormData = (userData) => {
  console.log("Preparing FormData for userData 2:", userData);
  const formData = new FormData();
  Object.entries(userData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === "photo" && value.file instanceof File) {
        console.log("Photo file being added to FormData:", value.file);
        formData.append("photo", value.file);
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (typeof value === "object" && key !== "photo") {
        formData.append(key, JSON.stringify(value));
      } else if (typeof value !== "object") {
        formData.append(key, value);
      }
    }
  });
  console.log("Final FormData created:", [...formData.entries()]);
  return formData;
};

export const updateUserProfile = async (userData) => {
  try {
    const formData = prepareFormData(userData);
    const response = await api.patch("/user/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      })
    return response;
  } catch (error) {
    console.error("Error updating user profile:", error);
  }
};

export const getAllUsers = async (params) => {
  try {
    const response = await api.get(`/users`);
    return response;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

export const getUsersByRole = async (role) => {
  try {
    const response = await api.get(`/users/role/${role}`);
    return response;
  } catch (error) {
    console.error("Error fetching users by role:", error);
  }
};

export const addUser = async (userData) => {
  try {
      console.log("Raw userData before FormData:", userData);
      const formData = prepareFormData(userData);
      console.log("Sending request with FormData", formData);
      const response = await api.post("/users", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
              );
              console.log(`Upload Progress: ${percentCompleted}%`);
          },
      });
      console.log("Upload response received:", response);
      return response;
  } catch (error) {
      console.error("Error adding user:", error);
  }
};
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response;
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

export const updateUserById = async (userId, userData) => {
  try {
    const formData = prepareFormData(userData);
    const response = await api.patch(`/users/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      });
    return response;
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

export const getUserById = async (userId) => {
  try {
    const response = api.get(`/users/${userId}`);
    return response;
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await api.patch("/users/change-password", passwordData);
    return response;
  } catch (error) {
    console.error("Error changing password:", error);
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
    console.error("Error changing user password:", error);
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
