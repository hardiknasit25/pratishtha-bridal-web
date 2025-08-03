import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Eye, EyeOff, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../components/Toast";
import { authService } from "../services/authService";

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"forgot" | "reset">("forgot");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(""); // Clear error when user starts typing
  };

  const validateForgotPassword = () => {
    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }
    return true;
  };

  const validateResetPassword = () => {
    if (!formData.password.trim()) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForgotPassword()) return;

    try {
      setLoading(true);
      setError("");

      // Use auth service to verify username
      await authService.forgotPassword({
        UserName: formData.username,
      });

      // Show success message and move to reset step
      showToast.success(
        "Username Verified",
        "Username found. Please enter your new password."
      );

      setStep("reset");
    } catch (err: any) {
      console.error("Forgot password error:", err);
      const errorMessage =
        err.message || "Username verification failed. Please try again.";
      setError(errorMessage);
      showToast.error("Verification Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateResetPassword()) return;

    try {
      setLoading(true);
      setError("");

      // Use auth service to reset password
      await authService.resetPassword({
        UserName: formData.username,
        Password: formData.password,
      });

      // Show success message
      showToast.success(
        "Password Reset Successful",
        "Your password has been updated successfully."
      );

      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Reset password error:", err);
      const errorMessage =
        err.message || "Password reset failed. Please try again.";
      setError(errorMessage);
      showToast.error("Reset Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForgot = () => {
    setStep("forgot");
    setFormData({ username: formData.username, password: "" });
    setError("");
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
          <p className="text-gray-600">
            {step === "forgot"
              ? "Enter your username to reset your password."
              : "Enter your new password to complete the reset."}
          </p>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {step === "reset" && (
            <button
              onClick={handleBackToForgot}
              className="flex items-center text-sm text-pink-600 hover:text-pink-700 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to username verification
            </button>
          )}

          <form
            onSubmit={
              step === "forgot" ? handleForgotPassword : handleResetPassword
            }
            className="space-y-6"
          >
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
                disabled={loading || step === "reset"}
              />
            </div>

            {/* New Password Field - Only show in reset step */}
            {step === "reset" && (
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your new password"
                    className="h-12 px-4 pr-12 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}

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
                  <span>
                    {step === "forgot"
                      ? "Verifying..."
                      : "Resetting password..."}
                  </span>
                </div>
              ) : step === "forgot" ? (
                "Verify Username"
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

        {/* Password Requirements - Only show in reset step */}
        {step === "reset" && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-800 font-medium mb-2">
              Password Requirements:
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• At least 6 characters long</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
