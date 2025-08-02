import { cookieService } from "./cookieService";
// import api from "./api";
// import { API_ENDPOINTS } from "./apiEndpoints";

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
      // TEMPORARY: Hardcoded credentials for testing
      if (
        credentials.UserName === "admin" &&
        credentials.Password === "password"
      ) {
        const mockUser: User = {
          id: "1",
          UserName: "admin",
          name: "Administrator",
          role: "admin",
        };

        const mockToken = "mock-jwt-token-for-testing";

        // Store auth token in cookie
        cookieService.setAuthToken(mockToken, credentials.rememberMe || false);

        // Also store user info in localStorage for quick access
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", mockUser.UserName);

        return mockUser;
      } else {
        throw new Error(
          "Invalid credentials. Use username: admin, password: password"
        );
      }

      // COMMENTED OUT: Original API call
      /*
      const response = await api.post(API_ENDPOINTS.LOGIN, {
        UserName: credentials.UserName,
        Password: credentials.Password,
      });
      
      const { token, user } = response.data;

      // Ensure token exists in response
      if (!token) {
        throw new Error("No authentication token received from server");
      }

      // Store auth token in cookie
      cookieService.setAuthToken(token, credentials.rememberMe || false);

      // Also store user info in localStorage for quick access
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", user.UserName);

      return user;
      */
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
      // TEMPORARY: Mock signup for testing
      const mockUser: User = {
        id: "1",
        UserName: credentials.UserName,
        name: credentials.UserName,
        role: "user",
      };

      const mockToken = "mock-jwt-token-for-testing";

      // Store auth token in cookie
      cookieService.setAuthToken(mockToken, false);

      // Also store user info in localStorage for quick access
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", mockUser.UserName);

      return mockUser;

      // COMMENTED OUT: Original API call
      /*
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

      // Store auth token in cookie
      cookieService.setAuthToken(token, false);

      // Also store user info in localStorage for quick access
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", user.UserName);

      return user;
      */
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  }

  /**
   * Forgot password - verify username
   */
  async forgotPassword(credentials: ForgotPasswordCredentials): Promise<void> {
    try {
      // TEMPORARY: Mock forgot password for testing
      console.log("Mock forgot password for:", credentials.UserName);
      return;

      // COMMENTED OUT: Original API call
      /*
      await api.post(API_ENDPOINTS.FORGOT_PASSWORD, {
        UserName: credentials.UserName,
      });
      */
    } catch (error) {
      console.error("Forgot password failed:", error);
      throw error;
    }
  }

  /**
   * Reset password
   */
  async resetPassword(credentials: ResetPasswordCredentials): Promise<void> {
    try {
      // TEMPORARY: Mock reset password for testing
      console.log("Mock reset password for:", credentials.UserName);
      return;

      // COMMENTED OUT: Original API call
      /*
      await api.put(API_ENDPOINTS.RESET_PASSWORD, {
        UserName: credentials.UserName,
        Password: credentials.Password,
      });
      */
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
      // TEMPORARY: Mock logout for testing
      console.log("Mock logout");

      // COMMENTED OUT: Original API call
      /*
      // Call logout endpoint if available
      await api.post(API_ENDPOINTS.LOGOUT);
      */
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Always clear local auth token and localStorage
      cookieService.removeAuthToken();
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
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
      // TEMPORARY: Mock user for testing
      const mockUser: User = {
        id: "1",
        UserName: "admin",
        name: "Administrator",
        role: "admin",
      };
      return mockUser;

      // COMMENTED OUT: Original API call
      /*
      const response = await api.get(API_ENDPOINTS.GET_USER_PROFILE);
      return response.data;
      */
    } catch (error) {
      console.error("Failed to get current user:", error);
      // If getting user info fails, clear auth token
      this.logout();
      return null;
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<string | null> {
    try {
      // TEMPORARY: Mock token refresh for testing
      const mockToken = "mock-jwt-token-for-testing";
      cookieService.setAuthToken(mockToken);
      return mockToken;

      // COMMENTED OUT: Original API call
      /*
      const response = await api.post(API_ENDPOINTS.REFRESH_TOKEN);
      const { token } = response.data;

      // Update stored token
      cookieService.setAuthToken(token);

      return token;
      */
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.logout();
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
      const user = await this.getCurrentUser();
      return user;
    } catch (error) {
      console.error("Token validation failed:", error);
      this.logout();
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
