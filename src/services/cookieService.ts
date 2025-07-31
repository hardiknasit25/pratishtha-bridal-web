// Cookie Service for managing cookies in the browser

export interface CookieOptions {
  expires?: number; // Days from now
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

class CookieService {
  /**
   * Set a cookie with the given name, value, and options
   */
  set(name: string, value: string, options: CookieOptions = {}): void {
    const {
      expires = 7, // Default 7 days
      path = "/",
      domain,
      secure = false,
      sameSite = "lax",
    } = options;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
      value
    )}`;

    // Add expiration
    if (expires) {
      const date = new Date();
      date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
      cookieString += `; expires=${date.toUTCString()}`;
    }

    // Add path
    cookieString += `; path=${path}`;

    // Add domain if specified
    if (domain) {
      cookieString += `; domain=${domain}`;
    }

    // Add secure flag
    if (secure) {
      cookieString += "; secure";
    }

    // Add sameSite
    cookieString += `; samesite=${sameSite}`;

    document.cookie = cookieString;
  }

  /**
   * Get a cookie value by name
   */
  get(name: string): string | null {
    const nameEQ = encodeURIComponent(name) + "=";
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === " ") {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(
          cookie.substring(nameEQ.length, cookie.length)
        );
      }
    }
    return null;
  }

  /**
   * Delete a cookie by name
   */
  delete(name: string, options: CookieOptions = {}): void {
    this.set(name, "", {
      ...options,
      expires: -1, // Set to past date to delete
    });
  }

  /**
   * Check if a cookie exists
   */
  exists(name: string): boolean {
    return this.get(name) !== null;
  }

  /**
   * Get all cookies as an object
   */
  getAll(): Record<string, string> {
    const cookies: Record<string, string> = {};
    const cookieArray = document.cookie.split(";");

    for (let i = 0; i < cookieArray.length; i++) {
      const cookie = cookieArray[i].trim();
      if (cookie) {
        const [name, value] = cookie.split("=");
        if (name && value) {
          cookies[decodeURIComponent(name)] = decodeURIComponent(value);
        }
      }
    }

    return cookies;
  }

  /**
   * Clear all cookies
   */
  clearAll(): void {
    const cookies = this.getAll();
    Object.keys(cookies).forEach((name) => {
      this.delete(name);
    });
  }

  /**
   * Set authentication token cookie
   */
  setAuthToken(token: string, rememberMe: boolean = false): void {
    const options: CookieOptions = {
      secure: true,
      sameSite: "strict",
      expires: rememberMe ? 30 : 1, // 30 days if remember me, 1 day otherwise
    };
    this.set("authToken", token, options);
  }

  /**
   * Get authentication token
   */
  getAuthToken(): string | null {
    return this.get("authToken");
  }

  /**
   * Remove authentication token
   */
  removeAuthToken(): void {
    this.delete("authToken");
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.exists("authToken");
  }
}

// Export a singleton instance
export const cookieService = new CookieService();

// Export the class for testing or custom instances
export default CookieService;
