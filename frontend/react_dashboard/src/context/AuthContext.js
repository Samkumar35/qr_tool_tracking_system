// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Restore user from token on page reload
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Check expiration
        if (decoded.exp * 1000 < Date.now()) {
          console.warn('Token expired, logging out...');
          localStorage.removeItem('token');
          setUser(null);
        } else {
          setUser(decoded.user || decoded); // fallback if backend doesn't nest under "user"
        }
      } catch (err) {
        console.error('Invalid token:', err);
        localStorage.removeItem('token');
      }
    }
  }, []);

  // ✅ Login
  const login = async (employee_id, password) => {
    const response = await api.post('/auth/login', { employee_id, password });
    const { token } = response.data;

    localStorage.setItem('token', token);

    const decoded = jwtDecode(token);
    setUser(decoded.user || decoded);

    return response;
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
