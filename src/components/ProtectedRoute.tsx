import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        setIsValidating(true);
        
        // Simple check if token exists in cookie
        const hasToken = authService.isAuthenticated();
        
        if (!hasToken) {
          setIsAuthenticated(false);
          setIsValidating(false);
          return;
        }

        // If token exists, validate it
        try {
          const user = await authService.getCurrentUser();
          if (user) {
            setIsAuthenticated(true);
          } else {
            // Token is invalid, logout
            await authService.logout();
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          // If validation fails, logout and redirect to login
          await authService.logout();
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        // If any error occurs, assume not authenticated
        setIsAuthenticated(false);
      } finally {
        setIsValidating(false);
      }
    };

    checkAuthentication();
  }, []);

  // Show loading while checking authentication
  if (isValidating || isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};
