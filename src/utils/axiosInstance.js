// ============================================================
// AXIOS INSTANCE - Unified HTTP Client
// BACKEND NOTE: Set BASE_URL in constants.js before connecting
// ============================================================

import axios from 'axios';
import { BASE_URL } from './constants';
import { getToken, clearAuthData } from './localStorage';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ====== REQUEST INTERCEPTOR ======
// Automatically injects JWT token into every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      // BACKEND NOTE: Change to `token` (without "Bearer") if your backend expects raw token
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ====== RESPONSE INTERCEPTOR ======
// Handles auth errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // 401 Unauthorized — token expired or missing
      if (status === 401) {
        clearAuthData();
        window.location.href = '/login';
      }

      // 403 Forbidden — insufficient permissions
      if (status === 403) {
        window.location.href = '/unauthorized';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
