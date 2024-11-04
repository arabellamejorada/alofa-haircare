import { useState, useContext, useEffect } from "react";
import { FaUserAlt, FaShoppingCart, FaTrashAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../components/CartContext";
import { AuthContext } from "../components/AuthContext"; // Import AuthContext
import { ClipLoader } from "react-spinners";
import NavbarBG from "../../../public/static/alofa-navbar-white.png";

const Navbar = () => {
  const [hovered, setHovered] = useState(false);
  const { cartItems, handleQuantityChange, handleDelete, subtotal, loading } =
    useContext(CartContext);
  const location = useLocation(); // Get the current route
  const navigate = useNavigate(); // For navigation

  const { user, role, signOut } = useContext(AuthContext); // Use 'user' instead of 'token'
  const { resetCart } = useContext(CartContext);

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";
  const isCheckoutPage = location.pathname === "/checkout";
  const isLoggedIn = Boolean(user); // Use 'user' to determine if logged in

  // Check if the current page is `/profile`
  const isProfilePage = location.pathname.startsWith("/profile");
  // Handle logout
  const handleLogout = async () => {
    localStorage.removeItem("auth_token");
    signOut();
    await resetCart();
    // Redirect to home page
    navigate("/");
  };

  useEffect(() => {
    console.log("Current user:", user); // Log 'user' instead of 'token'
    console.log("Current role:", role); // Debugging log to check role value
  }, [user, role]);

  if (loading) {
    return (
      <div className="relative">
        {loading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
            <ClipLoader size={50} color="#E53E3E" loading={loading} />
          </div>
        )}
      </div>
    );
  }
  return (
    <header
      className={`${
        isCheckoutPage
          ? "w-full z-50 h-16 bg-checkout-gradient shadow-white-3"
          : "fixed top-0 w-full z-50 h-16 bg-white shadow-md"
      }
          `}
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

        {/* Right Section - Cart Icon (if on /checkout1) */}
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
            // Show Home link on the right only when on login or signup page
            <Link to="/" className="hover:text-pink-700 items-baseline gap-2">
              Home
            </Link>
          ) : (
            // For non-auth pages
            <>
              {isLoggedIn && !isCheckoutPage ? (
                // When user is logged in
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
                  <div
                    className="relative"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                  >
                    <div className="text-[#FE699F] p-3 rounded-full transition-colors duration-300 hover:delay-700 hover:text-gray-500 cursor-pointer">
                      <Link to="/shoppingcart">
                        <FaShoppingCart />
                      </Link>
                    </div>
                  </div>
                </>
              ) : !isCheckoutPage ? (
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
              ) : null}
            </>
          )}
        </div>
      </nav>

      {/* Cart Sidebar */}
      {!isAuthPage && !isCheckoutPage && (
        <div
          className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-40 transition-transform duration-300 ${
            hovered ? "translate-x-0" : "translate-x-full"
          }`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="p-4 h-full flex flex-col">
            <h1 className="text-2xl gradient-heading font-bold mb-1">
              Cart Overview
            </h1>
            <div className="text-md text-gray-500 mb-4">
              {cartItems.reduce((total, item) => total + item.quantity, 0)}{" "}
              items
            </div>

            <div className="flex-1 overflow-y-auto mb-4">
              {cartItems && cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div
                    key={item.cart_item_id}
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
                      <p className="text-sm text-gray-500">
                        ₱{item.unit_price}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.variation_id,
                            e.target.value,
                          )
                        }
                        className="w-12 border border-gray-300 rounded-md text-center"
                      />
                      <button
                        onClick={() => handleDelete(item.variation_id)}
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
              <div className="flex justify-between text-xl font-extrabold mb-2  text-gray-500">
                <span>Subtotal</span>
                <span>
                  ₱
                  {new Intl.NumberFormat("en-PH", {
                    minimumFractionDigits: 2,
                  }).format(subtotal)}
                </span>
              </div>
              <div className="flex justify-between font-light text-gray-500 italic text-sm mb-4">
                <span>Shipping & taxes calculated at checkout</span>
              </div>
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
      )}
    </header>
  );
};

export default Navbar;
