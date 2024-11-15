import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const TransactionCard = ({ activeTab, searchQuery, transactions }) => {
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    // Filter transactions based on activeTab and searchQuery
    const orders = transactions.filter(
      (transaction) =>
        (activeTab === "All" || transaction.order_status_name === activeTab) &&
        (searchQuery === "" ||
          transaction.order_id.includes(searchQuery) ||
          transaction.order_items.some((product) =>
            product.product_name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()),
          )),
    );

    setFilteredOrders(orders);
  }, [activeTab, searchQuery, transactions]);

  if (filteredOrders.length === 0) {
    return (
      <p className="text-center text-gray-500">No matching orders found.</p>
    );
  }

  return (
    <>
      {filteredOrders.map((order) => {
        // Calculate the total number of items in the order
        const totalItems = order.order_items.reduce(
          (acc, item) => acc + item.quantity,
          0,
        );

        return (
          <div
            key={order.order_id}
            className="bg-gray-100 border border-gray-200 rounded-lg shadow-md p-4 mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="text-gray-700 font-medium">
                Order ID #{order.order_id}
              </div>
              <div
                className={`text-${
                  order.order_status_name === "Completed" ? "green" : "red"
                }-600 font-medium`}
              >
                {order.order_status_name === "Completed"
                  ? "Parcel has been delivered"
                  : "Parcel is on the way"}
              </div>
            </div>

            {order.order_items.map((product) => {
              // Generate image URL
              const imageName = product.image
                ? product.image.split("/").pop()
                : null;
              const imageUrl = imageName
                ? `http://localhost:3001/uploads/${imageName}`
                : `https://via.placeholder.com/150?text=No+Image+Available`;

              return (
                <div key={product.variation_id} className="flex gap-4 mb-4">
                  <div className="flex w-full">
                    <img
                      src={imageUrl}
                      alt={product.product_name || "Product Image"}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-4 flex-grow">
                      <div className="font-bold text-gray-800">
                        {product.product_name || "Product Name"}
                      </div>
                      <div className="text-gray-600">
                        x{product.quantity}
                        {product.value && product.value != "N/A"
                          ? ` ${product.value}`
                          : ""}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-800">
                        ₱
                        {product.item_subtotal.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                      </div>
                      <div className="text-gray-600">
                        SKU: {product.sku || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="border-t border-gray-200 pt-4">
              <div className="flex flex-col items-end mb-4">
                <div className="text-gray-600 text-sm">
                  Total {totalItems} items
                </div>
                <div className="text-pink-600 font-bold text-xl">
                  ₱
                  {order.total_amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                </div>
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
      })}
    </>
  );
};

// Adding propTypes for props validation
TransactionCard.propTypes = {
  activeTab: PropTypes.string.isRequired,
  searchQuery: PropTypes.string.isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      order_id: PropTypes.number.isRequired,
      order_status_name: PropTypes.string.isRequired,
      order_items: PropTypes.arrayOf(
        PropTypes.shape({
          variation_id: PropTypes.number.isRequired,
          product_name: PropTypes.string,
          quantity: PropTypes.number.isRequired,
          unit_price: PropTypes.number,
          item_subtotal: PropTypes.number,
          image: PropTypes.string,
          value: PropTypes.string,
          sku: PropTypes.string,
        }),
      ).isRequired,
      total_amount: PropTypes.number,
    }),
  ).isRequired,
};

export default TransactionCard;
