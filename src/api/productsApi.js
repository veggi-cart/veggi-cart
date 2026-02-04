import axiosClient from "./axiosClient";

const productsApi = {
  // Get all products/ingredients
  // All filtering, searching, and categorization is done on the frontend
  getAll: async () => {
    try {
      const response = await axiosClient.get("/ingredient");
      // API returns: { status: "success", results: 56, data: [...] }
      return response.data.data; // Access the nested data array
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },
};

export default productsApi;
