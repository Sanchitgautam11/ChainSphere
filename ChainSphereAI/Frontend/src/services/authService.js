import api from "./api";

const authService = {
  /**
   * Register a new user account.
   * @param {{ name, email, password, company }} data
   */
  register: async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data; // { success, token, user }
  },

  /**
   * Login with email and password.
   * @param {{ email, password }} credentials
   */
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data; // { success, token, user }
  },

  /**
   * Fetch the currently authenticated user's profile.
   */
  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data.user;
  },

  /**
   * Update current user profile.
   * @param {{ name, company }} data
   */
  updateMe: async (data) => {
    const response = await api.put("/auth/me", data);
    return response.data.user;
  },

  /**
   * Change password.
   * @param {{ currentPassword, newPassword }} data
   */
  changePassword: async (data) => {
    const response = await api.put("/auth/change-password", data);
    return response.data;
  },
};

export default authService;
