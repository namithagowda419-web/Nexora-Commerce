import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Add a request interceptor to attach JWT token to every outgoing request
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('nexora_user');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      if (parsed?.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
