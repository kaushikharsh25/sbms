import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { mockLogin, mockMe } from "../services/mockApi.js";


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const API_BASE = import.meta.env.VITE_API_BASE || null;

  useEffect(() => {
    if (!token) return;

    if (API_BASE) {
      const client = axios.create({ baseURL: API_BASE });
      client
        .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setUser(res.data.user))
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
        });
    } else {
      // ✅ fallback to mock
      mockMe(token)
        .then((res) => setUser(res.user))
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
        });
    }
  }, [token]);

  const login = async (email, password) => {
    if (API_BASE) {
      const client = axios.create({ baseURL: API_BASE });
      const { data } = await client.post("/auth/login", { email, password });
      setToken(data.token);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      return data.user;
    } else {
      // ✅ fallback to mock
      const data = await mockLogin(email, password);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      return data.user;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
