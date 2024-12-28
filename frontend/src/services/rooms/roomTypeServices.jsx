import { api, handleApiError, retryRequest } from "../../utils/api";

export const createRoomType = async (roomTypeData) => {
  try {
    const formData = new FormData();
    Object.entries(roomTypeData).forEach(([key, value]) => {
      if (key === "images" && value) {
        Array.from(value).forEach((image) => {
          formData.append("images", image);
        });
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const response = await retryRequest(() =>
      api.post("/rooms/room-types", formData)
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getAllRoomTypes = async () => {
  try {
    const response = await retryRequest(() => api.get("/rooms/room-types"));
    return response.roomTypes;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getRoomTypeById = async (id) => {
  try {
    const response = await retryRequest(() =>
      api.get(`/rooms/room-types/${id}`)
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateRoomType = async (roomTypeId, roomTypeData) => {
  try {
    const formData = new FormData();
    Object.entries(roomTypeData).forEach(([key, value]) => {
      if (key === "images" && value) {
        Array.from(value).forEach((image) => {
          formData.append("images", image);
        });
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const response = await retryRequest(() =>
      api.patch(`/rooms/room-types/${roomTypeId}`, formData)
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteRoomType = async (roomTypeId) => {
  try {
    const response = await retryRequest(() =>
      api.delete(`/rooms/room-types/${roomTypeId}`)
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const toggleRoomType = async (roomTypeId) => {
  try {
    const response = await retryRequest(() =>
      api.patch(`/rooms/room-types/${roomTypeId}/toggle`)
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Time Slot Management
export const addTimeSlotToRoomType = async (roomTypeId, timeSlotData) => {
  try {
    const response = await retryRequest(() =>
      api.post(`/rooms/room-types/${roomTypeId}/time-slots`, timeSlotData)
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const removeTimeSlotFromRoomType = async (roomTypeId, timeSlotId) => {
  try {
    const response = await retryRequest(() =>
      api.delete(`/rooms/room-types/${roomTypeId}/time-slots/${timeSlotId}`)
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Extra Service Management
export const addExtraServiceToRoomType = async (roomTypeId, serviceData) => {
  try {
    const response = await retryRequest(() =>
      api.post(`/rooms/room-types/${roomTypeId}/extra-services`, serviceData)
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const removeExtraServiceFromRoomType = async (roomTypeId, serviceId) => {
  try {
    const response = await retryRequest(() =>
      api.delete(`/rooms/room-types/${roomTypeId}/extra-services/${serviceId}`)
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Validation helper
export const validateRoomTypeData = (data) => {
  const errors = {};

  if (!data.name?.trim()) errors.name = "Name is required";
  if (!data.basePrice || data.basePrice <= 0)
    errors.basePrice = "Valid base price is required";
  if (!data.maxOccupancy || data.maxOccupancy < 1)
    errors.maxOccupancy = "Valid maximum occupancy is required";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
