import PropTypes from 'prop-types';

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
      <button className="bg-alofa-pink-gradient hover:bg-alofa-pink text-white font-semibold w-full py-2 rounded-full">
        CHECKOUT
      </button>
    </div>
  );
};

CartSummary.propTypes = {
    subtotal: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  };

export default CartSummary;
