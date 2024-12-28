import { api, handleApiError, retryRequest } from "../../utils/api";

export const createExtraService = async (serviceData) => {
  try {
    const formData = new FormData();
    Object.entries(serviceData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const response = await retryRequest(() =>
      api.post("/rooms/extra-services", formData)
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getAllExtraServices = async () => {
  try {
    const response = await retryRequest(() => api.get("/rooms/extra-services"));
    return response.extraServices;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getExtraServiceById = async (id) => {
  try {
    const response = await retryRequest(() =>
      api.get(`/rooms/extra-services/${id}`)
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateExtraService = async (serviceId, serviceData) => {
  try {
    const response = await retryRequest(() =>
      api.patch(`/rooms/extra-services/${serviceId}`, serviceData)
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteExtraService = async (serviceId) => {
  try {
    const response = await retryRequest(() =>
      api.delete(`/rooms/extra-services/${serviceId}`)
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const toggleExtraService = async (serviceId) => {
  try {
    const response = await retryRequest(() =>
      api.patch(`/rooms/extra-services/${serviceId}/toggle`)
    );
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};
