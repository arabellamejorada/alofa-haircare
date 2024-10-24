import { FaTrashAlt } from "react-icons/fa";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const CartTable = ({ cartItems, handleQuantityChange, handleDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-[700px]">
      <h2 className="bg-gradient-to-r from-alofa-pink to-alofa-light-pink bg-clip-text text-transparent text-3xl mb-4 font-bold">My Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center">Your cart is empty. Go to <Link to="/products" className="underline text-alofa-pink hover:text-alofa-pink-gradient">products page</Link> to shop!</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="text-alofa-pink">
              <th className="p-2">Products</th>
              <th className="p-2">Variation</th>
              <th className="p-2">Price</th>
              <th className="p-2">Qty.</th>
              <th className="p-2">Total</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-2 flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 mr-3 rounded"
                  />
                  <span>{item.name}</span>
                </td>
                <td className="p-2">{item.value || "N/A"}</td>
                <td className="p-2">₱{Number(item.price).toFixed(2)}</td>
                <td className="p-2">
                  <input
                    type="number"
                    className="w-12 border rounded text-center"
                    value={item.quantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        handleQuantityChange(item.id, value);
                      }
                    }}
                    min="1"
                  />
                </td>
                <td className="p-2">
                  ₱{(item.price * item.quantity).toFixed(2)}
                </td>
                <td className="p-2">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(item.id)}
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

CartTable.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      value: PropTypes.string,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
    }),
  ).isRequired,
  handleQuantityChange: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default CartTable;
