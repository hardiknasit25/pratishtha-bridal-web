import React, { createContext, useContext, useState } from "react";
import { authService } from "../services/authService";
import type { User } from "../services/authService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: {
    UserName: string;
    Password: string;
    rememberMe?: boolean;
  }) => Promise<User>;
  signup: (credentials: {
    UserName: string;
    Password: string;
    confirmPassword: string;
  }) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: {
    UserName: string;
    Password: string;
    rememberMe?: boolean;
  }) => {
    try {
      setIsLoading(true);
      const user = await authService.login(credentials);
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (credentials: {
    UserName: string;
    Password: string;
    confirmPassword: string;
  }) => {
    try {
      setIsLoading(true);
      const user = await authService.signup(credentials);
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails, clear local state
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      setIsLoading(true);
      if (authService.isAuthenticated()) {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
