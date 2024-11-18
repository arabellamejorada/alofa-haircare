import { useContext, useState } from "react";
import { FaRegUser, FaUser, FaShoppingCart } from "react-icons/fa"; // Import FaRegUser and FaUser
import { IoLogOutOutline, IoLogOut } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../components/CartContext";
import { AuthContext } from "../components/AuthContext";
import NavbarBG from "../../../public/static/alofa-navbar-white.png";
import CartOverview from "./CartOverview";
import ConfirmModal from "./ConfirmModal";

const Navbar = () => {
  const { resetCart, hovered, setHovered } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);


  const { user, signOut } = useContext(AuthContext);
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";
  const isCheckoutPage = location.pathname === "/checkout";
  const isLoggedIn = Boolean(user);
  const isProfilePage = location.pathname.startsWith("/profile");

  const [isLogoutHovered, setIsLogoutHovered] = useState(false); // State for hover effect on logout icon
  const [isUserIconHovered, setIsUserIconHovered] = useState(false); // State for hover effect on user icon

  // Show confirmation modal before logout
const handleLogoutClick = () => {
  setIsConfirmModalOpen(true);
};

// Confirm and proceed with logout
const handleConfirmLogout = async () => {
  try {
    await signOut();
    await resetCart(); // Reset the cart after logout
    navigate("/"); // Redirect to home page
  } catch (err) {
    console.error("Failed to log out", err);
  } finally {
    setIsConfirmModalOpen(false); // Close the modal after logging out
  }
};

// Close the modal without logging out
const handleCloseModal = () => {
  setIsConfirmModalOpen(false);
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
                  {/* User Icon with hover effect */}
                  <Link
                    to="/profile"
                    onMouseEnter={() => setIsUserIconHovered(true)} // Set hover state on mouse enter
                    onMouseLeave={() => setIsUserIconHovered(false)} // Remove hover state on mouse leave
                    className="hover:text-pink-700 flex items-center gap-2"
                  >
                    {isUserIconHovered ? (
                      <FaUser size={20} />
                    ) : (
                      <FaRegUser size={20} />
                    )}
                  </Link>

                  {/* Logout Icon */}
                  <button
                    onClick={handleLogoutClick}
                    onMouseEnter={() => setIsLogoutHovered(true)} // Set hover state on mouse enter
                    onMouseLeave={() => setIsLogoutHovered(false)} // Remove hover state on mouse leave
                    className="hover:text-pink-700 flex items-center gap-2"
                  >
                    {isLogoutHovered ? (
                      <IoLogOut size={24} />
                    ) : (
                      <IoLogOutOutline size={24} />
                    )}
                  </button>

                  <div className="border-l border-gray-300 h-6 mx-2"></div> {/* Divider */}

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
                    className="hover:text-pink-700 flex items-center gap-1"
                  >
                    Login
                  </Link>
                  <p className="text-gray-400 font-light">or</p>
                  <Link
                    to="/signup"
                    className="hover:text-pink-700 flex items-center gap-1"
                  >
                    Sign Up
                  </Link>
                  <div className="border-l border-gray-300 h-6 mx-2"></div> {/* Divider */}
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

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmLogout}
          heading="Log Out"
          message="Are you sure you want to log out?"
          additionalNote="You will need to log in again to access your account."
        />
      </nav>
    </header>
  );
};

export default Navbar;
