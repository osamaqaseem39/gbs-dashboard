import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from '../types';

// Create axios instance
const baseURL = process.env.REACT_APP_API_URL || 'https://gbs-server.vercel.app/api';
console.log('API Base URL:', baseURL); // Debug log

const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 30000, // 30 seconds - increased for serverless cold starts
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common responses
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          // Use the current token (which might be expired) to refresh
          const currentToken = localStorage.getItem('token');
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL || 'https://gbs-server.vercel.app/api'}/auth/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${currentToken || refreshToken}`,
              },
            }
          );

          if (response.data?.success && response.data?.data) {
            const { token, accessToken } = response.data.data;
            const newToken = accessToken || token;
            
            if (newToken) {
              localStorage.setItem('token', newToken);
              // Update the original request with new token
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              // Retry the original request
              return api(originalRequest);
            }
          }
        } catch (refreshError) {
          // Refresh failed, clear storage and redirect
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('refreshToken');
          // Only redirect if we're not already on login page
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, clear storage and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        // Only redirect if we're not already on login page
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api; 