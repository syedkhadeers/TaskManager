import { api, handleApiError } from "../../utils/api";

export const createRoomType = async (roomTypeData) => {
  try {
    const response = await api.post("/roomtype/create", roomTypeData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getAllRoomTypes = async () => {
  try {
    const response = await api.get("/roomtypes");
    return response.data.roomTypes;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getRoomTypeById = async (id) => {
  try {
    const response = await api.get(`/roomtype/${id}`);
    return response.data.roomType;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateRoomType = async (roomTypeId, roomTypeData) => {
  try {
    const formData = new FormData();
    Object.entries(roomTypeData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "images" && Array.isArray(value)) {
          value.forEach((file) => formData.append("images", file));
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    const response = await api.patch(`/roomtype/${roomTypeId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.roomType;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteRoomType = async (roomTypeId) => {
  try {
    const response = await api.delete(`/roomtype/${roomTypeId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const addExtraService = async (roomTypeId, extraServiceId) => {
  try {
    const response = await api.post(`/roomtype/${roomTypeId}/extraservice`, {
      extraServiceId,
    });
    return response.data.roomType;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const removeExtraService = async (roomTypeId, extraServiceId) => {
  try {
    const response = await api.delete(
      `/roomtype/${roomTypeId}/extraservice/${extraServiceId}`
    );
    return response.data.roomType;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const addTimeSlot = async (roomTypeId, timeSlotData) => {
  try {
    const response = await api.post(
      `/roomtype/${roomTypeId}/timeslot`,
      timeSlotData
    );
    return response.data.roomType;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const removeTimeSlot = async (roomTypeId, timeSlotId) => {
  try {
    const response = await api.delete(
      `/roomtype/${roomTypeId}/timeslot/${timeSlotId}`
    );
    return response.data.roomType;
  } catch (error) {
    throw handleApiError(error);
  }
};
