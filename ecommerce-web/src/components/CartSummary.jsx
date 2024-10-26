import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const CartSummary = ({ subtotal, total }) => {

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-4">
      <div className="flex justify-between mb-4">
        <span className="text-gray-500">Subtotal:</span>
        <span className="text-gray-700">₱{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between mb-6 text-lg font-bold">
        <span>Total:</span>
        <span>₱{total.toFixed(2)}</span>
      </div>
      <Link to="/checkout1">
      <button
        className="font-extrabold text-white w-full py-2 rounded-full focus:outline-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] hover:to-[#FE699F]"
      >
        CHECK OUT
      </button>
      </Link>
    </div>
  );
};

CartSummary.propTypes = {
  subtotal: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default CartSummary;
