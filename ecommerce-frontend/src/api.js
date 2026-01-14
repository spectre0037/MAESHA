import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Efficiency: Request Interceptor
 * This runs before every single request. It fetches the latest token 
 * from localStorage, ensuring the user stays logged in without page refreshes.
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Creative Touch: Response Interceptor
 * Automatically handles common errors (like 401 Unauthorized).
 * If the token expires, we can log the user out globally.
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear storage and redirect if token is invalid/expired
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Optional: window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default API;