import { useState, useContext, useEffect } from "react";
import { FaUserAlt, FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../components/CartContext";
import { AuthContext } from "../AuthContext.jsx";
import Button from "../components/Button";

const Navbar = () => {
  const [hovered, setHovered] = useState(false);
  const { cartItems } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { token, role, signOut } = useContext(AuthContext);

  // Determine if the current route is login or signup
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";
  const isLoggedIn = Boolean(token);

  // Handle logout process
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  useEffect(() => {
    console.log("Current token:", token); // Debugging log to check token value
    console.log("Current role:", role); // Debugging log to check role value
  }, [token, role]);

  return (
    <header className="bg-white shadow-md py-2px fixed top-0 w-full z-50 h-16">
      <nav className="container mx-auto flex justify-between items-center px-4 md:py-2 pt-3 pb-2">
        <div className="flex items-center gap-8">
          <a
            href="/"
            className="bg-gradient-to-b from-alofa-pink to-alofa-light-pink bg-clip-text text-transparent text-4xl font-title mt-2"
          >
            alofa
          </a>

          {/* Navigation Links - Hidden on Auth Pages */}
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
            // Show Home link when on login or signup page
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
                    // Show Dashboard button only for employees
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
                      {hovered && cartItems.length > 0 && (
                        <div className="absolute right-0 mt-2 p-2 bg-white border rounded shadow-lg">
                          <p>Cart Items: {cartItems.length}</p>
                        </div>
                      )}
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
