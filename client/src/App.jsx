import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/shared/Layout";
import Dashboard from "./components/Dashboard";
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

import { AuthProvider, AuthContext } from "./components/AuthContext"; // Import AuthContext

// Protected Route component
const ProtectedRoute = ({ element }) => {
  const { token, role } = useContext(AuthContext); // Access token and role from AuthContext

  // If user is not logged in, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If user is not an admin or employee, redirect to login
  if (role !== "admin" && role !== "employee") {
    return <Navigate to="/login" replace />;
  }

  // Render the protected component
  return element;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Toaster should be accessible across the entire app */}
        <Toaster richColors position="top-right" />
        <Routes>
          {/* Add the Layout component as the parent route. Sidebar and Header are Layout Components */}
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
              element={<ProtectedRoute element={<Vouchers />} />}
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
              element={<ProtectedRoute element={<Suppliers />} />}
            />
            <Route
              path="employees"
              element={<ProtectedRoute element={<Employees />} />}
            />
          </Route>
          <Route path="login" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
