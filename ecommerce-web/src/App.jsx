import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./assets/fonts.css";
import PropTypes from "prop-types";
import { useContext } from "react";
import { CartProvider } from "./components/CartContext";
import { AuthProvider, AuthContext } from "./components/AuthContext.jsx"; // Import AuthProvider
import "./App.css";
import Navbar from "./shared/Navbar.jsx";
import Footer from "./shared/Footer.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import FAQs from "./pages/FAQs.jsx";
import ShoppingCart from "./pages/ShoppingCart.jsx";
import CartItem from "./components/CartItem.jsx";
import Checkout from "./pages/checkout-pages/Checkout.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Profile from "./pages/customer-pages/CustomerProfile.jsx";
import OrderConfirmation from "./pages/checkout-pages/OrderConfirmation.jsx";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import "./App.css";
import { Toaster } from "sonner";

const AppContent = () => {
  const location = useLocation();
  const { loading, setToken } = useContext(AuthContext);

  // Determine whether to display Navbar/Footer
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password";

  const isCheckoutPage = location.pathname === "/checkout";

  // Show loading screen while verifying session
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:productId" element={<ProductDetails />} />
        <Route path="/frequently-asked-questions" element={<FAQs />} />
        <Route path="/shoppingcart" element={<ShoppingCart />} />
        <Route path="/cartitem" element={<CartItem />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/profile/*"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/order-confirmed" element={<OrderConfirmation />} />
        {/* Add a catch-all route for 404 */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
      {!isAuthPage && !isCheckoutPage && <Footer />}
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
