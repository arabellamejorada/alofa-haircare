import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import RefundModal from "./RefundModal";
import { updateOrderStatus, checkIfOrderIdExists } from "../api/order";
import { toast } from "sonner";

const TransactionCard = ({
  activeTab,
  order,
  setLoading,
  setTransactions,
  refund,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isRefundEligible, setIsRefundEligible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const totalItems =
    activeTab !== "For Refund"
      ? order.order_items.reduce((acc, item) => acc + item.quantity, 0)
      : refund.refund_items.reduce((acc, item) => acc + item.quantity, 0);

  if (activeTab === "For Refund") {
    order = refund;
  }

  useEffect(() => {
    const checkEligibility = async () => {
      if (!order.date_delivered) {
        setIsRefundEligible(false);
        return;
      }
      const currentDate = new Date();
      const deliveredDate = new Date(order.date_delivered);
      const differenceInTime = currentDate - deliveredDate;
      const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);

      if (differenceInDays > 7) {
        setIsRefundEligible(false);
        return;
      }

      try {
        const refundExists = await checkIfOrderIdExists(order.order_id);
        setIsRefundEligible(!refundExists);
      } catch (error) {
        console.error("Error checking refund eligibility:", error);
        setIsRefundEligible(false);
      }
    };

    checkEligibility();
  }, [order.date_delivered, order.order_id]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const openRefundModal = () => setIsRefundModalOpen(true);
  const closeRefundModal = () => setIsRefundModalOpen(false);

  const handleOrderReceived = async (orderId) => {
    try {
      setIsUpdating(true);
      setLoading(true);
      await updateOrderStatus(orderId, 4);
      toast.success("Order has been received!");
      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction.order_id === orderId
            ? { ...transaction, order_status_name: "Completed" }
            : transaction,
        ),
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status. Please try again.");
    } finally {
      setLoading(false);
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-lg p-4 mb-6">
      {/* Order Info Section */}
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-300">
        <div>
          <div className="text-gray-500 font-normal text-xs mb-0">
            {activeTab === "Completed" ? (
              <>Order Completed: {order.date_delivered}</>
            ) : (
              ""
            )}
          </div>
          <div className="text-gray-500 font-normal text-xs mb-0">
            {activeTab === "For Refund" ? "Refund Placed: " : "Order Placed: "}
            {activeTab === "For Refund"
              ? refund.requested_at
              : order.date_ordered}
          </div>
        </div>
        <div
          className={`font-normal ${
            activeTab === "For Refund"
              ? refund.refund_status_name === "Completed"
                ? "text-green-600"
                : refund.refund_status_name === "Pending"
                  ? "italic text-orange-400"
                  : refund.refund_status_name === "Cancelled"
                    ? "text-red-600"
                    : "italic text-gray-600"
              : order.order_status_name === "Completed"
                ? "text-green-600"
                : order.order_status_name === "Pending"
                  ? "italic text-orange-400"
                  : order.order_status_name === "Cancelled"
                    ? "text-red-600"
                    : "italic text-gray-600"
          }`}
        >
          {activeTab === "For Refund"
            ? refund.refund_status_name
            : order.order_status_name}
        </div>
      </div>

      {/* Order Items */}
      {(activeTab === "For Refund" ? refund.refund_items : order.order_items)
        .slice(
          0,
          isExpanded
            ? activeTab === "For Refund"
              ? refund.refund_items.length
              : order.order_items.length
            : 2,
        )
        .map((product) => {
          const imageName = product.image
            ? product.image.split("/").pop()
            : null;
          const imageUrl = imageName
            ? `http://localhost:3001/uploads/${imageName}`
            : `https://via.placeholder.com/150?text=No+Image+Available`;

          return (
            <div key={product.variation_id} className="flex gap-4 mb-7">
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
      {(activeTab === "For Refund" ? refund.refund_items : order.order_items)
        .length > 2 && (
        <div className="flex justify-center text-center mb-8">
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
      <div className="bg-gray-100 p-4 rounded-b-lg -m-4 border-t-[1px] border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="text-base">
            <div className="font-normal text-sm mb-0">
              {activeTab === "For Refund" ? "Refund ID #" : "Order ID #"}
              {activeTab === "For Refund"
                ? refund.refund_request_id
                : order.order_id}
            </div>
            {(activeTab === "To Receive" || activeTab === "Completed") &&
              order.tracking_number && (
                <div className="font-normal text-sm mb-0">
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
              {(activeTab === "For Refund"
                ? refund.total_refund_amount
                : order.total_amount
              ).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          {activeTab === "To Receive" &&
            order.order_status_name === "Shipped" && (
              <button
                className="bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] hover:to-[#FE699F] text-white font-semibold py-2 px-4 rounded"
                onClick={() => handleOrderReceived(order.order_id)}
                disabled={isUpdating}
              >
                {isUpdating ? "Processing..." : "Order Received"}
              </button>
            )}
          {activeTab === "Completed" && isRefundEligible && (
            <button
              onClick={openRefundModal}
              className="border border-pink-500 hover:bg-gray-100 hover:underline text-gray-700 font-medium py-2 px-4 rounded"
            >
              Request Refund
            </button>
          )}
        </div>
      </div>

      {/* Refund Modal */}
      {activeTab !== "For Refund" && (
        <RefundModal
          isOpen={isRefundModalOpen}
          closeModal={closeRefundModal}
          orderItems={order?.order_items || []}
          selectedOrder={order || {}}
        />
      )}
    </div>
  );
};

TransactionCard.propTypes = {
  activeTab: PropTypes.string.isRequired,
  order: PropTypes.shape({
    order_id: PropTypes.number.isRequired,
    date_ordered: PropTypes.string.isRequired,
    date_delivered: PropTypes.string,
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
  setLoading: PropTypes.func.isRequired,
  setTransactions: PropTypes.func.isRequired,
  refund: PropTypes.shape({
    refund_items: PropTypes.arrayOf(
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
    refund_request_id: PropTypes.number.isRequired,
    requested_at: PropTypes.string.isRequired,
    refund_status_name: PropTypes.string.isRequired,
    total_refund_amount: PropTypes.number.isRequired,
  }).isRequired,
};

export default TransactionCard;
