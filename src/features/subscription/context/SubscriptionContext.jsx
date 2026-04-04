import { createContext, useContext, useState, useCallback, useEffect } from "react";
import subscriptionAPI from "../../../api/endpoints/subscription.api";
import { errorBus } from "../../../api/errorBus";

const SubscriptionContext = createContext(null);

// Helper: replace a subscription in the list by _id
const replaceSub = (prev, updated) =>
  prev.map((s) => (s._id === updated._id ? updated : s));

export function SubscriptionProvider({ children }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  // ── Fetch list ─────────────────────────────────────────────────────────────
  const fetchSubscriptions = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await subscriptionAPI.getSubscriptions(page);
      if (res.success) {
        setSubscriptions(res.data || []);
        setPagination(res.pagination || null);
      }
    } catch (err) {
      errorBus.emit(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch single ───────────────────────────────────────────────────────────
  const fetchSubscription = useCallback(async (subscriptionId) => {
    setLoading(true);
    try {
      const res = await subscriptionAPI.getSubscription(subscriptionId);
      if (res.success && res.data) {
        setSubscriptions((prev) => {
          const exists = prev.find((s) => s._id === res.data._id);
          return exists ? replaceSub(prev, res.data) : [...prev, res.data];
        });
        return res.data;
      }
    } catch (err) {
      errorBus.emit(err.message, "error");
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  // Fetch once when the provider mounts (only if authenticated)
  useEffect(() => {
    if (localStorage.getItem("authToken")) fetchSubscriptions();
  }, [fetchSubscriptions]);

  // ── Create subscription ────────────────────────────────────────────────────
  const createSubscription = useCallback(async (items, dates, paymentMethod) => {
    setLoading(true);
    try {
      const res = await subscriptionAPI.createSubscription(items, dates, paymentMethod);
      if (!res.success) throw new Error(res.message || "Failed to create subscription");
      return res.data;
    } catch (err) {
      errorBus.emit(err.message, "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Verify online payment ──────────────────────────────────────────────────
  const verifyPayment = useCallback(async (subscriptionId) => {
    setLoading(true);
    try {
      const res = await subscriptionAPI.verifyPayment(subscriptionId);
      if (!res.success) throw new Error(res.message || "Verification failed");
      return res.data;
    } catch (err) {
      errorBus.emit(err.message, "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Skip date ──────────────────────────────────────────────────────────────
  const skipDate = useCallback(async (subscriptionId, date, itemIds = []) => {
    setLoading(true);
    try {
      const res = await subscriptionAPI.skipDate(subscriptionId, date, itemIds);
      if (!res.success) throw new Error(res.message || "Failed to skip date");
      if (res.data) setSubscriptions((prev) => replaceSub(prev, res.data));
      errorBus.emit(res.message || "Skipped, refund added to wallet", "success");
      return res.data;
    } catch (err) {
      errorBus.emit(err.message, "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Undo skip ──────────────────────────────────────────────────────────────
  const undoSkip = useCallback(async (subscriptionId, date, itemIds = []) => {
    setLoading(true);
    try {
      const res = await subscriptionAPI.undoSkip(subscriptionId, date, itemIds);
      if (!res.success) throw new Error(res.message || "Failed to undo skip");
      if (res.data) setSubscriptions((prev) => replaceSub(prev, res.data));
      errorBus.emit(res.message || "Skip undone", "success");
      return res.data;
    } catch (err) {
      errorBus.emit(err.message, "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Add extra ──────────────────────────────────────────────────────────────
  const addExtra = useCallback(async (subscriptionId, date, productId, priceConfigId, qty) => {
    setLoading(true);
    try {
      const res = await subscriptionAPI.addExtra(subscriptionId, date, productId, priceConfigId, qty);
      if (!res.success) throw new Error(res.message || "Failed to add extra");
      if (res.data) setSubscriptions((prev) => replaceSub(prev, res.data));
      errorBus.emit(res.message || "Extra item added", "success");
      return res.data;
    } catch (err) {
      errorBus.emit(err.message, "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Pause ──────────────────────────────────────────────────────────────────
  const pauseSubscription = useCallback(async (subscriptionId) => {
    setLoading(true);
    try {
      const res = await subscriptionAPI.pause(subscriptionId);
      if (!res.success) throw new Error(res.message || "Failed to pause");
      if (res.data) setSubscriptions((prev) => replaceSub(prev, res.data));
      errorBus.emit("Subscription paused", "success");
      return res.data;
    } catch (err) {
      errorBus.emit(err.message, "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Resume ─────────────────────────────────────────────────────────────────
  const resumeSubscription = useCallback(async (subscriptionId) => {
    setLoading(true);
    try {
      const res = await subscriptionAPI.resume(subscriptionId);
      if (!res.success) throw new Error(res.message || "Failed to resume");
      if (res.data) setSubscriptions((prev) => replaceSub(prev, res.data));
      errorBus.emit("Subscription resumed", "success");
      return res.data;
    } catch (err) {
      errorBus.emit(err.message, "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Cancel ─────────────────────────────────────────────────────────────────
  const cancelSubscription = useCallback(async (subscriptionId, reason) => {
    setLoading(true);
    try {
      const res = await subscriptionAPI.cancel(subscriptionId, reason);
      if (!res.success) throw new Error(res.message || "Failed to cancel");
      const updated = res.data?.subscription || res.data;
      if (updated) setSubscriptions((prev) => replaceSub(prev, updated));
      errorBus.emit(res.message || "Subscription cancelled", "success");
      return res.data;
    } catch (err) {
      errorBus.emit(err.message, "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        pagination,
        loading,
        fetchSubscriptions,
        fetchSubscription,
        createSubscription,
        verifyPayment,
        skipDate,
        undoSkip,
        addExtra,
        pauseSubscription,
        resumeSubscription,
        cancelSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptionContext() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscriptionContext must be used within SubscriptionProvider");
  return ctx;
}
