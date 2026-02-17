import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";

/**
 * Custom hook to use Product context
 * @returns {Object} Product context value
 */
export const useProducts = () => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }

  return context;
};

export default useProducts;
