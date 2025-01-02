import api from "../../utils/api";

export const prepareFormData = async (roomTypeData) => {
  const formData = new FormData();

  // Handle arrays and objects properly
  Object.keys(roomTypeData).forEach((key) => {
    if (key !== "images") {
      if (
        Array.isArray(roomTypeData[key]) ||
        typeof roomTypeData[key] === "object"
      ) {
        formData.append(key, JSON.stringify(roomTypeData[key]));
      } else {
        formData.append(key, roomTypeData[key]);
      }
    }
  });

  // Handle images
  if (roomTypeData.images?.length > 0) {
    for (let i = 0; i < roomTypeData.images.length; i++) {
      const image = roomTypeData.images[i];
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



export const createRoomType = async (roomTypeData) => {
  try {
    const formData = await prepareFormData(roomTypeData);
    const response = await api.post("/rooms/room-types", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create room type"
    );
  }
};


export const getAllRoomTypes = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await api.get(`/rooms/room-types?${queryParams}`);
    return response.roomTypes;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch room types");
  }
};

export const getRoomTypeById = async (id) => {
  try {
    const response = await api.get(`/rooms/room-types/${id}`);
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch room type");
  }
};

export const updateRoomType = async (id, formData) => {
  try {
    const response = await api.patch(`/rooms/room-types/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update room type"
    );
  }
};


export const deleteRoomType = async (id) => {
  try {
    const response = await api.delete(`/rooms/room-types/${id}`);
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to delete room type");
  }
};

export const toggleRoomType = async (id) => {
  try {
    const response = await api.patch(`/rooms/room-types/${id}/toggle`);
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to toggle room type status");
  }
};

export const addTimeSlotToRoomType = async (roomTypeId, timeSlotData) => {
  try {
    const response = await api.post(
      `/rooms/room-types/${roomTypeId}/time-slots`,
      {
        timeSlot: timeSlotData.timeSlot,
        price: parseFloat(timeSlotData.price),
        order: parseInt(timeSlotData.order),
      }
    );
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to add time slot");
  }
};

export const removeTimeSlotFromRoomType = async (roomTypeId, timeSlotId) => {
  try {
    const response = await api.delete(
      `/rooms/room-types/${roomTypeId}/time-slots/${timeSlotId}`
    );
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to remove time slot");
  }
};

export const addExtraServiceToRoomType = async (roomTypeId, serviceData) => {
  try {
    const response = await api.post(
      `/rooms/room-types/${roomTypeId}/extra-services`,
      {
        extraServices: serviceData.extraServices,
        price: parseFloat(serviceData.price),
        order: parseInt(serviceData.order),
      }
    );
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to add extra service");
  }
};

export const removeExtraServiceFromRoomType = async (roomTypeId, serviceId) => {
  try {
    const response = await api.delete(
      `/rooms/room-types/${roomTypeId}/extra-services/${serviceId}`
    );
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to remove extra service");
  }
};

export const validateRoomTypeData = (data) => {
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

  // Basic field validation
  if (!data.name?.trim()) errors.name = "Room type name is required";
  if (!data.basePrice || data.basePrice <= 0)
    errors.basePrice = "Valid base price is required";
  if (!data.maxOccupancy || data.maxOccupancy < 1)
    errors.maxOccupancy = "Valid maximum occupancy is required";

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

  // Time slot validation
  if (data.timeSlotPricing?.length > 0) {
    data.timeSlotPricing.forEach((slot, index) => {
      if (!slot.timeSlot) errors[`timeSlot${index}`] = "Time slot is required";
      if (!slot.price || slot.price <= 0)
        errors[`timeSlotPrice${index}`] = "Valid price is required";
    });
  }

  // Extra services validation
  if (data.extraServices?.length > 0) {
    data.extraServices.forEach((service, index) => {
      if (!service.extraServices)
        errors[`service${index}`] = "Service is required";
      if (!service.price || service.price <= 0)
        errors[`servicePrice${index}`] = "Valid price is required";
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  prepareFormData,
  createRoomType,
  getAllRoomTypes,
  getRoomTypeById,
  updateRoomType,
  deleteRoomType,
  toggleRoomType,
  addTimeSlotToRoomType,
  removeTimeSlotFromRoomType,
  addExtraServiceToRoomType,
  removeExtraServiceFromRoomType,
  validateRoomTypeData,
};
