// src/shared/CartSidebar.jsx
import { useContext } from "react";
import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { CartContext } from "../components/CartContext";
import PropTypes from "prop-types";

const CartOverview = ({ hovered, setHovered }) => {
  const { cartItems, handleQuantityChange, handleDelete, subtotal } =
    useContext(CartContext);

  return (
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
          {cartItems.reduce((total, item) => total + item.quantity, 0)} items
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
                  <h2 className="font-semibold text-gray-700">{item.name}</h2>
                  {item.value && (
                    <p className="text-sm text-gray-500">
                      {item.value !== "N/A" ? item.value : ""}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">₱{item.unit_price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.variation_id, e.target.value)
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
          <div className="flex justify-between text-xl font-extrabold mb-2 text-gray-500">
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
  );
};

CartOverview.propTypes = {
  hovered: PropTypes.bool.isRequired,
  setHovered: PropTypes.func.isRequired,
};

export default CartOverview;
