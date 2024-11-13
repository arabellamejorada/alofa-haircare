import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Importing prop-types

const TransactionCard = ({ activeTab, searchQuery }) => {
  const [order, setOrder] = useState(null);

  // Mocked transaction data, can be replaced by fetched data later
  useEffect(() => {
    const placeholderTransactions = [
      {
        id: "20240001",
        status: "Completed",
        products: [
          { id: "1", name: "Jade Hair Brush", value: 1, price: 280, sku: "BRUSH-JADE" },
        ],
        total: 280,
      },
      {
        id: "20240002",
        status: "To Ship",
        products: [
          { id: "2", name: "Hair Oil", value: 1, price: 450, sku: "HAIR-OIL-LAV" },
        ],
        total: 450,
      },
      {
        id: "20240003",
        status: "To Receive",
        products: [
          { id: "3", name: "Hair Clips Set", value: 2, price: 150, sku: "CLIPS-PSTL" },
        ],
        total: 300,
      },
    ];

    // Filter transactions based on activeTab and searchQuery
    const filteredOrder = placeholderTransactions.find(
      (transaction) =>
        (activeTab === "All" || transaction.status === activeTab) &&
        (searchQuery === "" ||
          transaction.id.includes(searchQuery) ||
          transaction.products.some((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
          ))
    );

    setOrder(filteredOrder);
  }, [activeTab, searchQuery]);

  if (!order) {
    return null; // Return nothing if there's no order matching the criteria
  }

  // Calculate the total number of items in the order
  const totalItems = order.products.reduce((acc, product) => acc + product.value, 0);

  return (
    <div className="bg-gray-100 border border-gray-200 rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-700 font-medium">Order ID #{order.id}</div>
        <div className={`text-${order.status === 'Completed' ? 'green' : 'red'}-600 font-medium`}>
          {order.status === 'Completed' ? 'Parcel has been delivered' : 'Parcel is on the way'}
        </div>
      </div>

      {order.products.map((product) => (
        <div key={product.id} className="flex gap-4 mb-4">
          <div className="flex w-full">
            <img
              src={product.image || '/static/default-image.png'}
              alt={product.name || 'Product Image'}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="ml-4 flex-grow">
              <div className="font-bold text-gray-800">{product.name || 'Product Name'}</div>
              <div className="text-gray-600">x{product.value || 1}</div>
            </div>
            <div className="text-right">
              <div className="text-gray-800">₱{product.price || '0.00'}</div>
              <div className="text-gray-600">SKU: {product.sku || 'N/A'}</div>
            </div>
          </div>
        </div>
      ))}

      <div className="border-t border-gray-200 pt-4">
        <div className="flex flex-col items-end mb-4">
          <div className="text-gray-600 text-sm">Total {totalItems} items</div>
          <div className="text-pink-600 font-bold text-xl">₱{order.total}</div>
        </div>
        <div className="flex gap-2 justify-end">
          <button className="bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] hover:to-[#FE699F] text-white font-semibold py-2 px-4 rounded">
            Buy Again
          </button>
          <button className="border border-pink-500 hover:bg-gray-100 hover:underline text-gray-700 font-medium py-2 px-4 rounded">
            Request Refund
          </button>
        </div>
      </div>
    </div>
  );
};

// Adding propTypes for props validation
TransactionCard.propTypes = {
  activeTab: PropTypes.string.isRequired,
  searchQuery: PropTypes.string.isRequired,
};

export default TransactionCard;
