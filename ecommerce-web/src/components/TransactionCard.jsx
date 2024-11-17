import { useState } from "react";
import PropTypes from "prop-types";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import RefundModal from "./RefundModal";

const TransactionCard = ({ activeTab, order }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalItems = order.order_items.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const openRefundModal = () => setIsRefundModalOpen(true);
  const closeRefundModal = (e) => {
    e.preventDefault();
    setIsRefundModalOpen(false);
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-lg p-4 mb-6">
      {/* Order Info Section */}
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-300">
        <div>
          <div className="text-gray-500 font-normal mb-0">
            Order placed: {order.date_ordered}
          </div>
        </div>
        <div
          className={`font-normal ${
            order.order_status_name === "Completed"
              ? "text-green-600"
              : order.order_status_name === "Pending"
                ? "italic text-orange-400"
                : "italic text-gray-600"
          }`}
        >
          {order.order_status_name}
        </div>
      </div>

      {/* Order Items */}
      {order.order_items
        .slice(0, isExpanded ? order.order_items.length : 2)
        .map((product) => {
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
                    {product.value && product.value !== "N/A"
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
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      {/* View More Button */}
      {order.order_items.length > 2 && (
        <div className="flex justify-center text-center mb-4">
          <button
            onClick={toggleExpanded}
            className="text-gray-500 hover:text-gray-600 font-normal flex items-center justify-center"
          >
            {isExpanded ? (
              <>
                View Less <IoIosArrowUp className="ml-1" />
              </>
            ) : (
              <>
                View More <IoIosArrowDown className="ml-1" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Total Section */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-base">
            <div className="text-gray-500 font-normal mb-1">
              Order ID #{order.order_id}
            </div>
            {(activeTab === "To Receive" || activeTab === "Completed") && (
              <div className="text-gray-500 font-normal mb-1">
                Tracking Number: {order.tracking_number} (J&T Express)
              </div>
            )}
          </div>
          <div className="flex flex-col items-end">
            <div className="text-gray-600 text-sm">
              Total {totalItems} {totalItems === 1 ? "item" : "items"}
            </div>
            <div className="text-alofa-pink font-bold text-xl">
              ₱
              {order.total_amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>
        {order.order_status_name !== "Pending" && (
          <div className="flex gap-2 justify-end">
            {order.order_status_name === "Shipped" && (
              <button
                className="bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] hover:to-[#FE699F] text-white font-semibold py-2 px-4 rounded"
                onClick={() => handleOrderReceived(order.id)}
              >
                Order Received
              </button>
            )}
            <button
              onClick={openRefundModal}
              className="border border-pink-500 hover:bg-gray-100 hover:underline text-gray-700 font-medium py-2 px-4 rounded"
            >
              Request Refund
            </button>
          </div>
        )}
      </div>

      <RefundModal
        isOpen={isRefundModalOpen}
        closeModal={closeRefundModal}
        orderItems={order.order_items}
        selectedOrder={order}
      />
    </div>
  );
};

TransactionCard.propTypes = {
  activeTab: PropTypes.string.isRequired,
  order: PropTypes.shape({
    order_id: PropTypes.number.isRequired,
    date_ordered: PropTypes.string.isRequired,
    tracking_number: PropTypes.string,
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
    total_amount: PropTypes.number.isRequired,
  }).isRequired,
};

export default TransactionCard;
