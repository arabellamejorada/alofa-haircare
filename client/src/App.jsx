import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/shared/Layout";
import Dashboard from "./components/Dashboard";
import Products from "./components/products_tab/Products";
import Inventory from "./components/inventory_tab/Inventory";
import Employees from "./components/employee_tab/Employees";
import Suppliers from "./components/supplier_tab/Suppliers";
import ProductVariations from "./components/products_tab/ProductVariations";
import ProductCategories from "./components/products_tab/ProductCategories";
import StockIn from "./components/inventory_tab/stock_in/StockIn";
import StockInHistory from "./components/inventory_tab/stock_in/StockInHistory";
import StockOut from "./components/inventory_tab/stock_out/StockOut";
import StockOutHistory from "./components/inventory_tab/stock_out/StockOutHistory";

function App() {
  return (
    <Router>
      {/* Toaster should be accessible across the entire app */}
      <Toaster richColors position="top-right" />
      <Routes>
        {/* Add the Layout component as the parent route. Sidebar and Header are Layout Components */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="productvariations" element={<ProductVariations />} />
          <Route path="productcategories" element={<ProductCategories />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="stockin" element={<StockIn />} />
          <Route path="stockinhistory" element={<StockInHistory />} />
          <Route path="stockout" element={<StockOut />} />
          <Route path="stockouthistory" element={<StockOutHistory />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="employees" element={<Employees />} />
        </Route>
        <Route path="login" element={<div>Login Page</div>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
