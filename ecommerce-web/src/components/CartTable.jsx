import { FaTrashAlt } from "react-icons/fa";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const CartTable = ({ cartItems, handleQuantityChange, handleDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-[700px]">
      <div className="flex justify-between items-center mb-2">
        <h2 className="gradient-heading text-3xl font-bold">
          My Cart
        </h2>
        <p className="italic text-gray-600">{cartItems.reduce((total, item) => total + item.quantity, 0)} items</p>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center">
          Your cart is empty. Go to{" "}
          <Link
            to="/products"
            className="underline text-alofa-pink hover:text-alofa-pink-gradient"
          >
            products page
          </Link>{" "}
          to shop!
        </p>
      ) : (
        <div className="overflow-y-auto max-h-[600px]">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white z-10">
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
                <tr key={item.cart_item_id} className="border-b">
                  <td className="p-2 flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 mr-3 rounded"
                    />
                    <span>{item.name}</span>
                  </td>
                  <td className="p-2">{item.value || "N/A"}</td>
                  <td className="p-2">
                    ₱
                    {new Intl.NumberFormat("en-PH", {
                      minimumFractionDigits: 2,
                    }).format(item.unit_price)}
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      className="w-12 border rounded text-center"
                      value={item.quantity}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          handleQuantityChange(item.variation_id, value);
                        }
                      }}
                      min="1"
                    />
                  </td>
                  <td className="p-2">
                    ₱
                    {new Intl.NumberFormat("en-PH", {
                      minimumFractionDigits: 2,
                    }).format(item.item_total)}
                  </td>
                  <td className="p-2">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(item.variation_id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

CartTable.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      cart_item_id: PropTypes.number.isRequired,
      variation_id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      value: PropTypes.string,
      unit_price: PropTypes.number.isRequired, // Updated to 'unit_price'
      quantity: PropTypes.number.isRequired,
      item_total: PropTypes.number.isRequired, // Added 'item_total'
      image: PropTypes.string.isRequired,
    }),
  ).isRequired,
  handleQuantityChange: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default CartTable;
