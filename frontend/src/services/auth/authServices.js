import api from "../../utils/api";

const STORAGE_KEYS = {
  TOKEN: "token",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
};

// Storage management functions
const storeUserData = (data) => {
  console.log("AuthService: Storing user data:", data);
  if (data.token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
    console.log("AuthService: Token stored");
  }
  if (data.refreshToken) {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
    console.log("AuthService: Refresh token stored");
  }
  if (data.user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
    console.log("AuthService: User data stored in localStorage");
  }
};

const clearUserData = () => {
  console.log("5a. Clearing local storage data");
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  console.log("5b. Local storage cleared");
};

// Form data preparation helper
const prepareFormData = (userData) => {
  const formData = new FormData();
  Object.entries(userData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
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

// Auth service functions
export const registerUser = async (userData) => {
  const formData = prepareFormData(userData);
  const response = await api.post("/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  storeUserData(response);
  return response;
};

export const loginUser = async (credentials) => {
  console.log("AuthService: Attempting login with:", credentials);
  const response = await api.post("/login", credentials);
  console.log("AuthService: Raw response:", response);
  storeUserData(response);
  console.log("AuthService: User data stored:", response);
  return response;
};

export const logoutUser = async () => {
  try {
    await api.post("/logout");
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error("Logout service error:", error);
    throw error;
  }
};


export const verifyEmail = async (token) => {
  return await api.post(`/verify/${token}`);
};

export const sendVerificationEmail = async () => {
  return await api.post("/verify-email");
};

export const forgotPassword = async (email) => {
  return await api.post("/forgot-password", { email });
};

export const resetPassword = async (token, password) => {
  return await api.post(`/reset-password/${token}`, { password });
};

export const changePassword = async (passwordData) => {
  return await api.patch("/change-password", passwordData);
};

export const checkLoginStatus = async () => {
  return await api.get("/status");
};

export const getCurrentUser = async () => {
  const response = await api.get("/user/me");
  if (response.user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
  }
  return response;
};

export const refreshUserToken = async () => {
  const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await api.post("/refresh-token", { refreshToken });
  if (response.token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
  }
  return response;
};

export const getUserFromStorage = () => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
};

