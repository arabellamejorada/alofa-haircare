import PropTypes from "prop-types";
import { FaTrashAlt } from "react-icons/fa";

const CartItem = ({ item, handleQuantityChange, handleDelete }) => {
  return (
    <div className="flex justify-between items-center py-4 border-b">
      {/* Image & Badge */}
      <div className="relative">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-24 h-24 object-cover rounded-lg"
        />
        {item.lowStock && (
          <div className="absolute bottom-0 left-0 bg-pink-100 text-black px-2 py-1 text-sm rounded-lg">
            LAST FEW PIECES
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col justify-between flex-1 ml-4">
        <h3 className="font-medium text-gray-900">{item.name}</h3>
        <p className="text-gray-500">{item.value}</p>
        <p className="text-lg font-bold text-gray-900">
          ₱{item.price.toFixed(2)}
        </p>
      </div>

      {/* Quantity Dropdown */}
      <div className="flex items-center gap-2">
        <select
          className="border border-gray-300 rounded px-2 py-1"
          value={item.quantity}
          onChange={(e) =>
            handleQuantityChange(item.id, Number(e.target.value))
          }
        >
          {[1, 2, 3, 4, 5].map((qty) => (
            <option key={qty} value={qty}>
              {qty}
            </option>
          ))}
        </select>

        {/* Delete Button */}
        <button
          onClick={() => handleDelete(item.id)}
          className="text-gray-400 hover:text-red-500"
        >
          <FaTrashAlt />
        </button>
      </div>
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
    lowStock: PropTypes.bool,
  }).isRequired,
  handleQuantityChange: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default CartItem;
