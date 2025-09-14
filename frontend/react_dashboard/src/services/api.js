// src/services/api.js
import axios from 'axios';

// Create axios instance with your backend base URL
const api = axios.create({
  baseURL: 'http://localhost:5001/api', // ✅ Update if backend runs on a different port/host
});

// --- Interceptor: Attach JWT token automatically ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
