import { useState, useEffect } from "react";
import {
  setJWTToken,
  checkTokenStatus,
  clearJWTToken,
} from "../services/setToken";
import { cookieService } from "../services/cookieService";

export const TokenManager = () => {
  const [tokenStatus, setTokenStatus] = useState<{
    token: string | null;
    isAuthenticated: boolean;
  }>({
    token: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check initial token status
    const status = checkTokenStatus();
    setTokenStatus(status);
  }, []);

  const handleSetToken = () => {
    const success = setJWTToken();
    if (success) {
      const status = checkTokenStatus();
      setTokenStatus(status);
      alert("✅ JWT Token set successfully!");
    } else {
      alert("❌ Failed to set JWT Token");
    }
  };

  const handleClearToken = () => {
    const success = clearJWTToken();
    if (success) {
      setTokenStatus({ token: null, isAuthenticated: false });
      alert("✅ JWT Token cleared successfully!");
    } else {
      alert("❌ Failed to clear JWT Token");
    }
  };

  const handleCheckStatus = () => {
    const status = checkTokenStatus();
    setTokenStatus(status);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border">
      <h3 className="text-lg font-semibold mb-4">JWT Token Manager</h3>

      <div className="space-y-4">
        {/* Token Status */}
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-sm font-medium">Token Status:</p>
          <p
            className={`text-sm ${
              tokenStatus.isAuthenticated ? "text-green-600" : "text-red-600"
            }`}
          >
            {tokenStatus.isAuthenticated
              ? "✅ Authenticated"
              : "❌ Not Authenticated"}
          </p>
          {tokenStatus.token && (
            <p className="text-xs text-gray-600 mt-1">
              Token: {tokenStatus.token.substring(0, 30)}...
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleSetToken}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Set JWT Token
          </button>
          <button
            onClick={handleClearToken}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Clear Token
          </button>
          <button
            onClick={handleCheckStatus}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
          >
            Check Status
          </button>
        </div>

        {/* All Cookies Display */}
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-sm font-medium mb-2">All Cookies:</p>
          <div className="text-xs space-y-1">
            {Object.entries(cookieService.getAll()).map(([name, value]) => (
              <div key={name} className="flex justify-between">
                <span className="font-medium">{name}:</span>
                <span className="text-gray-600">
                  {value.substring(0, 20)}...
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
