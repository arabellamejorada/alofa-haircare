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

import { AuthProvider, AuthContext } from "./components/AuthContext";

const ProtectedRoute = ({ element, adminOnly = false }) => {
  const { token, role } = useContext(AuthContext);

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "admin" && role !== "employee")
    return <Navigate to="/login" replace />;
  if (adminOnly && role !== "admin")
    return <Navigate to="/not-authorized" replace />;

  return element;
};

// Not Authorized component
function NotAuthorized() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Not Authorized</h1>
      <p>You do not have permission to view this page.</p>
      <Link to="/" className="text-alofa-dark">
        Go back to Dashboard
      </Link>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster richColors position="top-right" />
        <Routes>
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
              element={<ProtectedRoute element={<Vouchers />} adminOnly />}
            />
            <Route
              path="faqs"
              element={<ProtectedRoute element={<Faqs />} adminOnly />}
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
              element={<ProtectedRoute element={<Suppliers />} adminOnly />}
            />
            <Route
              path="employees"
              element={<ProtectedRoute element={<Employees />} adminOnly />}
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
          <Route path="login" element={<Login />} />
          <Route path="not-authorized" element={<NotAuthorized />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
