import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { CartProvider } from "./components/CartContext.jsx";
import Navbar from "./shared/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import FAQs from "./pages/FAQs.jsx";
import ShoppingCart from "./pages/ShoppingCart.jsx";
import CartItem from "./components/CartItem.jsx";
import Checkout from "./pages/Checkout.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Profile from "./pages/CustomerProfile.jsx";

import "./App.css";
import { Toaster } from "sonner";

const AppContent = () => {
  const location = useLocation();

  return (
    <>
      <Toaster richColors position="top-center" />
      {/* Navbar to not appear in checkout page */}
      {location.pathname !== "/checkout" && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/frequently-asked-questions" element={<FAQs />} />
        <Route path="/shoppingcart" element={<ShoppingCart />} />
        <Route path="/cartitem" element={<CartItem />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
};

const App = () => (
  <CartProvider>
    <Router>
      <AppContent />
    </Router>
  </CartProvider>
);

export default App;
