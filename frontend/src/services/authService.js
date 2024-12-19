import { api, handleApiError } from "../utils/api";

export const registerUser = async (userData) => {
  try {
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      formData.append(key, userData[key]);
    });

    const response = await api.post("/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const addUser = async (userData) => {
  try {
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      formData.append(key, userData[key]);
    });

    const response = await api.post("/add-user", formData, {
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
    const { token, user } = response.data;

    if (token) {
      localStorage.setItem("token", token);
    }

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    return { token, user };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const logoutUser = async () => {
  try {
    await api.post("/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
