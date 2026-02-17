import { createContext, useCallback, useEffect, useState } from "react";
import productsApi from "../../../api/endpoints/products.api";
import useAuth from "../../auth/hooks/useAuth";
import { useApiCall } from "../../../api/use.apiCall";

export const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: null,
    searchQuery: "",
    availableOnly: true,
  });

  const { execute: runGetAll, loading: listLoading } = useApiCall(
    productsApi.getAll,
    { silent: true },
  );
  const { execute: runGetById, loading: detailLoading } = useApiCall(
    productsApi.getById,
  );

  const loading = listLoading || detailLoading;

  // ── Actions ──────────────────────────────────────────────────────────────

  const fetchProducts = useCallback(async () => {
    if (!isAuthenticated) return;
    const response = await runGetAll();
    if (response?.data) setProducts(response.data);
  }, [isAuthenticated, runGetAll]);

  const getProductById = useCallback(
    async (id) => {
      const response = await runGetById(id);
      return response?.data ?? null;
    },
    [runGetById],
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ── Filter helpers ───────────────────────────────────────────────────────

  const updateFilters = useCallback(
    (newFilters) => setFilters((prev) => ({ ...prev, ...newFilters })),
    [],
  );

  const resetFilters = useCallback(
    () => setFilters({ category: null, searchQuery: "", availableOnly: true }),
    [],
  );

  const getFilteredProducts = useCallback(() => {
    let filtered = products;

    if (filters.availableOnly) filtered = filtered.filter((p) => p.available);
    if (filters.category)
      filtered = filtered.filter((p) => p.category === filters.category);

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.keywords?.some((k) => k.toLowerCase().includes(q)),
      );
    }
    return filtered;
  }, [products, filters]);

  const getCategories = useCallback(
    () => [...new Set(products.map((p) => p.category))].filter(Boolean),
    [products],
  );

  const value = {
    products,
    loading,
    filters,
    fetchProducts,
    getProductById,
    updateFilters,
    resetFilters,
    getFilteredProducts,
    getCategories,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export default ProductContext;
