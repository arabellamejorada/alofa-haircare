import { useState, useContext } from "react";
import { FaUserAlt, FaShoppingCart, FaTrashAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../components/CartContext";
import { AuthContext } from "../components/AuthContext"; // Import AuthContext

const Navbar = () => {
  const [hovered, setHovered] = useState(false);
  const { cartItems, handleQuantityChange, handleDelete } =
    useContext(CartContext);
  const location = useLocation(); // Get the current route
  const navigate = useNavigate(); // For navigation

  const { token, setToken } = useContext(AuthContext); // Access token and setToken

  // Calculate total price
  const totalPrice = cartItems
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  // Check if the current path is either '/login' or '/signup'
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  // Determine if user is logged in
  const isLoggedIn = Boolean(token);

  // Handle logout
  const handleLogout = () => {
    // Remove session token
    setToken(null);
    // Redirect to home page
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md py-2px fixed top-0 w-full z-50 h-16">
      <nav className="container mx-auto flex justify-between items-center px-4 md:py-2 pt-3 pb-2">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <a
            href="/"
            className="bg-gradient-to-b from-alofa-pink to-alofa-light-pink bg-clip-text text-transparent text-4xl font-title mt-2"
          >
            alofa
          </a>

          {/* Navigation Pages */}
          {!isAuthPage && (
            <div className="text-lg font-body text-alofa-pink sm:flex items-center gap-8 hidden">
              <Link
                to="/"
                className="hover:text-pink-700 items-baseline gap-2 pl-3"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="hover:text-pink-700 flex items-baseline gap-2"
              >
                Products
              </Link>
              <Link
                to="/frequently-asked-questions"
                className="hover:text-pink-700 flex items-baseline gap-2"
              >
                FAQs
              </Link>
            </div>
          )}
        </div>

        {/* Right-side Content */}
        <div className="text-lg text-alofa-pink sm:flex items-center gap-4 hidden">
          {isAuthPage ? (
            // Show Home link on the right only when on login or signup page
            <Link to="/" className="hover:text-pink-700 items-baseline gap-2">
              Home
            </Link>
          ) : (
            // For non-auth pages
            <>
              <p>
                <FaUserAlt />
              </p>
              {isLoggedIn ? (
                // When user is logged in
                <>
                  <button
                    onClick={handleLogout}
                    className="hover:text-pink-700 flex items-center gap-2"
                  >
                    Logout
                  </button>
                  {/* Shopping Cart Icon */}
                  <div
                    className="relative"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                  >
                    <div className="text-[#FE699F] p-3 rounded-full transition-colors duration-300 hover:delay-700 hover:text-gray-500 cursor-pointer">
                      <FaShoppingCart />
                    </div>
                  </div>
                </>
              ) : (
                // When user is not logged in
                <>
                  <Link
                    to="/login"
                    className="hover:text-pink-700 flex items-center gap-2"
                  >
                    Login
                  </Link>
                  <p>|</p>
                  <Link
                    to="/signup"
                    className="hover:text-pink-700 flex items-center gap-2"
                  >
                    Sign Up
                  </Link>
                  {/* Shopping Cart Icon */}
                  <div
                    className="relative"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                  >
                    <div className="text-[#FE699F] p-3 rounded-full transition-colors duration-300 hover:delay-700 hover:text-gray-500 cursor-pointer">
                      <FaShoppingCart />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </nav>

      {/* Cart Sidebar */}
      {!isAuthPage && (
        <div
          className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-40 transition-transform duration-300 ${
            hovered ? "translate-x-0" : "translate-x-full"
          }`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="p-4 h-full flex flex-col">
            <h1 className="text-2xl gradient-heading font-bold mb-4">
              Cart Overview
            </h1>

            
            <div className="flex-1 overflow-y-auto mb-4">
              {cartItems && cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 mb-4 p-2 bg-white rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md shadow-sm"
                    />
                    <div className="flex-1">
                      <h2 className="font-semibold text-gray-700">
                        {item.name}
                      </h2>
                      {item.value && (
                        <p className="text-sm text-gray-500">
                          {item.value !== "N/A" ? item.value : ""}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">₱{item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                        className="w-12 border border-gray-300 rounded-md text-center"
                      />
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 mb-4">Your cart is empty.</p>
              )}
            </div>

            {/* Fixed Bottom Section: Subtotal, Total, and Buttons */}
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2 text-gray-500">
                <span>Subtotal</span>
                <span>₱{totalPrice}</span>
              </div>
              <div className="flex justify-between text-xl font-semibold mb-4">
                <span>Total</span>
                <span>₱{totalPrice}</span>
              </div>

              <div className="flex justify-between">
                <Link to="/shoppingcart">
                  <button className="font-extrabold text-white py-2 px-4 rounded-full focus:outline-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] hover:to-[#FE699F]">
                    View Cart
                  </button>
                </Link>
                <Link to="/checkout">
                  <button className="font-extrabold text-white py-2 px-4 rounded-full focus:outline-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] hover:to-[#FE699F]">
                    Check Out
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
