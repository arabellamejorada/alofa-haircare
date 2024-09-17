import { useState, useContext } from 'react';
import { FaUserAlt, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "/images/alofa-logo.png";
import { CartContext } from '../components/CartContext'; // Import CartContext
import CartItem from '../components/CartItem'; // Import the new CartItem component

const Navbar = () => {
  const [hovered, setHovered] = useState(false);
  const { cartItems, handleQuantityChange, handleDelete } = useContext(CartContext); // Get cart context

  return (
    <header className="bg-white/75 shadow-md py-2px fixed top-0 w-full z-50">
      <nav className="container mx-auto flex justify-between items-center px-4 md:py-2 pt-3 pb-2">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <a href="/"><img src={logo} alt="Alofa logo" /></a>

          {/* Navigation Pages */}
          <div className="text-lg font-semibold text-alofa-pink sm:flex items-center gap-8 hidden">
            <Link to="/" className="hover:text-pink-700 items-baseline gap-2 pl-3">Home</Link>
            <Link to="/products" className="hover:text-pink-700 flex items-baseline gap-2">Products</Link>
            <Link to="/frequently-asked-questions" className="hover:text-pink-700 flex items-baseline gap-2">FAQs</Link>
          </div>
        </div>

        {/* Account & Cart Button */}
        <div className="text-lg text-alofa-pink sm:flex items-center gap-4 hidden">
          <p><FaUserAlt /></p>
          <Link to="/" className="hover:text-pink-700 flex items-center gap-2">Login</Link>
          <p>|</p>
          <Link to="/" className="hover:text-pink-700 flex items-center gap-2">Sign Up</Link>

          {/* Shopping Cart Icon */}
          <div
            className="relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div className="text-[#FE699F] p-3 rounded-full transition-colors duration-300 hover:bg-[#FE699F] hover:text-white cursor-pointer">
              <FaShoppingCart />
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-40 transition-transform duration-300 ${
          hovered ? 'translate-x-0' : 'translate-x-full'
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="p-4 h-full overflow-y-auto">
          <h1 className="text-2xlg text-alofa-pink font-bold mb-4">Cart Summary</h1>

          {/* Cart Items */}
          {cartItems && cartItems.length > 0 ? (
            <div>
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  handleQuantityChange={handleQuantityChange}
                  handleDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
          )}

          {/* View Cart and Checkout Buttons */}
          <div className="absolute bottom-4 left-0 w-full px-4">
            <div className="flex justify-between">
              <Link to="/shoppingcart">
                <button className="bg-alofa-pink text-white font-semibold py-2 px-4 rounded-full hover:bg-pink-500">
                  View Cart
                </button>
              </Link>
              <Link to="/checkout">
                <button className="bg-alofa-pink text-white font-semibold py-2 px-4 rounded-full hover:bg-pink-500">
                  Check Out
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
