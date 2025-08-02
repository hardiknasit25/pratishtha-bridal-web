import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(""); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }

    if (!formData.newPassword) {
      setError("New password is required");
      return false;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return false;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, simulate successful password reset
      // In real app, this would call authService.resetPassword()

      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Password reset failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Password Reset Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your password has been successfully updated. You will be
              redirected to the login page shortly.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500"></div>
              <span className="text-sm text-gray-500">Redirecting...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Velleta Heritage
          </h1>
          <p className="text-gray-600">Reset your password to regain access.</p>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-gray-700"
              >
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className="h-12 px-4 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                disabled={loading}
              />
            </div>

            {/* New Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="newPassword"
                className="text-sm font-medium text-gray-700"
              >
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter your new password"
                  className="h-12 px-4 pr-12 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmNewPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type={showConfirmNewPassword ? "text" : "password"}
                  value={formData.confirmNewPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your new password"
                  className="h-12 px-4 pr-12 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmNewPassword(!showConfirmNewPassword)
                  }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showConfirmNewPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Resetting password...</span>
                </div>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-3 text-center">
            <Link
              to="/login"
              className="block text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors"
            >
              Back to Sign In
            </Link>
            <div className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-pink-600 hover:text-pink-700 font-medium transition-colors"
              >
                Sign up here
              </Link>
            </div>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-800 font-medium mb-2">
            Password Requirements:
          </p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• At least 6 characters long</li>
            <li>• Passwords must match</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
