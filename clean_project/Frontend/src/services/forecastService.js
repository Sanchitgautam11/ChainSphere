import api from "./api";

const forecastService = {
  /**
   * Get all forecasts with optional filters.
   * @param {{ sku, status, page, limit }} params
   */
  getAll: async (params = {}) => {
    const response = await api.get("/forecast", { params });
    return response.data; // { success, total, page, totalPages, data }
  },

  /**
   * Get a single forecast by ID.
   */
  getById: async (id) => {
    const response = await api.get(`/forecast/${id}`);
    return response.data.data;
  },

  /**
   * Get the latest completed forecast for a specific SKU.
   */
  getLatestBySku: async (sku) => {
    const response = await api.get(`/forecast/latest/${sku}`);
    return response.data.data;
  },

  /**
   * Trigger an AI forecast generation job.
   * @param {{ productSku, productName, startDate, endDate, granularity, modelUsed }} data
   */
  generate: async (data) => {
    const response = await api.post("/forecast/generate", data);
    return response.data; // { success, message, forecastId }
  },

  /**
   * Delete a forecast.
   */
  delete: async (id) => {
    const response = await api.delete(`/forecast/${id}`);
    return response.data;
  },
};

export default forecastService;
