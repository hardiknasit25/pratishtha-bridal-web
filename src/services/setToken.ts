import { cookieService } from "./cookieService";

// Function to set the JWT token in cookie
export const setJWTToken = () => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODhiYmVjZDBlYThlNmRjZjFmNzg0ZGIiLCJVc2VyTmFtZSI6InRlc3R1c2VyMTIzIiwiaWF0IjoxNzUzOTg4ODEzLCJleHAiOjE3NTQ1OTM2MTN9.54q43801A15T_fz-C_m0kRtByAT1ZZbwXpxdkLTQWZs";

  try {
    // Set the token in cookie with secure options
    cookieService.setAuthToken(token, true); // true for remember me (30 days)

    console.log("✅ JWT Token set successfully in cookie");
    console.log("Token stored as 'authToken' cookie");

    // Verify the token was set
    const storedToken = cookieService.getAuthToken();
    if (storedToken) {
      console.log("✅ Token verification successful");
      console.log("Authentication status:", cookieService.isAuthenticated());
    } else {
      console.log("❌ Token verification failed");
    }

    return true;
  } catch (error) {
    console.error("❌ Error setting JWT token:", error);
    return false;
  }
};

// Function to check if token is set
export const checkTokenStatus = () => {
  const token = cookieService.getAuthToken();
  const isAuth = cookieService.isAuthenticated();

  console.log("🔍 Token Status Check:");
  console.log("Token exists:", !!token);
  console.log("Is authenticated:", isAuth);

  if (token) {
    console.log("Token preview:", token.substring(0, 50) + "...");
  }

  return { token, isAuthenticated: isAuth };
};

// Function to clear the token
export const clearJWTToken = () => {
  try {
    cookieService.removeAuthToken();
    console.log("✅ JWT Token cleared successfully");
    return true;
  } catch (error) {
    console.error("❌ Error clearing JWT token:", error);
    return false;
  }
};
