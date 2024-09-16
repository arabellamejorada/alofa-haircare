import { useState } from 'react';
import { FaUserAlt, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "/images/alofa-logo.png";
import PropTypes from 'prop-types';
import CartTable from '../components/CartTable.jsx';

const Navbar = ({ cartItems, handleQuantityChange, handleDelete }) => {
  const [hovered, setHovered] = useState(false);


  return (
    <header className="bg-white/75 shadow-md py-2px fixed top-0 w-full z-50">
      <nav className="container mx-auto flex justify-between items-center px-4 md:py-2 pt-3 pb-2">

        <div className="flex items-center gap-8">
          {/* logo */}
          <a href="/"><img src={logo} alt="Alofa logo" /></a>

          {/* navigation pages */}
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

          {/* Shopping Cart Icon and Summary */}
          <div
            className="relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div className="text-[#FE699F] p-3 rounded-full transition-colors duration-300 hover:bg-[#FE699F] hover:text-white cursor-pointer">
              <FaShoppingCart />
            </div>

            {/* Cart Summary Dropdown */}
            {hovered && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-20 p-4">
                <h1 className="text-lg font-bold mb-2">Cart Summary</h1>

                {/* Use the CartTable component for the cart summary */}
                {cartItems && cartItems.length > 0 ? (
                  <CartTable
                    cartItems={cartItems}
                    handleQuantityChange={handleQuantityChange}  
                    handleDelete={handleDelete}
                  />
                ) : (
                  <p className="text-gray-500 mb-4">Your cart is empty.</p>
                )}

                {/* View Cart and Checkout Buttons */}
                <div className="flex justify-between">
                  <Link to="/shoppingcart">
                    <button className="bg-alofa-pink text-white font-semibold py-2 px-4 rounded-full hover:bg-pink-500">
                      View Cart
                    </button>
                  </Link>
                  <Link to="/checkout">
                    <button className="bg-alofa-pink text-white font-semibold py-2 px-4 rounded-full hover:bg-pink-500">
                      Checkout
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

Navbar.propTypes = {
  cartItems: PropTypes.array.isRequired,  
  handleQuantityChange: PropTypes.func.isRequired,  
  handleDelete: PropTypes.func.isRequired, 
};

export default Navbar;
