import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Eye, EyeOff, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../components/Toast";
import { authService } from "../services/authService";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schemas/validationSchemas";

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"forgot" | "reset">("forgot");
  const [formData, setFormData] = useState({
    UserName: "",
    Password: "",
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data
      const validatedData = forgotPasswordSchema.parse({
        UserName: formData.UserName,
      });

      setLoading(true);
      setError("");

      // Call the auth service
      await authService.forgotPassword(validatedData);

      // Show success message and move to reset step
      showToast.success(
        "Username Verified",
        "Username found. Please enter your new password."
      );

      setStep("reset");
    } catch (err: any) {
      console.error("Forgot password error:", err);

      // Handle validation errors
      if (err.errors) {
        const validationError = err.errors[0]?.message || "Validation failed";
        setError(validationError);
        showToast.error("Validation Error", validationError);
        return;
      }

      // Handle API errors
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

    try {
      // Validate form data
      const validatedData = resetPasswordSchema.parse({
        UserName: formData.UserName,
        Password: formData.Password,
      });

      setLoading(true);
      setError("");

      // Call the auth service
      await authService.resetPassword(validatedData);

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

      // Handle validation errors
      if (err.errors) {
        const validationError = err.errors[0]?.message || "Validation failed";
        setError(validationError);
        showToast.error("Validation Error", validationError);
        return;
      }

      // Handle API errors
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
    setFormData({ UserName: formData.UserName, Password: "" });
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
                htmlFor="UserName"
                className="text-sm font-medium text-gray-700"
              >
                Username
              </Label>
              <Input
                id="UserName"
                name="UserName"
                type="text"
                value={formData.UserName}
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
                  htmlFor="Password"
                  className="text-sm font-medium text-gray-700"
                >
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="Password"
                    name="Password"
                    type={showPassword ? "text" : "password"}
                    value={formData.Password}
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
              <li>• Maximum 100 characters</li>
              <li>• At least one lowercase letter</li>
              <li>• At least one uppercase letter</li>
              <li>• At least one number</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
