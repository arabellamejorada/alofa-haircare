import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './components/CartContext.jsx'
import Navbar from './shared/Navbar.jsx'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import FAQs from './pages/FAQs.jsx'
import ShoppingCart from './pages/ShoppingCart.jsx'
import CartItem from './components/CartItem.jsx'
// import Checkout from './pages/Checkout.jsx'
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/products" element={<Products />} />
          <Route path="/frequently-asked-questions" element={<FAQs/>} />
          <Route path="/shoppingcart" element={<ShoppingCart/>} />
          <Route path="/cartitem" element={<CartItem/>} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
