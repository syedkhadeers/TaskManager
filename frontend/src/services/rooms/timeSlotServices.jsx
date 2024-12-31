import api from "../../utils/api";

// Create new time slot
export const createTimeSlot = async (timeSlotData) => {
  try {
    const formattedData = {
      name: timeSlotData.name?.trim(),
      checkInTime: timeSlotData.checkInTime?.trim(),
      checkOutTime: timeSlotData.checkOutTime?.trim(),
      sameDay: timeSlotData.sameDay === "Next Day" ? "NextDay" : "SameDay", // Match enum values
      priceMultiplier: Number(timeSlotData.priceMultiplier) || 1,
      isActive: timeSlotData.isActive ?? true,
    };

    const response = await api.post("/rooms/time-slots", formattedData);
    return response;
  } catch (error) {
    throw {
      message: error.message || "Time slot creation failed",
      status: error.status,
      data: error.data,
    };
  }
};

// Get all time slots with filtering and sorting
export const getAllTimeSlots = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters.isActive !== undefined) {
      queryParams.append("isActive", filters.isActive);
    }
    if (filters.sameDay) {
      queryParams.append("sameDay", filters.sameDay);
    }

    const response = await api.get(
      `/rooms/time-slots?${queryParams.toString()}`
    );
    console.log("Response from API:", response);
    return {
      count: response.count,
      timeSlots: response.timeSlots.map(formatTimeSlotResponse),
    };
  } catch (error) {
    throw {
      message: error.message || "Failed to fetch time slots",
      status: error.status,
      data: error.data,
    };
  }
};

// Get time slot by ID
export const getTimeSlotById = async (id) => {
  try {
    const response = await api.get(`/rooms/time-slots/${id}`);
    return formatTimeSlotResponse(response);
  } catch (error) {
    throw {
      message: error.message || "Failed to fetch time slot",
      status: error.status,
      data: error.data,
    };
  }
};

// Update time slot
export const updateTimeSlot = async (id, updateData) => {
  try {
    const formattedData = {
      ...(updateData.name && { name: updateData.name.trim() }),
      ...(updateData.checkInTime && {
        checkInTime: updateData.checkInTime.trim(),
      }),
      ...(updateData.checkOutTime && {
        checkOutTime: updateData.checkOutTime.trim(),
      }),
      ...(updateData.sameDay && {
        sameDay: updateData.sameDay === "Next Day" ? "NextDay" : "SameDay",
      }),
      ...(updateData.priceMultiplier && {
        priceMultiplier: Number(updateData.priceMultiplier),
      }),
      ...(updateData.isActive !== undefined && {
        isActive: updateData.isActive,
      }),
    };

    const response = await api.patch(`/rooms/time-slots/${id}`, formattedData);
    return formatTimeSlotResponse(response.timeSlot);
  } catch (error) {
    throw {
      message: error.message || "Failed to update time slot",
      status: error.status,
      data: error.data,
    };
  }
};
// Delete time slot
export const deleteTimeSlot = async (id) => {
  try {
    const response = await api.delete(`/rooms/time-slots/${id}`);
    return response;
  } catch (error) {
    throw {
      message: error.message || "Failed to delete time slot",
      status: error.status,
      data: error.data,
    };
  }
};

// Toggle time slot status
export const toggleTimeSlot = async (id) => {
  try {
    console.log("Attempting to toggle time slot status for ID:", id);
    const response = await api.patch(`/rooms/time-slots/${id}/toggle`);
    console.log("Response from API:", response);
    return response.timeSlot;
  } catch (error) {
    throw {
      message:
        error.response?.data?.message || "Failed to toggle time slot status",
      status: error.response?.status,
      data: error.response?.data,
    };
  }
};



// Validate time slot data
export const validateTimeSlotData = (data) => {
  const errors = {};

  if (!data.name?.trim()) {
    errors.name = "Name is required";
  }

  if (!data.checkInTime?.trim()) {
    errors.checkInTime = "Check-in time is required";
  }

  if (!data.checkOutTime?.trim()) {
    errors.checkOutTime = "Check-out time is required";
  }

  if (data.priceMultiplier) {
    const multiplier = Number(data.priceMultiplier);
    if (isNaN(multiplier) || multiplier <= 0) {
      errors.priceMultiplier = "Price multiplier must be a positive number";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Format time slot response
export const formatTimeSlotResponse = (timeSlot) => ({
  id: timeSlot._id,
  name: timeSlot.name,
  checkInTime: timeSlot.checkInTime,
  checkOutTime: timeSlot.checkOutTime,
  priceMultiplier: timeSlot.priceMultiplier,
  sameDay: timeSlot.sameDay, // Add this line
  isActive: timeSlot.isActive,
  createdAt: new Date(timeSlot.createdAt).toISOString(),
  updatedAt: new Date(timeSlot.updatedAt).toISOString(),
});

export default {
  createTimeSlot,
  getAllTimeSlots,
  getTimeSlotById,
  updateTimeSlot,
  deleteTimeSlot,
  toggleTimeSlot,
  validateTimeSlotData,
  formatTimeSlotResponse,
};
