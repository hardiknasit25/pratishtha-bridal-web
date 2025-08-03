import { cookieService } from "./cookieService";
import api from "./api";
import { API_ENDPOINTS } from "./apiEndpoints";

export interface LoginCredentials {
  UserName: string;
  Password: string;
  rememberMe?: boolean;
}

export interface SignupCredentials {
  UserName: string;
  Password: string;
  confirmPassword: string;
}

export interface ForgotPasswordCredentials {
  UserName: string;
}

export interface ResetPasswordCredentials {
  UserName: string;
  Password: string;
}

export interface User {
  id: string;
  UserName: string;
  name?: string;
  role?: string;
}

class AuthService {
  /**
   * Login user and store authentication token
   */
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      console.log("Attempting login for:", credentials.UserName);

      const response = await api.post(API_ENDPOINTS.LOGIN, {
        UserName: credentials.UserName,
        Password: credentials.Password,
      });

      const { token, user } = response.data;

      // Ensure token exists in response
      if (!token) {
        throw new Error("No authentication token received from server");
      }

      console.log("Login successful, token received");

      // Store auth token in cookie
      cookieService.setAuthToken(token, credentials.rememberMe || false);

      // Also store user info in localStorage for quick access
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", user.UserName);

      return user;
    } catch (error: any) {
      console.error("Login failed:", error);

      // Handle specific error cases
      if (error.response?.status === 401) {
        throw new Error("Invalid username or password");
      } else if (error.response?.status === 404) {
        throw new Error("User not found");
      } else if (error.message === "Network Error") {
        throw new Error("Network error. Please check your connection.");
      } else {
        throw new Error(
          error.response?.data?.message || "Login failed. Please try again."
        );
      }
    }
  }

  /**
   * Sign up new user
   */
  async signup(credentials: SignupCredentials): Promise<User> {
    try {
      console.log("Attempting signup for:", credentials.UserName);

      const response = await api.post(API_ENDPOINTS.SIGNUP, {
        UserName: credentials.UserName,
        Password: credentials.Password,
        confirmPassword: credentials.confirmPassword,
      });

      const { token, user } = response.data;

      // Ensure token exists in response
      if (!token) {
        throw new Error("No authentication token received from server");
      }

      console.log("Signup successful, token received");

      // Store auth token in cookie
      cookieService.setAuthToken(token, false);

      // Also store user info in localStorage for quick access
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", user.UserName);

      return user;
    } catch (error: any) {
      console.error("Signup failed:", error);

      // Handle specific error cases
      if (error.response?.status === 409) {
        throw new Error("Username already exists");
      } else if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || "Invalid signup data");
      } else if (error.message === "Network Error") {
        throw new Error("Network error. Please check your connection.");
      } else {
        throw new Error(
          error.response?.data?.message || "Signup failed. Please try again."
        );
      }
    }
  }

  /**
   * Forgot password - verify username
   */
  async forgotPassword(credentials: ForgotPasswordCredentials): Promise<void> {
    try {
      console.log("Attempting forgot password for:", credentials.UserName);

      await api.post(API_ENDPOINTS.FORGOT_PASSWORD, {
        UserName: credentials.UserName,
      });

      console.log("Forgot password request successful");
    } catch (error: any) {
      console.error("Forgot password failed:", error);

      // Handle specific error cases
      if (error.response?.status === 404) {
        throw new Error("Username not found");
      } else if (error.message === "Network Error") {
        throw new Error("Network error. Please check your connection.");
      } else {
        throw new Error(
          error.response?.data?.message ||
            "Forgot password request failed. Please try again."
        );
      }
    }
  }

  /**
   * Reset password
   */
  async resetPassword(credentials: ResetPasswordCredentials): Promise<void> {
    try {
      console.log("Attempting password reset for:", credentials.UserName);

      await api.put(API_ENDPOINTS.RESET_PASSWORD, {
        UserName: credentials.UserName,
        Password: credentials.Password,
      });

      console.log("Password reset successful");
    } catch (error: any) {
      console.error("Password reset failed:", error);

      // Handle specific error cases
      if (error.response?.status === 400) {
        throw new Error(
          error.response?.data?.message || "Invalid password data"
        );
      } else if (error.response?.status === 404) {
        throw new Error("User not found");
      } else if (error.message === "Network Error") {
        throw new Error("Network error. Please check your connection.");
      } else {
        throw new Error(
          error.response?.data?.message ||
            "Password reset failed. Please try again."
        );
      }
    }
  }

  /**
   * Logout user and clear authentication
   */
  async logout(): Promise<void> {
    try {
      console.log("Attempting logout");

      // Call logout endpoint if available
      await api.post(API_ENDPOINTS.LOGOUT);

      console.log("Logout API call successful");
    } catch (error) {
      console.error("Logout API call failed:", error);
      // Don't throw error here as we still want to clear local data
    } finally {
      // Always clear local auth token and localStorage
      cookieService.removeAuthToken();
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      console.log("Local authentication data cleared");
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const hasToken = cookieService.isAuthenticated();
    const hasLocalStorage = localStorage.getItem("isLoggedIn") === "true";

    // If token exists but localStorage doesn't, update localStorage
    if (hasToken && !hasLocalStorage) {
      localStorage.setItem("isLoggedIn", "true");
      return true;
    }

    // If localStorage exists but token doesn't, clear localStorage and return false
    if (!hasToken && hasLocalStorage) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      return false;
    }

    return hasToken && hasLocalStorage;
  }

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<User | null> {
    if (!this.isAuthenticated()) {
      return null;
    }

    try {
      console.log("Fetching current user info");

      const response = await api.get(API_ENDPOINTS.GET_USER_PROFILE);
      return response.data;
    } catch (error: any) {
      console.error("Failed to get current user:", error);

      // If getting user info fails, clear auth token
      if (error.response?.status === 401) {
        console.log("Token expired, clearing authentication");
        this.logout();
      }
      return null;
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<string | null> {
    try {
      console.log("Attempting token refresh");

      const response = await api.post(API_ENDPOINTS.REFRESH_TOKEN);
      const { token } = response.data;

      // Update stored token
      cookieService.setAuthToken(token);

      console.log("Token refresh successful");
      return token;
    } catch (error: any) {
      console.error("Token refresh failed:", error);

      // If refresh fails, logout user
      if (error.response?.status === 401) {
        console.log("Token refresh failed, logging out user");
        this.logout();
      }
      return null;
    }
  }

  /**
   * Get stored auth token
   */
  getAuthToken(): string | null {
    return cookieService.getAuthToken();
  }

  /**
   * Validate token and return user info
   */
  async validateToken(): Promise<User | null> {
    const token = this.getAuthToken();
    if (!token) {
      return null;
    }

    try {
      console.log("Validating token");

      const response = await api.get(API_ENDPOINTS.VERIFY_TOKEN);
      return response.data;
    } catch (error: any) {
      console.error("Token validation failed:", error);

      // If validation fails, logout user
      if (error.response?.status === 401) {
        console.log("Token validation failed, logging out user");
        this.logout();
      }
      return null;
    }
  }

  /**
   * Set custom cookie for user preferences
   */
  setUserPreference(key: string, value: string): void {
    cookieService.set(`user_pref_${key}`, value, { expires: 365 }); // 1 year
  }

  /**
   * Get user preference from cookie
   */
  getUserPreference(key: string): string | null {
    return cookieService.get(`user_pref_${key}`);
  }

  /**
   * Clear all user preferences
   */
  clearUserPreferences(): void {
    const allCookies = cookieService.getAll();
    Object.keys(allCookies).forEach((name) => {
      if (name.startsWith("user_pref_")) {
        cookieService.delete(name);
      }
    });
  }
}

// Export a singleton instance
export const authService = new AuthService();

// Export the class for testing or custom instances
export default AuthService;
