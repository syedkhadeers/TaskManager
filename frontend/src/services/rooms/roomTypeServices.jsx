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

    const response = await api.patch(`/roomtype/${roomTypeId}`, roomTypeData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      // Add timeout and response type options
      timeout: 30000,
      responseType: "json",
    });

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  } catch (error) {
    // Enhanced error logging
    console.error("Update Room Type Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
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


export const getAllTimeSlotsExport = async () => {
  try {
    const response = await api.get("/timeslots");
    return response.data.timeSlots || response.data;
  } catch (error) {
    console.error("Error fetching time slots:", error);
    throw error;
  }
};

// New helper function to validate form data
export const validateRoomTypeData = (data) => {
  const errors = {};

  if (!data.name) errors.name = "Name is required";
  if (!data.basePrice) errors.basePrice = "Base price is required";
  if (!data.maxOccupancy) errors.maxOccupancy = "Maximum occupancy is required";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
