import { cookieService } from "./cookieService";
import api from "./api";

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupCredentials {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordCredentials {
  username: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

class AuthService {
  /**
   * Login user and store authentication token
   */
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await api.post("/auth/login", credentials);
      const { token, user } = response.data;

      // Store auth token in cookie
      cookieService.setAuthToken(token, credentials.rememberMe || false);

      return user;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  /**
   * Sign up new user
   */
  async signup(credentials: SignupCredentials): Promise<User> {
    try {
      const response = await api.post("/auth/signup", credentials);
      const { token, user } = response.data;

      // Store auth token in cookie
      cookieService.setAuthToken(token, false);

      return user;
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  }

  /**
   * Reset password
   */
  async resetPassword(credentials: ResetPasswordCredentials): Promise<void> {
    try {
      await api.post("/auth/reset-password", credentials);
    } catch (error) {
      console.error("Password reset failed:", error);
      throw error;
    }
  }

  /**
   * Logout user and clear authentication
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if available
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Always clear local auth token
      cookieService.removeAuthToken();
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return cookieService.isAuthenticated();
  }

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<User | null> {
    if (!this.isAuthenticated()) {
      return null;
    }

    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Failed to get current user:", error);
      // If getting user info fails, clear auth token
      cookieService.removeAuthToken();
      return null;
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<string | null> {
    try {
      const response = await api.post("/auth/refresh");
      const { token } = response.data;

      // Update stored token
      cookieService.setAuthToken(token);

      return token;
    } catch (error) {
      console.error("Token refresh failed:", error);
      cookieService.removeAuthToken();
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
