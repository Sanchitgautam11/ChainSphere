import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the app and provides auth state + actions to all children.
 * Persists token and user to localStorage for page refreshes.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("nexus_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("nexus_token") || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = Boolean(token && user);

  // ── Persist to localStorage whenever token/user changes ──
  useEffect(() => {
    if (token) localStorage.setItem("nexus_token", token);
    else localStorage.removeItem("nexus_token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("nexus_user", JSON.stringify(user));
    else localStorage.removeItem("nexus_user");
  }, [user]);

  /**
   * Register a new account.
   */
  const register = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        email: data.email,
        password: data.password,
        company: data.company,
      };
      const resData = await authService.register(payload);
      setToken(resData.token);
      setUser(resData.user);
      return resData;
    } catch (err) {
      let message = err.response?.data?.message || "Registration failed. Please try again.";
      if (err.response?.data?.errors?.length > 0) {
        message = err.response.data.errors.map(e => e.message).join(" ");
      }
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Log in with email + password.
   */
  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login({ email, password });
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      let message = err.response?.data?.message || "Invalid email or password.";
      if (err.response?.data?.errors?.length > 0) {
        message = err.response.data.errors.map(e => e.message).join(" ");
      }
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Log out — clear all auth state.
   */
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  /**
   * Clear any existing error (e.g. when user starts typing again).
   */
  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, loading, error, register, login, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context.
 * Throws if used outside <AuthProvider>.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return context;
}
