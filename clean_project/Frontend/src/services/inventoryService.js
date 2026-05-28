import api from "./api";

const inventoryService = {
  /**
   * Get paginated inventory list with optional filters.
   * @param {{ status, category, search, page, limit }} params
   */
  getAll: async (params = {}) => {
    const response = await api.get("/inventory", { params });
    return response.data; // { success, total, page, totalPages, data }
  },

  /**
   * Get a single inventory item by ID.
   */
  getById: async (id) => {
    const response = await api.get(`/inventory/${id}`);
    return response.data.data;
  },

  /**
   * Get inventory summary stats (status breakdown, total value).
   */
  getStats: async () => {
    const response = await api.get("/inventory/stats");
    return response.data; // { success, totalItems, breakdown }
  },

  /**
   * Create a new inventory item.
   */
  create: async (itemData) => {
    const response = await api.post("/inventory", itemData);
    return response.data.data;
  },

  /**
   * Update an inventory item.
   */
  update: async (id, itemData) => {
    const response = await api.put(`/inventory/${id}`, itemData);
    return response.data.data;
  },

  /**
   * Delete an inventory item.
   */
  delete: async (id) => {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  },
};

export default inventoryService;
