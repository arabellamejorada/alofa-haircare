import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ConfirmModal from "../shared/ConfirmModal";

const CartSummary = ({ cartItems, subtotal, user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCheckoutClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-4">
      <div className="flex justify-between mb-4">
        <span className="text-gray-500 italic">
          Shipping & discounts calculated at checkout
        </span>
      </div>
      <div className="flex justify-between mb-6 text-lg font-bold">
        <span>Subtotal:</span>
        <span>
          ₱
          {new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2 }).format(
            subtotal,
          )}
        </span>
      </div>
      {cartItems.length > 0 ? (
        user ? (
          <Link to="/checkout">
            <button className="font-extrabold text-white w-full py-2 rounded-full focus:outline-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] hover:to-[#FE699F]">
              CHECK OUT
            </button>
          </Link>
        ) : (
          <button
            onClick={handleCheckoutClick}
            className="font-extrabold text-white w-full py-2 rounded-full focus:outline-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] hover:to-[#FE699F]"
          >
            {" "}
            CHECK OUT
          </button>
        )
      ) : (
        <button
          disabled
          className="font-extrabold text-white w-full py-2 rounded-full focus:outline-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] hover:to-[#FE699F] opacity-50 cursor-not-allowed"
        >
          CHECK OUT
        </button>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={() => (window.location.href = "/login")}
        heading="Login Required"
        message="You need to log in to proceed to checkout. Would you like to log in now?"
      />
    </div>
  );
};
CartSummary.propTypes = {
  subtotal: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default CartSummary;
