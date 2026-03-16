import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import productsApi from "../../../api/endpoints/products.api";
import { useApiCall } from "../../../api/use.apiCall";

export const ProductContext = createContext(null);

const CACHE_KEY = "gb_products";

// Read cached products from localStorage (instant, no network)
const getCached = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* corrupted cache */ }
  return null;
};

const setCache = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch { /* storage full */ }
};

export const ProductProvider = ({ children }) => {
  // Initialize from cache — user sees products instantly
  const [products, setProducts] = useState(() => getCached() || []);
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

  // Only show loading if no cached data
  const loading = (listLoading && products.length === 0) || detailLoading;

  // ── Actions ──────────────────────────────────────────────────────────────

  const fetchProducts = useCallback(async () => {
    const response = await runGetAll();
    if (response?.data) {
      setProducts(response.data);
      setCache(response.data);
    }
  }, [runGetAll]);

  const getProductById = useCallback(
    async (id) => {
      const response = await runGetById(id);
      return response?.data ?? null;
    },
    [runGetById],
  );

  // Always refresh from API in background (stale-while-revalidate)
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

  const value = useMemo(
    () => ({
      products,
      loading,
      filters,
      fetchProducts,
      getProductById,
      updateFilters,
      resetFilters,
      getFilteredProducts,
      getCategories,
    }),
    [
      products,
      loading,
      filters,
      fetchProducts,
      getProductById,
      updateFilters,
      resetFilters,
      getFilteredProducts,
      getCategories,
    ],
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export default ProductContext;
