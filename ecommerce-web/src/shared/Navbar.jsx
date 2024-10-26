import { useState, useContext } from "react";
import { FaUserAlt, FaShoppingCart, FaTrashAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../components/CartContext";
import { AuthContext } from "../../../server/AuthContext.jsx"; // Import AuthContext
import Button from "../components/Button";

const Navbar = () => {
  const [hovered, setHovered] = useState(false);
  const { cartItems, handleQuantityChange, handleDelete } =
    useContext(CartContext);
  const location = useLocation(); // Get the current route
  const navigate = useNavigate(); // For navigation

  const { token, setToken, role } = useContext(AuthContext); // Access token, setToken, and role

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
              {isLoggedIn ? (
                // When user is logged in
                <>
                  {role === "employee" && (
                    // Only show Dashboard button if the user is an employee
                    <Link to="http://localhost:3000">
                      <Button>Dashboard</Button>
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    className="hover:text-pink-700 flex items-center gap-2"
                  >
                    <FaUserAlt />
                  </Link>

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
    </header>
  );
};

export default Navbar;
