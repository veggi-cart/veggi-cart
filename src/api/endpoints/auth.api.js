import apiClient from "../api.client";

const AUTH_BASE = "/auth";

const authAPI = {
  register: async (userData) => {
    try {
      const response = await apiClient.post(`${AUTH_BASE}/register`, userData);

      // Store token and user data
      if (response.data.success && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data));
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await apiClient.post(`${AUTH_BASE}/login`, credentials);

      // Store token and user data
      if (response.data.success && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data));
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.clear();
    window.location.href = "/";
  },

  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem("authToken");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },

  requestOTP: async (data) => {
    try {
      const response = await apiClient.post(`${AUTH_BASE}/request-otp`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyOTP: async (data) => {
    try {
      const response = await apiClient.post(`${AUTH_BASE}/verify-otp`, data);

      // Store token and user data
      if (response.data.success && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data));
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default authAPI;
