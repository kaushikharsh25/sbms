import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  useEffect(() => {
    if (!token) return
    const client = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000/api' })
    client.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUser(res.data.user))
      .catch(() => { setUser(null); setToken(null); localStorage.removeItem('token') })
  }, [token])

  const login = async (email, password) => {
    const client = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000/api' })
    const { data } = await client.post('/auth/login', { email, password })
    setToken(data.token)
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data.user;
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  const value = useMemo(() => ({ user, token, login, logout }), [user, token])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}


