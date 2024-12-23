import { api, handleApiError } from "../../utils/api";

export const createTimeSlot = async (timeSlotData) => {
  try {
    const response = await api.post("/timeslot/create", timeSlotData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getAllTimeSlotsExport = async () => {
  try {
    const response = await api.get("/timeslots");
    return response.data.timeSlots;
  } catch (error) {
    throw handleApiError(error);
  }
};
export const getAllTimeSlots = async () => {
  try {
    const response = await api.get("/timeslots");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getTimeSlot = async (id) => {
  try {
    const response = await api.get(`/timeslot/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateTimeSlot = async (id, timeSlotData) => {
  try {
    const response = await api.patch(`/timeslot/${id}`, timeSlotData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteTimeSlot = async (id) => {
  try {
    const response = await api.delete(`/timeslot/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
