import { useOrderContext } from "../context/OrderContext";

/**
 * Primary hook for order features.
 * Exposes everything from OrderContext in one import.
 *
 * @example
 *   const { createOrder, loading, currentOrder } = useOrder();
 */
export function useOrder() {
  return useOrderContext();
}
