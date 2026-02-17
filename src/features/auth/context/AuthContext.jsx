import { createContext, useCallback, useEffect, useState } from "react";
import authAPI from "../../../api/endpoints/auth.api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(authAPI.getToken());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Initialize from localStorage on mount ──────────────────────────────
  useEffect(() => {
    try {
      const storedToken = authAPI.getToken();
      const storedUser = authAPI.getCurrentUser();
      if (storedToken) {
        setToken(storedToken);
        if (storedUser) setUser(storedUser);
      }
    } catch {
      setError("Failed to initialize authentication");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── login ──────────────────────────────────────────────────────────────
  // Throws a proper Error so useApiCall (and any caller) gets err.message.
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(credentials);
      if (response.success) {
        setUser(response.data);
        setToken(authAPI.getToken());
        return { success: true, data: response.data };
      }
      // Treat a non-success response as an error so the caller can toast it
      throw new Error(response.message || "Login failed");
    } catch (err) {
      // err is already a normalized Error from apiClient interceptor
      // (or the one we threw above) — just re-throw so callers can handle it
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── register ───────────────────────────────────────────────────────────
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(userData);
      if (response.success) {
        return { success: true, data: response.data };
      }
      throw new Error(response.message || "Registration failed");
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── logout ─────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    authAPI.logout();
    setUser(null);
    setToken(null);
    setError(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!token,
    isApproved: user?.accountStatus === "approved",
    isPending: user?.accountStatus === "pending",
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
