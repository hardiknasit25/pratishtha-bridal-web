import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../components/Toast";
// import { userLoginSchema } from "../schemas/validationSchemas";
// import { useAuth } from "../contexts/AuthContext";

// interface ValidationError {
//   errors: Array<{ message: string }>;
// }

export const LoginPage = () => {
  const navigate = useNavigate();
  // const { login } = useAuth();
  const [formData, setFormData] = useState({
    UserName: "",
    Password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // TEMPORARY: Skip validation and auth for testing
      setLoading(true);
      setError("");

      // Show success message
      showToast.success(
        "Login Successful",
        `Welcome back, ${formData.UserName}!`
      );

      // Redirect to products page
      navigate("/products");

      // COMMENTED OUT: Original authentication code
      /*
      // Validate form data
      const validatedData = userLoginSchema.parse(formData);

      // Call the auth context login
      const user = await login(validatedData);

      // Show success message
      showToast.success("Login Successful", `Welcome back, ${user.UserName}!`);

      // Redirect to products page
      navigate("/products");
      */
    } catch (err: unknown) {
      console.error("Login error:", err);

      // Handle validation errors
      if (err && typeof err === "object" && "errors" in err) {
        const validationError =
          (err as any).errors[0]?.message || "Validation failed";
        setError(validationError);
        showToast.error("Validation Error", validationError);
        return;
      }

      // Handle API errors
      const errorMessage =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(errorMessage);
      showToast.error("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Velleta Heritage
          </h1>
          <p className="text-gray-600">
            Welcome back! Please sign in to your account.
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="Password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="Password"
                  name="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.Password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
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
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-3 text-center">
            <Link
              to="/forgot-password"
              className="block text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors"
            >
              Forgot your password?
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
      </div>
    </div>
  );
};
