import axios from "axios";
import { cookieService } from "./cookieService";

const API_BASE_URL = "https://pratishtha-bridal-backend.vercel.app/api";
// const API_BASE_URL = "http://localhost:3000/api";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Add these for better CORS handling
  timeout: 15000,
  withCredentials: true, // Enable cookies to be sent with requests
});

// COMMENTED OUT: Request interceptor for testing
/*
// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token to headers if available
    const token = cookieService.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    // Don't let request errors crash the app
    return Promise.reject(error);
  }
);
*/

// COMMENTED OUT: Response interceptor for testing
/*
// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.error("API Error Details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: error.config,
    });

    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear auth token on unauthorized
      cookieService.removeAuthToken();
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      console.log("Authentication failed, cleared auth token");
      
      // Only redirect to login if not already on login page and not on signup/forgot password pages
      const currentPath = window.location.pathname;
      const publicPages = ["/login", "/signup", "/forgot-password"];
      if (!publicPages.includes(currentPath)) {
        window.location.href = "/login";
      }
    }

    // Always return a proper error object to prevent crashes
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      const errorMessage = data?.message || `Server Error (${status})`;
      const customError = new Error(errorMessage);
      customError.name = "APIError";
      return Promise.reject(customError);
    } else if (error.request) {
      // Network error
      const networkError = new Error(
        "Network Error - Please check your connection"
      );
      networkError.name = "NetworkError";
      return Promise.reject(networkError);
    } else {
      // Other error
      const otherError = new Error(error.message || "Unknown Error");
      otherError.name = "UnknownError";
      return Promise.reject(otherError);
    }
  }
);
*/

export default api;
