import apiClient from "../api.client";

const walletAPI = {
  getWallet: async (page = 1) => {
    const response = await apiClient.get(`/wallet/?page=${page}`);
    return response.data;
  },

  addFunds: async (amount) => {
    const response = await apiClient.post("/wallet/add-funds", { amount });
    return response.data;
  },

  verifyFunds: async (txnId) => {
    const response = await apiClient.post("/wallet/verify", { txnId });
    return response.data;
  },
};

export default walletAPI;
