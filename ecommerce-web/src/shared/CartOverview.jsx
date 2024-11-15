import { useContext } from "react";
import { Link } from "react-router-dom";
import { FaTrashAlt, FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { CartContext } from "../components/CartContext";

const CartOverview = () => {
  const {
    cartItems,
    handleQuantityChange,
    handleDelete,
    handleIncrement,
    handleDecrement,
    subtotal,
    hovered,
    setHovered,
  } = useContext(CartContext);

  const closeCart = () => {
    setHovered(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-30 ${
          hovered
            ? "opacity-30 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setHovered(false)} // Close cart when clicking on the overlay
      />

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[25rem] bg-white shadow-lg z-40 transition-transform duration-300 ${
          hovered ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the cart
      >
        {/* Close Button */}
        <button
          onClick={closeCart} // Close the cart when clicked
          className="absolute top-5 right-5 text-gray-300 hover:text-gray-700"
        >
          <FaTimes size={25} />
        </button>

        {/* Cart Content */}
        <div className="p-4 h-full flex flex-col">
          <h1 className="text-2xl gradient-heading font-bold mb-0">
            Cart Overview
          </h1>
          <div className="text-md text-gray-500 mb-4 italic">
            {cartItems.reduce((total, item) => total + item.quantity, 0)} items
          </div>

          <div className="flex-1 overflow-y-auto mb-4">
            {cartItems && cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.cart_item_id} className="mb-2">
                  <div className="flex items-center gap-3 p-2">
                    <Link to={`/products/${item.variation_id}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover shadow-md rounded-md cursor-pointer"
                      />
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-700">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => handleDelete(item.variation_id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        <p className="text-sm text-gray-700 font-light">
                          ₱{item.unit_price}
                        </p>
                        {item.value && (
                          <p className="text-sm font-semibold text-gray-700">
                            {item.value !== "N/A" ? item.value : ""}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              handleDecrement(item.variation_id, item.quantity)
                            }
                            className="w-5 h-5 bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] hover:to-[#FE699F] text-white rounded-full flex items-center justify-center"
                          >
                            <FaMinus className="w-2 h-2" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value, 10);
                              if (!isNaN(value) && value >= 1) {
                                handleQuantityChange(item.variation_id, value);
                              }
                            }}
                            className="w-8 h-6 border text-sm border-gray-300 rounded-md text-center text-black"
                            min="1"
                          />
                          <button
                            onClick={() =>
                              handleIncrement(item.variation_id, item.quantity)
                            }
                            className="w-5 h-5 bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] hover:to-[#FE699F] text-white rounded-full flex items-center justify-center"
                          >
                            <FaPlus className="w-2 h-2" />
                          </button>
                        </div>
                        <div className="text-sm font-semibold text-gray-700">
                          ₱
                          {new Intl.NumberFormat("en-PH", {
                            minimumFractionDigits: 2,
                          }).format(item.quantity * item.unit_price)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 mb-4">Your cart is empty.</p>
            )}
          </div>

          {/* Fixed Bottom Section */}
          <div className="border-t pt-4">
            <div className="flex justify-between text-xl font-extrabold mb-2 text-gray-800">
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

          <div className="flex justify-between gap-4">
            <Link to="/shoppingcart" className="w-1/2">
              <button className="w-full font-extrabold flex items-center justify-center gap-2 text-white py-2 px-4 rounded-full focus:outline-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] hover:to-[#FE699F]">
                <AiOutlineShoppingCart />
                View Cart
              </button>
            </Link>
            <Link to="/checkout" className="w-1/2">
              <button className="w-full font-extrabold flex items-center justify-center gap-2 text-white py-2 px-4 rounded-full focus:outline-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] hover:to-[#FE699F]">
                <MdOutlineShoppingCartCheckout />
                Check Out
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartOverview;
