import { useState, useEffect } from "react";
import { cookieService } from "../services/cookieService";
import { authService } from "../services/authService";

export const CookieExample = () => {
  const [userPreference, setUserPreference] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [allCookies, setAllCookies] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check authentication status
    setIsAuthenticated(authService.isAuthenticated());
    
    // Get all cookies
    setAllCookies(cookieService.getAll());
    
    // Get user preference
    const savedPreference = cookieService.get("user_preference");
    if (savedPreference) {
      setUserPreference(savedPreference);
    }
  }, []);

  const handleSetPreference = () => {
    if (userPreference.trim()) {
      cookieService.set("user_preference", userPreference, { expires: 30 });
      setAllCookies(cookieService.getAll());
      alert("Preference saved to cookie!");
    }
  };

  const handleClearPreference = () => {
    cookieService.delete("user_preference");
    setUserPreference("");
    setAllCookies(cookieService.getAll());
    alert("Preference cleared!");
  };

  const handleSetAuthToken = () => {
    // Example: Set a mock auth token
    cookieService.setAuthToken("mock-jwt-token-12345", true);
    setIsAuthenticated(true);
    setAllCookies(cookieService.getAll());
    alert("Auth token set!");
  };

  const handleClearAuthToken = () => {
    cookieService.removeAuthToken();
    setIsAuthenticated(false);
    setAllCookies(cookieService.getAll());
    alert("Auth token cleared!");
  };

  const handleClearAllCookies = () => {
    cookieService.clearAll();
    setIsAuthenticated(false);
    setUserPreference("");
    setAllCookies({});
    alert("All cookies cleared!");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Cookie Service Example</h2>
      
      {/* Authentication Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="text-lg font-semibold mb-2">Authentication Status</h3>
        <p className="mb-2">
          Status: <span className={isAuthenticated ? "text-green-600" : "text-red-600"}>
            {isAuthenticated ? "Authenticated" : "Not Authenticated"}
          </span>
        </p>
        <div className="space-x-2">
          <button
            onClick={handleSetAuthToken}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Set Auth Token
          </button>
          <button
            onClick={handleClearAuthToken}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear Auth Token
          </button>
        </div>
      </div>

      {/* User Preference */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="text-lg font-semibold mb-2">User Preference</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={userPreference}
            onChange={(e) => setUserPreference(e.target.value)}
            placeholder="Enter your preference"
            className="flex-1 px-3 py-1 border rounded"
          />
          <button
            onClick={handleSetPreference}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save
          </button>
          <button
            onClick={handleClearPreference}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Clear
          </button>
        </div>
      </div>

      {/* All Cookies */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="text-lg font-semibold mb-2">All Cookies</h3>
        {Object.keys(allCookies).length === 0 ? (
          <p className="text-gray-500">No cookies found</p>
        ) : (
          <div className="space-y-1">
            {Object.entries(allCookies).map(([name, value]) => (
              <div key={name} className="text-sm">
                <span className="font-medium">{name}:</span> {value}
              </div>
            ))}
          </div>
        )}
        <button
          onClick={handleClearAllCookies}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Clear All Cookies
        </button>
      </div>

      {/* Usage Examples */}
      <div className="p-4 bg-blue-50 rounded">
        <h3 className="text-lg font-semibold mb-2">Usage Examples</h3>
        <div className="text-sm space-y-2">
          <p><strong>Set cookie:</strong> <code>cookieService.set("key", "value", {'{'} expires: 7 {'}'})</code></p>
          <p><strong>Get cookie:</strong> <code>cookieService.get("key")</code></p>
          <p><strong>Delete cookie:</strong> <code>cookieService.delete("key")</code></p>
          <p><strong>Set auth token:</strong> <code>cookieService.setAuthToken("token", true)</code></p>
          <p><strong>Check auth:</strong> <code>cookieService.isAuthenticated()</code></p>
        </div>
      </div>
    </div>
  );
}; 