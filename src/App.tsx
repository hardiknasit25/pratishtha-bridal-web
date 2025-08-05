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
import { ToastContainer } from "./components/Toast";
import { ErrorBoundary } from "./components/ErrorBoundary";
import PDFTest from "./components/PDFTest";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ToastContainer />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Main Routes */}
          <Route
            path="/products"
            element={
              <div className="min-h-screen bg-gray-50">
                <Navigation />
                <ProductsPage />
                <BottomNavigation />
                <InstallPWA />
              </div>
            }
          />
          <Route path="/products/add" element={<ProductFormPage />} />
          <Route
            path="/products/edit/:productId"
            element={<ProductFormPage />}
          />
          <Route
            path="/orders"
            element={
              <div className="min-h-screen bg-gray-50">
                <Navigation />
                <OrdersPage />
                <BottomNavigation />
                <InstallPWA />
              </div>
            }
          />
          <Route path="/orders/add" element={<OrderFormPage />} />
          <Route path="/orders/edit/:orderId" element={<OrderFormPage />} />

          {/* PDF Test Route - Remove after testing */}
          <Route path="/pdf-test" element={<PDFTest />} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
