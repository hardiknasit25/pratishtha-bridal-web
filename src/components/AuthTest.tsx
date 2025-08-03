import React, { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { showToast } from "./Toast";

const AuthTest: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);

    if (authenticated) {
      getCurrentUser();
    }
  };

  const getCurrentUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error("Failed to get current user:", error);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const user = await authService.login({
        UserName: "testuser",
        Password: "password123",
        rememberMe: false,
      });

      showToast.success("Login Test", `Logged in as ${user.UserName}`);
      checkAuthStatus();
    } catch (error: any) {
      showToast.error("Login Test Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const testSignup = async () => {
    setLoading(true);
    try {
      const user = await authService.signup({
        UserName: `testuser${Date.now()}`,
        Password: "password123",
        confirmPassword: "password123",
      });

      showToast.success("Signup Test", `Created account for ${user.UserName}`);
      checkAuthStatus();
    } catch (error: any) {
      showToast.error("Signup Test Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const testLogout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      showToast.success("Logout Test", "Successfully logged out");
      checkAuthStatus();
    } catch (error: any) {
      showToast.error("Logout Test Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const testTokenValidation = async () => {
    setLoading(true);
    try {
      const user = await authService.validateToken();
      if (user) {
        showToast.success("Token Validation", "Token is valid");
        setCurrentUser(user);
      } else {
        showToast.error("Token Validation", "Token is invalid");
      }
    } catch (error: any) {
      showToast.error("Token Validation Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Authentication Test</h2>

      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Current Status:</h3>
        <p>
          <strong>Authenticated:</strong> {isAuthenticated ? "✅ Yes" : "❌ No"}
        </p>
        <p>
          <strong>Current User:</strong>{" "}
          {currentUser ? currentUser.UserName : "None"}
        </p>
        <p>
          <strong>Token:</strong>{" "}
          {authService.getAuthToken() ? "✅ Present" : "❌ Missing"}
        </p>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={testLogin}
          disabled={loading || isAuthenticated}
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Login
        </button>

        <button
          onClick={testSignup}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Signup
        </button>

        <button
          onClick={testLogout}
          disabled={loading || !isAuthenticated}
          className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Logout
        </button>

        <button
          onClick={testTokenValidation}
          disabled={loading || !isAuthenticated}
          className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Token Validation
        </button>

        <button
          onClick={checkAuthStatus}
          disabled={loading}
          className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          Refresh Status
        </button>
      </div>

      {loading && (
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
          Testing authentication...
        </div>
      )}

      {currentUser && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold mb-2">User Information:</h4>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(currentUser, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AuthTest;
