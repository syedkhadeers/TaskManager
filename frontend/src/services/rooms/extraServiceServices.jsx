import { api, handleApiError } from "../../utils/api";

export const createExtraService = async (serviceData) => {
  try {
    const formData = new FormData();
    Object.entries(serviceData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await api.post("/extraservice/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


export const getAllExtraServices = async () => {
  try {
    const response = await api.get("/extraservices");
    return response.data.extraServices; // Return just the array
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getExtraServiceById = async (id) => {
  try {
    const response = await api.get(`/extraservice/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateExtraService = async (serviceId, serviceData) => {
  try {
    const formData = new FormData();
    Object.entries(serviceData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await api.patch(`/extraservice/${serviceId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteExtraService = async (serviceId) => {
  try {
    const response = await api.delete(`/extraservice/${serviceId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
