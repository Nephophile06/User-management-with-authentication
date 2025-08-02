import axios from 'axios';

// Base URL for our API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available (for authentication)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle authentication errors (redirect to login if token is invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API functions
export const authAPI = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }
};

// User management API functions
export const usersAPI = {
  // Get all users
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Block users
  blockUsers: async (userIds) => {
    const response = await api.patch('/users/block', { userIds });
    return response.data;
  },

  // Unblock users
  unblockUsers: async (userIds) => {
    const response = await api.patch('/users/unblock', { userIds });
    return response.data;
  },

  // Delete users
  deleteUsers: async (userIds) => {
    const response = await api.delete('/users/delete', { data: { userIds } });
    return response.data;
  }
};

export default api; 