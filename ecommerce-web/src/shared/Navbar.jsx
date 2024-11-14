import { useContext } from "react";
import { FaUserAlt, FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../components/CartContext";
import { AuthContext } from "../components/AuthContext";
import NavbarBG from "../../../public/static/alofa-navbar-white.png";
import CartOverview from "./CartOverview";

const Navbar = () => {
  const { resetCart, hovered, setHovered } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, signOut } = useContext(AuthContext);
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";
  const isCheckoutPage = location.pathname === "/checkout";
  const isLoggedIn = Boolean(user);
  const isProfilePage = location.pathname.startsWith("/profile");

  // Handle logout
  const handleLogout = async () => {
    localStorage.removeItem("auth_token");
    signOut();
    await resetCart();
    navigate("/");
  };

  // New handler function to toggle cart visibility
  const toggleCartVisibility = () => {
    setHovered(!hovered); // Toggle cart visibility
  };

  return (
    <header
      className={`${
        isCheckoutPage
          ? "w-full z-50 h-16 bg-checkout-gradient shadow-white-3"
          : "fixed top-0 w-full z-50 h-16 bg-white shadow-md"
      }`}
      style={
        isProfilePage
          ? {
              backgroundImage: `url(${NavbarBG})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}
      }
    >
      <nav className="container mx-auto flex items-center justify-between px-4 py-2 h-full">
        <div
          className={`flex ${
            isCheckoutPage ? "justify-center w-full" : "justify-center"
          } items-center gap-8`}
        >
          {/* Logo */}
          <a
            href="/"
            className={`${
              isCheckoutPage
                ? "text-white text-3xl font-bold"
                : "bg-gradient-to-b from-alofa-pink via-alofa-pink to-alofa-light-pink bg-clip-text text-transparent text-4xl"
            } font-title mt-2`}
          >
            alofa
          </a>

          {/* Navigation Links - Hidden on Auth Pages */}
          {!isAuthPage && !isCheckoutPage && (
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

        {/* Right Section - Cart Icon (if on /checkout) */}
        {isCheckoutPage && (
          <div className="flex items-center justify-start">
            <Link to="/shoppingcart">
              <div className="text-white p-3 rounded-full cursor-pointer">
                <FaShoppingCart size={20} />
              </div>
            </Link>
          </div>
        )}

        {/* Right-side Content */}
        <div className="text-lg text-alofa-pink sm:flex items-center gap-4 hidden">
          {isAuthPage ? (
            <Link to="/" className="hover:text-pink-700 items-baseline gap-2">
              Home
            </Link>
          ) : (
            <>
              {isLoggedIn && !isCheckoutPage ? (
                <>
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
                  <div className="relative" onClick={toggleCartVisibility}>
                    <div className="text-[#FE699F] p-3 rounded-full transition-colors duration-300 hover:text-gray-500 cursor-pointer">
                      <FaShoppingCart />
                    </div>
                    <CartOverview />
                  </div>
                </>
              ) : !isCheckoutPage ? (
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
                  <div className="relative" onClick={toggleCartVisibility}>
                    <div className="text-[#FE699F] p-3 rounded-full transition-colors duration-300 hover:text-gray-500 cursor-pointer">
                      <FaShoppingCart />
                    </div>
                    <CartOverview />
                  </div>
                </>
              ) : null}
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
