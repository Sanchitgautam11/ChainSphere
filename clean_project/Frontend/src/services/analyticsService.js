import api from "./api";

const analyticsService = {
  /**
   * Get high-level dashboard KPIs.
   * Returns: { totalInventoryItems, lowStockItems, outOfStockItems,
   *            totalInventoryValue, totalForecasts, forecastAccuracy }
   */
  getDashboardKpis: async () => {
    const response = await api.get("/analytics/dashboard");
    return response.data.data;
  },

  /**
   * Get all analytics reports with optional type filter.
   * @param {{ type, page, limit }} params
   */
  getAll: async (params = {}) => {
    const response = await api.get("/analytics", { params });
    return response.data;
  },

  /**
   * Get a single analytics report by ID.
   */
  getById: async (id) => {
    const response = await api.get(`/analytics/${id}`);
    return response.data.data;
  },

  /**
   * Get all unresolved supply chain risk events.
   */
  getRiskEvents: async () => {
    const response = await api.get("/analytics/risks");
    return response.data; // { success, total, data }
  },

  /**
   * Get inventory category breakdown for pie/bar charts.
   */
  getInventoryBreakdown: async () => {
    const response = await api.get("/analytics/inventory-breakdown");
    return response.data.data;
  },
};

export default analyticsService;
