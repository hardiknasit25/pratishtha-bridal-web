import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { BottomNavigation } from "./components/BottomNavigation";
import { InstallPWA } from "./components/InstallPWA";
import { OrdersPage } from "./pages/OrdersPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductFormPage } from "./pages/ProductFormPage";
import { OrderFormPage } from "./pages/OrderFormPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
// import { ProtectedRoute } from "./components/ProtectedRoute";
import { ToastContainer } from "./components/Toast";
// import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      {/* <AuthProvider> */}
      <Router>
        <ToastContainer />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Routes - Temporarily unprotected */}
          <Route
            path="/products"
            element={
              // <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <Navigation />
                <ProductsPage />
                <BottomNavigation />
                <InstallPWA />
              </div>
              // </ProtectedRoute>
            }
          />
          <Route
            path="/products/add"
            element={
              // <ProtectedRoute>
              <ProductFormPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/products/edit/:productId"
            element={
              // <ProtectedRoute>
              <ProductFormPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              // <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <Navigation />
                <OrdersPage />
                <BottomNavigation />
                <InstallPWA />
              </div>
              // </ProtectedRoute>
            }
          />
          <Route
            path="/orders/add"
            element={
              // <ProtectedRoute>
              <OrderFormPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/orders/edit/:orderId"
            element={
              // <ProtectedRoute>
              <OrderFormPage />
              // </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </Router>
      {/* </AuthProvider> */}
    </ErrorBoundary>
  );
}

export default App;
