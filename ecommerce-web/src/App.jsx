import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  // useLocation,
} from "react-router-dom";
import PropTypes from "prop-types";
import { useContext } from "react";
import { CartProvider } from "./components/CartContext";
import { AuthProvider, AuthContext } from "./components/AuthContext.jsx"; // Import AuthProvider
import Navbar from "./shared/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import FAQs from "./pages/FAQs.jsx";
import ShoppingCart from "./pages/ShoppingCart.jsx";
import CartItem from "./components/CartItem.jsx";
import Checkout from "./pages/Checkout.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Profile from "./pages/customer-pages/CustomerProfile.jsx";

import "./App.css";
import { Toaster } from "sonner";

const AppContent = () => {
  // const location = useLocation();
  const { user, loading, setToken } = useContext(AuthContext);

  // Show loading screen while verifying session
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/frequently-asked-questions" element={<FAQs />} />
        <Route path="/shoppingcart" element={<ShoppingCart />} />
        <Route path="/cartitem" element={<CartItem />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/profile/*"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

// PrivateRoute Component to restrict access to authenticated users
const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const App = () => (
  <AuthProvider>
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  </AuthProvider>
);

export default App;
