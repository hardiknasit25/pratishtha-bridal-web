import { User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { showToast } from "./Toast";

export const Navigation = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = async () => {
    try {
      // Call the auth service logout
      await authService.logout();

      // Show success message
      showToast.success("Logged Out", "You have been successfully logged out.");

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout API fails, clear local data and redirect
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      navigate("/login");
    }
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center py-4">
          {/* User Menu */}
          <div className="w-full flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User size={16} />
              <span>Welcome, {username || "User"}</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
