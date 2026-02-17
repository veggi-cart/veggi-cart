import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import orderAPI from "../../../api/endpoints/order.api";
import { errorBus } from "../../../api/errorBus";
import {
  PAYMENT_POLL_INTERVAL_MS,
  PAYMENT_POLL_MAX_ATTEMPTS,
  PAYMENT_STATUS,
  ORDER_STATUS,
} from "../../../constants/order.constants";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Polling ref — lets us cancel the interval from anywhere
  const pollRef = useRef(null);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const clearError = useCallback(() => setError(null), []);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  // ── Create Order ───────────────────────────────────────────────────────────
  /**
   * Creates the backend order and, for online payments, loads the Cashfree SDK
   * and opens the payment sheet.
   *
   * Returns:
   *  - { success: true, order, isCod: true }          for COD
   *  - { success: true, order, paymentSessionId, cashfreeOrderId }  for online
   *  - { success: false, message }                    on error
   */
  const createOrder = useCallback(async (paymentMethod) => {
    setLoading(true);
    setError(null);

    try {
      const result = await orderAPI.createOrder(paymentMethod);

      if (!result.success)
        throw new Error(result.message || "Failed to create order");

      const { order, paymentSessionId, cashfreeOrderId } = result.data;
      setCurrentOrder(order);

      if (paymentMethod === "cod") {
        errorBus.emit("Order placed successfully!", "success");
        return { success: true, order, isCod: true };
      }

      return { success: true, order, paymentSessionId, cashfreeOrderId };
    } catch (err) {
      const msg = err.message || "Failed to create order";
      setError(msg);
      errorBus.emit(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Poll Order Status ──────────────────────────────────────────────────────
  /**
   * Polls GET /orders/:orderId/status until payment is confirmed or max
   * attempts are exceeded.  Falls back to verifyPayment() as a final check.
   *
   * onUpdate(statusData) is called on every poll tick so the UI can react.
   * Resolves with the final status object.
   */
  const pollOrderStatus = useCallback(
    (orderId, { onUpdate, onSuccess, onFail } = {}) => {
      stopPolling();
      let attempts = 0;

      return new Promise((resolve) => {
        pollRef.current = setInterval(async () => {
          attempts += 1;

          try {
            const res = await orderAPI.getOrderStatus(orderId);
            const statusData = res.data;
            onUpdate?.(statusData);

            const { paymentStatus, orderStatus } = statusData;

            if (
              paymentStatus === PAYMENT_STATUS.SUCCESS ||
              orderStatus === ORDER_STATUS.CONFIRMED ||
              orderStatus === ORDER_STATUS.DELIVERED
            ) {
              stopPolling();
              onSuccess?.(statusData);
              return resolve({ confirmed: true, data: statusData });
            }

            if (
              paymentStatus === PAYMENT_STATUS.FAILED ||
              orderStatus === ORDER_STATUS.CANCELLED
            ) {
              stopPolling();
              onFail?.(statusData);
              return resolve({ confirmed: false, data: statusData });
            }
          } catch {
            // Network blip — keep polling
          }

          // Max attempts reached — try manual verify as last resort
          if (attempts >= PAYMENT_POLL_MAX_ATTEMPTS) {
            stopPolling();
            try {
              const verifyRes = await orderAPI.verifyPayment(orderId);
              const d = verifyRes.data;
              if (d?.payment?.status === PAYMENT_STATUS.SUCCESS) {
                onSuccess?.(d);
                return resolve({ confirmed: true, data: d });
              }
            } catch {
              // ignore
            }
            onFail?.({ timedOut: true });
            resolve({ confirmed: false, timedOut: true });
          }
        }, PAYMENT_POLL_INTERVAL_MS);
      });
    },
    [stopPolling],
  );

  // ── Fetch Single Order ─────────────────────────────────────────────────────
  const fetchOrder = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderAPI.getOrder(orderId);
      setCurrentOrder(res.data);
      return res.data;
    } catch (err) {
      const msg = err.message || "Order not found";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch Orders List ──────────────────────────────────────────────────────
  const fetchOrders = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderAPI.getUserOrders(params);
      setOrders(res.data || []);
      setPagination(res.pagination || null);
      return res.data;
    } catch (err) {
      const msg = err.message || "Failed to fetch orders";
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Cancel Order ───────────────────────────────────────────────────────────
  const cancelOrder = useCallback(
    async (orderId, reason) => {
      setLoading(true);
      setError(null);
      try {
        const res = await orderAPI.cancelOrder(orderId, reason);
        if (!res.success) throw new Error(res.message);
        // Update in-place if this order is in our list
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? res.data : o)),
        );
        if (currentOrder?.orderId === orderId) setCurrentOrder(res.data);
        errorBus.emit("Order cancelled successfully", "success");
        return { success: true, order: res.data };
      } catch (err) {
        const msg = err.message || "Failed to cancel order";
        setError(msg);
        errorBus.emit(msg, "error");
        return { success: false, message: msg };
      } finally {
        setLoading(false);
      }
    },
    [currentOrder],
  );

  // ── Value ──────────────────────────────────────────────────────────────────
  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        pagination,
        loading,
        error,
        clearError,
        createOrder,
        fetchOrder,
        fetchOrders,
        cancelOrder,
        pollOrderStatus,
        stopPolling,
        setCurrentOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrderContext() {
  const ctx = useContext(OrderContext);
  if (!ctx)
    throw new Error("useOrderContext must be used within OrderProvider");
  return ctx;
}
