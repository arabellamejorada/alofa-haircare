import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/shared/Layout";
import Dashboard from "./components/Dashboard";
import Products from "./components/products_tab/Products";
import Inventory from "./components/inventory_tab/Inventory";
import Employees from "./components/employee_tab/Employees";

function App() {
  return (
    <Router>
      <Routes>
        {/* Add the Layout component as the parent route. Sidebar and Header are Layout Components */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="employees" element={<Employees />} />
        </Route>
        <Route path="login" element={<div>Login Page</div>}></Route>
      </Routes>
    </Router>
  );
}
export default App;
