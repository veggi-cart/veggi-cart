import apiClient from "../api.client";

const productsApi = {
  getAll: async () => {
    const response = await apiClient.get("/product");
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/product/${id}`);
    return response.data;
  },
};

export default productsApi;
