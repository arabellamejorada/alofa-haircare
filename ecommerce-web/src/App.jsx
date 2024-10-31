import {
  BrowserRouter as Router,
  Routes,
  Route,
<<<<<<< HEAD
} from 'react-router-dom';
import { useContext } from 'react';
import { CartProvider } from './components/CartContext.jsx';
import { AuthProvider, AuthContext } from './components/AuthContext.jsx';
import Navbar from './shared/Navbar.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import FAQs from './pages/FAQs.jsx';
import ShoppingCart from './pages/ShoppingCart.jsx';
import CartItem from './components/CartItem.jsx';
import Checkout from './pages/Checkout.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import CustomerProfile from './pages/customer-pages/CustomerProfile.jsx';
=======
  Navigate,
  useLocation,
} from "react-router-dom";
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
import Profile from "./pages/Profile";
>>>>>>> 0741f37fba59f0ba78f97984e9391d9da72ddb28

import './App.css';
import { Toaster } from 'sonner';

const AppContent = () => {
<<<<<<< HEAD
  const { setToken } = useContext(AuthContext);
=======
  const location = useLocation();
  const { token, loading, setToken } = useContext(AuthContext);

  // Show loading screen while verifying session
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }
>>>>>>> 0741f37fba59f0ba78f97984e9391d9da72ddb28

  return (
    <>
      <Toaster richColors position="top-center" />
<<<<<<< HEAD
      <Navbar />
=======
      {/* Show Navbar on all pages except checkout */}
      {location.pathname !== "/checkout" && <Navbar />}
>>>>>>> 0741f37fba59f0ba78f97984e9391d9da72ddb28
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/frequently-asked-questions" element={<FAQs />} />
        <Route path="/shoppingcart" element={<ShoppingCart />} />
        <Route path="/cartitem" element={<CartItem />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<SignUp />} />
<<<<<<< HEAD
        
        {/* Profile Route with Nested Paths */}
        <Route path="/profile/*" element={<CustomerProfile />} />
=======
        <Route
          path="/profile"
          element={
            <PrivateRoute token={token}>
              <Profile />
            </PrivateRoute>
          }
        />
>>>>>>> 0741f37fba59f0ba78f97984e9391d9da72ddb28
      </Routes>
    </>
  );
};

// PrivateRoute Component to restrict access to authenticated users
const PrivateRoute = ({ token, children }) => {
  return token ? children : <Navigate to="/login" />;
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
