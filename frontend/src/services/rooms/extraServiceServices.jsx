import api from "../../utils/api";

const prepareFormData = (serviceData) => {
  const formData = new FormData();
  Object.entries(serviceData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }
  });
  return formData;
};

export const createExtraService = async (serviceData) => {
  try {
    const response = await api.post("/rooms/extra-services", serviceData, {
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    console.error("Error creating extra service:", error);
    throw error;
  }
};

export const getAllExtraServices = async () => {
  try {
    const response = await api.get("/rooms/extra-services");
    return response || [];
  } catch (error) {
    console.error("Error fetching extra services:", error);
    return [];
  }
};

export const getAllExtraServicesExport = async () => {
  try {
    const response = await api.get("/rooms/extra-services");
    return response.extraServices || [];
  } catch (error) {
    console.error("Error fetching extra services:", error);
    return [];
  }
};

export const getExtraServiceById = async (id) => {
  try {
    const response = await api.get(`/rooms/extra-services/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching extra service:", error);
    throw error;
  }
};

export const updateExtraService = async (serviceId, serviceData) => {
  try {
    const response = await api.patch(
      `/rooms/extra-services/${serviceId}`,
      serviceData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating extra service:", error);
    throw error;
  }
};

export const deleteExtraService = async (serviceId) => {
  try {
    const response = await api.delete(`/rooms/extra-services/${serviceId}`);
    return response;
  } catch (error) {
    console.error("Error deleting extra service:", error);
    throw error;
  }
};

export const toggleExtraService = async (serviceId) => {
  try {
    const response = await api.patch(
      `/rooms/extra-services/${serviceId}/toggle`
    );
    return response;
  } catch (error) {
    console.error("Error toggling extra service:", error);
    throw error;
  }
};

export const bulkUpdateExtraServices = async (services) => {
  try {
    const response = await api.patch("/rooms/extra-services/bulk", services, {
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    console.error("Error bulk updating extra services:", error);
    throw error;
  }
};

export const searchExtraServices = async (searchParams) => {
  try {
    const response = await api.get("/rooms/extra-services", {
      params: searchParams,
    });
    return response;
  } catch (error) {
    console.error("Error searching extra services:", error);
    throw error;
  }
};

export default {
  createExtraService,
  getAllExtraServices,
  getAllExtraServicesExport,
  getExtraServiceById,
  updateExtraService,
  deleteExtraService,
  toggleExtraService,
  bulkUpdateExtraServices,
  searchExtraServices,
};
