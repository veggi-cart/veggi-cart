import apiClient from "../api.client";

const cartAPI = {
  getCart: async () => {
    const response = await apiClient.get("/cart/");
    return response.data;
  },

  addItem: async (productId, priceConfigId, quantity = 1) => {
    // Corrected to use productId
    const response = await apiClient.post("/cart/items", {
      productId,
      priceConfigId,
      quantity,
    });
    return response.data;
  },

  updateItemQuantity: async (cartItemId, action) => {
    const response = await apiClient.patch(`/cart/items/${cartItemId}`, {
      action,
    });
    return response.data;
  },

  removeItem: async (cartItemId) => {
    const response = await apiClient.delete(`/cart/items/${cartItemId}`);
    return response.data;
  },

  clearCart: async () => {
    // Aligned with the suggestion to clear items
    const response = await apiClient.delete("/cart/items");
    return response.data;
  },
};

export default cartAPI;
