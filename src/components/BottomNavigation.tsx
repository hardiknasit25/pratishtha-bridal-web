import { Link, useLocation } from "react-router-dom";
import { Package, FileText } from "lucide-react";

export const BottomNavigation = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-full shadow-lg border border-gray-200 p-1">
        <div className="flex items-center space-x-1">
          <Link
            to="/products"
            className={`relative px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ease-in-out ${
              location.pathname === "/products"
                ? "text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {location.pathname === "/products" && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"></div>
            )}
            <div className="relative flex items-center space-x-2">
              <Package size={18} />
              <span>Products</span>
            </div>
          </Link>

          <Link
            to="/orders"
            className={`relative px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ease-in-out ${
              location.pathname === "/orders"
                ? "text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {location.pathname === "/orders" && (
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full animate-pulse"></div>
            )}
            <div className="relative flex items-center space-x-2">
              <FileText size={18} />
              <span>Orders</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
