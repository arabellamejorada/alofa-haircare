import { useContext } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { CartContext } from './CartContext.jsx';

const CartTable = () => {
  const { cartItems, handleQuantityChange, handleDelete } = useContext(CartContext);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-alofa-pink text-3xl mb-4 font-bold">My Cart</h2>
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
                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 mr-3 rounded" />
                <span>{item.name}</span>
              </td>
              <td className="p-2">{item.variation || 'N/A'}</td>
              <td className="p-2">₱{item.price.toFixed(2)}</td>
              <td className="p-2">
                <input
                  type="number"
                  className="w-12 border rounded text-center"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                  min="1"
                />
              </td>
              <td className="p-2">₱{(item.price * item.quantity).toFixed(2)}</td>
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
    </div>
  );
};

export default CartTable;
