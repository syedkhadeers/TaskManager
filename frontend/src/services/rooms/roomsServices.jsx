import api from "../../utils/api";

export const prepareFormData = async (roomData) => {
  const formData = new FormData();

  // Handle basic fields
  Object.keys(roomData).forEach((key) => {
    if (key !== "images" && key !== "amenities") {
      if (roomData[key] !== undefined && roomData[key] !== null) {
        formData.append(key, roomData[key]);
      }
    }
  });

  // Handle amenities array
  if (roomData.amenities?.length > 0) {
    formData.append("amenities", JSON.stringify(roomData.amenities));
  }

  // Handle images
  if (roomData.images?.length > 0) {
    for (let i = 0; i < roomData.images.length; i++) {
      const image = roomData.images[i];
      if (image.file) {
        formData.append("images", image.file);
      } else if (image.cropped) {
        const response = await fetch(image.cropped);
        const blob = await response.blob();
        formData.append("images", blob, `image-${i}.jpg`);
      }
    }
  }

  return formData;
};

export const createRoom = async (roomData) => {
  try {
    const formData = await prepareFormData(roomData);
    const response = await api.post("/rooms", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create room");
  }
};

export const getAllRooms = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await api.get(`/rooms?${queryParams}`);
    return response.rooms;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch rooms");
  }
};

export const getRoomById = async (id) => {
  try {
    const response = await api.get(`/rooms/${id}`);
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch room");
  }
};

export const updateRoom = async (id, roomData) => {
  try {
    const formData = await prepareFormData(roomData);
    const response = await api.patch(`/rooms/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update room");
  }
};

export const deleteRoom = async (id) => {
  try {
    const response = await api.delete(`/rooms/${id}`);
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to delete room");
  }
};

export const toggleRoom = async (id) => {
  try {
    const response = await api.patch(`/rooms/${id}/toggle`);
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to toggle room status");
  }
};

export const updateRoomStatus = async (id, status) => {
  try {
    const response = await api.patch(`/rooms/${id}/status`, { status });
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to update room status");
  }
};

export const validateRoomData = (data) => {
  const errors = {};
  const maxImageSize = 10 * 1024 * 1024; // 10MB
  const allowedImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/bmp",
    "image/tiff",
    "image/heic",
    "image/avif",
  ];

  // Required field validation
  if (!data.roomNumber?.trim()) errors.roomNumber = "Room number is required";
  if (!data.roomType) errors.roomType = "Room type is required";
  if (!data.floor?.trim()) errors.floor = "Floor is required";

  // Status validation
  if (
    data.status &&
    !["available", "occupied", "maintenance", "reserved"].includes(data.status)
  ) {
    errors.status = "Invalid room status";
  }

  // Image validation
  if (data.images?.length > 0) {
    data.images.forEach((image, index) => {
      if (image.file) {
        if (!allowedImageTypes.includes(image.file.type)) {
          errors[`image${index}`] = "Invalid image type";
        }
        if (image.file.size > maxImageSize) {
          errors[`image${index}`] = "Image size exceeds 10MB limit";
        }
      }
    });
  }

  // Boolean fields validation
  if (
    data.smokingAllowed !== undefined &&
    typeof data.smokingAllowed !== "boolean"
  ) {
    errors.smokingAllowed = "Smoking allowed must be a boolean value";
  }
  if (data.petsAllowed !== undefined && typeof data.petsAllowed !== "boolean") {
    errors.petsAllowed = "Pets allowed must be a boolean value";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  prepareFormData,
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  toggleRoom,
  updateRoomStatus,
  validateRoomData,
};
