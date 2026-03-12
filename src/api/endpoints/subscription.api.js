import apiClient from "../api.client";

const subscriptionAPI = {
  /** Paginated list of user's subscriptions */
  getSubscriptions: async (page = 1, limit = 10) => {
    const response = await apiClient.get("/subscriptions", {
      params: { page, limit },
    });
    return response.data;
  },

  /** Get single subscription by subscriptionId */
  getSubscription: async (subscriptionId) => {
    const response = await apiClient.get(`/subscriptions/${subscriptionId}`);
    return response.data;
  },

  /**
   * Create a new subscription.
   * items: [{ productId, priceConfigId, quantity }]
   * dates: ["2026-03-15", ...]
   * paymentMethod: "wallet" | "online"
   */
  createSubscription: async (items, dates, paymentMethod) => {
    const response = await apiClient.post("/subscriptions", {
      items,
      dates,
      paymentMethod,
    });
    return response.data;
  },

  /** Verify online payment for subscription */
  verifyPayment: async (subscriptionId) => {
    const response = await apiClient.post("/subscriptions/verify", {
      subscriptionId,
    });
    return response.data;
  },

  /** Skip a delivery date */
  skipDate: async (subscriptionId, date) => {
    const response = await apiClient.post(
      `/subscriptions/${subscriptionId}/skip`,
      { date },
    );
    return response.data;
  },

  /** Pause subscription */
  pause: async (subscriptionId) => {
    const response = await apiClient.post(
      `/subscriptions/${subscriptionId}/pause`,
    );
    return response.data;
  },

  /** Resume subscription */
  resume: async (subscriptionId) => {
    const response = await apiClient.post(
      `/subscriptions/${subscriptionId}/resume`,
    );
    return response.data;
  },

  /** Cancel subscription */
  cancel: async (subscriptionId, reason) => {
    const response = await apiClient.post(
      `/subscriptions/${subscriptionId}/cancel`,
      { reason },
    );
    return response.data;
  },
};

export default subscriptionAPI;
