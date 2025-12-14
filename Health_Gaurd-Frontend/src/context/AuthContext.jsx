import React from "react"; // 👈 REQUIRED in your setup
import { createContext, useEffect, useState } from "react";
import api from "../api/axios";

// Create context
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on app start
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    // Attach token to axios globally
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res?.data?.user ?? null);
      } catch (err) {
        setUser(null);
        localStorage.removeItem("token");
        delete api.defaults.headers.common.Authorization;
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Login helper
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setUser(userData);
  };

  // Logout helper
  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common.Authorization;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
