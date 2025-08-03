import axios from "axios";

const API_BASE_URL = "https://pratishtha-bridal-backend.vercel.app/api";
// const API_BASE_URL = "https://pratishtha-backend.vercel.app/api";
// const API_BASE_URL = "http://localhost:3000/api";

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any authentication headers here if needed
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request for debugging
    console.log(
      `Making ${config.method?.toUpperCase()} request to:`,
      config.url
    );

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(
      `✅ ${response.config.method?.toUpperCase()} ${
        response.config.url
      } - Success`
    );
    return response;
  },
  async (error) => {
    console.error("❌ API Error:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
    });

    // Handle CORS errors specifically
    if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
      const corsError = new Error(
        "CORS Error - Unable to connect to the server. Please check your internet connection or try again later."
      );
      corsError.name = "CORSError";
      return Promise.reject(corsError);
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      console.log("Authentication failed, cleared auth token");

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

export default api;
