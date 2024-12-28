import { api, handleApiError, retryRequest } from "../../utils/api";

export const createTimeSlot = async (timeSlotData) => {
  try {
    const response = await retryRequest(() =>
      api.post("/rooms/time-slots", timeSlotData)
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getAllTimeSlots = async () => {
  try {
    const response = await retryRequest(() => api.get("/rooms/time-slots"));
    return response.timeSlots;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getTimeSlotById = async (id) => {
  try {
    const response = await retryRequest(() =>
      api.get(`/rooms/time-slots/${id}`)
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateTimeSlot = async (slotId, timeSlotData) => {
  try {
    const response = await retryRequest(() =>
      api.patch(`/rooms/time-slots/${slotId}`, timeSlotData)
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteTimeSlot = async (slotId) => {
  try {
    const response = await retryRequest(() =>
      api.delete(`/rooms/time-slots/${slotId}`)
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const toggleTimeSlot = async (slotId) => {
  try {
    const response = await retryRequest(() =>
      api.patch(`/rooms/time-slots/${slotId}/toggle`)
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};
