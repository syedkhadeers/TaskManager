import { api, handleApiError, retryRequest } from "../../utils/api";

export const createRoom = async (roomData) => {
  try {
    const formData = new FormData();
    Object.entries(roomData).forEach(([key, value]) => {
      if (key === "images" && value) {
        Array.from(value).forEach((image) => {
          formData.append("images", image);
        });
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const response = await retryRequest(() => api.post("/rooms", formData));
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getAllRooms = async () => {
  try {
    const response = await retryRequest(() => api.get("/rooms"));
    return response.rooms;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getRoomById = async (id) => {
  try {
    const response = await retryRequest(() => api.get(`/rooms/${id}`));
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateRoom = async (roomId, roomData) => {
  try {
    const formData = new FormData();
    Object.entries(roomData).forEach(([key, value]) => {
      if (key === "images" && value) {
        Array.from(value).forEach((image) => {
          formData.append("images", image);
        });
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const response = await retryRequest(() =>
      api.patch(`/rooms/${roomId}`, formData)
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteRoom = async (roomId) => {
  try {
    const response = await retryRequest(() => api.delete(`/rooms/${roomId}`));
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const toggleRoom = async (roomId) => {
  try {
    const response = await retryRequest(() =>
      api.patch(`/rooms/${roomId}/toggle`)
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateRoomStatus = async (roomId, status) => {
  try {
    const response = await retryRequest(() =>
      api.patch(`/rooms/${roomId}/status`, { status })
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const validateRoomData = (data) => {
  const errors = {};

  if (!data.roomNumber?.trim()) errors.roomNumber = "Room number is required";
  if (!data.roomType) errors.roomType = "Room type is required";
  if (!data.floor?.trim()) errors.floor = "Floor is required";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
