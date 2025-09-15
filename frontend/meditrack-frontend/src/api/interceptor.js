import axios from 'axios';
import { getToken, logout } from './auth';

// Add JWT token to requests
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.warn('JWT token expired or invalid, logging out user');
      logout(); // Use the logout function from auth.js

      // Show user-friendly message before redirect
      if (window.location.pathname !== '/login') {
        alert('Your session has expired. Please login again.');
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      console.warn('Access forbidden - insufficient permissions');
      alert('You do not have permission to perform this action.');
    } else if (error.response?.status >= 500) {
      // Server error
      console.error('Server error:', error.response.data);
      alert('Server error occurred. Please try again later.');
    } else if (!error.response) {
      // Network error
      console.error('Network error:', error.message);
      alert('Network error. Please check your connection and try again.');
    }

    return Promise.reject(error);
  }
);
