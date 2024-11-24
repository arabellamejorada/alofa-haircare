import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/shared/Layout";
import Dashboard from "./components/dashboard/Dashboard";
import Products from "./components/products_tab/Products";
import Inventory from "./components/inventory_tab/Inventory";
import Employees from "./components/employee_tab/Employees";
import Suppliers from "./components/supplier_tab/Suppliers";
import ProductCategories from "./components/products_tab/ProductCategories";
import StockIn from "./components/inventory_tab/stock_in/StockIn";
import StockInHistory from "./components/inventory_tab/stock_in/StockInHistory";
import StockOut from "./components/inventory_tab/stock_out/StockOut";
import StockOutHistory from "./components/inventory_tab/stock_out/StockOutHistory";
import Login from "./components/Login";
import Vouchers from "./components/voucher_tab/Vouchers";
import Faqs from "./components/Faqs";
import OrderVerification from "./components/orders_tab/OrderVerification";
import Shipping from "./components/shipping_tab/Shipping";
import Refund from "./components/refunds_tab/Refunds";
import Orders from "./components/all_orders_tab/Orders";
import ForgotPassword from "./components/ForgotPassword";
import PasswordReset from "./components/PasswordReset";

import { AuthProvider, AuthContext } from "./components/AuthContext";

// Function to check access
const hasAccess = (role, requiredRole) => {
  if (requiredRole === "admin") return role === "admin";
  if (requiredRole === "employee") return ["admin", "employee"].includes(role);
  return true;
};

// ProtectedRoute Component
const ProtectedRoute = ({ element, requiredRole }) => {
  const { token, role } = useContext(AuthContext);

  if (!token) return <Navigate to="/login" replace />;
  if (!hasAccess(role, requiredRole))
    return <Navigate to="/not-authorized" replace />;

  return element;
};

// Not Authorized Page
const NotAuthorized = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h1>Not Authorized</h1>
    <p>You do not have permission to view this page.</p>
    <Link to="/" className="text-alofa-dark">
      Go back to Dashboard
    </Link>
  </div>
);

// 404 Page
const NotFound = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h1>404</h1>
    <p>Page not found.</p>
    <Link to="/" className="text-alofa-dark">
      Go back to Dashboard
    </Link>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster richColors position="top-right" />
        <Routes>
          {/* Main Layout with Protected Routes */}
          <Route path="/" element={<ProtectedRoute element={<Layout />} />}>
            <Route index element={<ProtectedRoute element={<Dashboard />} />} />
            <Route
              path="products"
              element={<ProtectedRoute element={<Products />} />}
            />
            <Route
              path="productcategories"
              element={<ProtectedRoute element={<ProductCategories />} />}
            />
            <Route
              path="voucher"
              element={
                <ProtectedRoute element={<Vouchers />} requiredRole="admin" />
              }
            />
            <Route
              path="faqs"
              element={
                <ProtectedRoute element={<Faqs />} requiredRole="admin" />
              }
            />
            <Route
              path="inventory"
              element={<ProtectedRoute element={<Inventory />} />}
            />
            <Route
              path="stockin"
              element={<ProtectedRoute element={<StockIn />} />}
            />
            <Route
              path="stockinhistory"
              element={<ProtectedRoute element={<StockInHistory />} />}
            />
            <Route
              path="stockout"
              element={<ProtectedRoute element={<StockOut />} />}
            />
            <Route
              path="stockouthistory"
              element={<ProtectedRoute element={<StockOutHistory />} />}
            />
            <Route
              path="suppliers"
              element={
                <ProtectedRoute element={<Suppliers />} requiredRole="admin" />
              }
            />
            <Route
              path="employees"
              element={
                <ProtectedRoute element={<Employees />} requiredRole="admin" />
              }
            />
            <Route
              path="orderVerification"
              element={<ProtectedRoute element={<OrderVerification />} />}
            />
            <Route
              path="shipping"
              element={<ProtectedRoute element={<Shipping />} />}
            />
            <Route
              path="refund"
              element={<ProtectedRoute element={<Refund />} />}
            />
            <Route
              path="orders"
              element={<ProtectedRoute element={<Orders />} />}
            />
          </Route>

          {/* Authentication and Public Routes */}
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<PasswordReset />} />
          <Route path="not-authorized" element={<NotAuthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
