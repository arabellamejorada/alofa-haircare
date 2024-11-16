import { FaTrashAlt, FaPlus, FaMinus } from "react-icons/fa";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const CartTable = ({
  cartItems,
  handleQuantityChange,
  handleDelete,
  handleDecrement,
  handleIncrement,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-[700px]">
      <div className="flex justify-between items-center mb-2">
        <h2 className="gradient-heading text-3xl font-bold">My Cart</h2>
        <p className="italic text-gray-600">
          {cartItems.reduce((total, item) => total + item.quantity, 0)} {cartItems.reduce((total, item) => total + item.quantity, 0) === 1 ? "item" : "items"} 
        </p>
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
                  <td>
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
  handleDecrement: PropTypes.func.isRequired,
  handleIncrement: PropTypes.func.isRequired,
};

export default CartTable;
