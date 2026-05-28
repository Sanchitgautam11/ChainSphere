import api from "./api";

const aiService = {
  getAiStatus: async () => {
    const response = await api.get("/ai/status");
    return response.data;
  },

  predictDemand: async (data) => {
    // data: { sku, start_date, end_date, granularity }
    const response = await api.post("/ai/predict", data);
    return response.data;
  },

  optimizeInventory: async (items, confidence_threshold) => {
    const payload = confidence_threshold ? { items, confidence_threshold } : { items };
    const response = await api.post("/ai/optimize", payload);
    return response.data;
  },

  clusterProduct: async (productData) => {
    const response = await api.post("/ai/cluster", productData);
    return response.data;
  },

  searchAiCommand: async (query) => {
    const response = await api.post("/ai/search", { query });
    return response.data;
  }
};

export default aiService;
