import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("posgrestore-auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired or invalid
      localStorage.removeItem("posgrestore-auth-token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

