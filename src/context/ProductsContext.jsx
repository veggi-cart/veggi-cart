import { createContext, useContext, useState, useEffect } from "react";
import productsApi from "../api/productsApi";

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all 100 products once on mount
  // All filtering, searching, and categorization happens locally on frontend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsApi.getAll();

      // Transform API data to match your current product structure
      const transformedProducts = transformProducts(data);
      setProducts(transformedProducts);
    } catch (err) {
      setError(err.message || "Failed to fetch products");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Transform API response to match your app's product structure
  const transformProducts = (apiProducts) => {
    if (!Array.isArray(apiProducts)) {
      return [];
    }

    return apiProducts.map((apiProduct) => ({
      id: apiProduct.id || apiProduct._id,
      name: apiProduct.name,
      category: apiProduct.category?.toLowerCase() || "other",
      imageUrl: apiProduct.imageUrl || apiProduct.image || "/placeholder.png",
      isVeg: apiProduct.isVeg ?? true,
      keywords: apiProduct.keywords || [],
      available: apiProduct.available ?? true,
      priceConfigs: transformPriceConfigs(
        apiProduct.priceConfigs || apiProduct.prices || [],
      ),
    }));
  };

  // Transform price configurations
  const transformPriceConfigs = (priceConfigs) => {
    if (!Array.isArray(priceConfigs) || priceConfigs.length === 0) {
      // Default price config if none provided
      return [
        {
          value: 1,
          unit: "piece",
          price: 0,
          mrp: null,
        },
      ];
    }

    return priceConfigs.map((config) => ({
      value: config.value || 1,
      unit: config.unit || "piece",
      price: config.price || 0,
      mrp: config.mrp || null, // Include MRP if available
    }));
  };

  // Get product by ID
  const getProductById = (id) => {
    return products.find((product) => product.id === id);
  };

  // Get products by category
  const getProductsByCategory = (category) => {
    if (category === "all") return products;
    return products.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase(),
    );
  };

  // Search products
  const searchProducts = (searchTerm) => {
    if (!searchTerm) return products;

    const search = searchTerm.toLowerCase().trim();
    return products.filter((product) => {
      // Check product name
      if (product.name.toLowerCase().includes(search)) {
        return true;
      }
      // Check keywords
      return product.keywords.some((keyword) =>
        keyword.toLowerCase().includes(search),
      );
    });
  };

  // Refresh products
  const refreshProducts = async () => {
    await fetchProducts();
  };

  const value = {
    products,
    loading,
    error,
    getProductById,
    getProductsByCategory,
    searchProducts,
    refreshProducts,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsContext;
