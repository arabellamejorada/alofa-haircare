import { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

const Receipt = ({ orderDetails }) => {
  const [orderDate, setOrderDate] = useState(null);
  const location = useLocation();

  const paymentMethod =
    orderDetails?.order.payment_method || location.state?.paymentMethod || "";
  const discount =
    orderDetails?.total_discount || location.state?.total_discount || 0;
  const orderID = orderDetails.order.order_id;
  const shippingFee = 200; // Assuming fixed shipping fee for now
  const total = orderDetails.order.total_amount;
  const subtotal = orderDetails.order.subtotal;
  const orderItems = orderDetails.order_items;

  useEffect(() => {
    setOrderDate(new Date());
    console.log("Receipt orderDetails:", orderDetails);
  }, []);

  const formatOrderDate = (date) => {
    if (!date) return "";
    return date
      .toLocaleString("en-PH", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Manila",
      })
      .replace(",", "");
  };

  return (
    <div className="relative max-w-lg mx-auto rounded-lg p-6 mt-10 z-20 shadow-xl bg-white">
      <div className="absolute w-[110%] left-1/2 transform shadow-md -translate-x-1/2 -top-4 h-4 bg-gray-200 rounded-t-full z-0"></div>
      <div
        style={{ bottom: "-1.85rem" }}
        className={`absolute -bottom-8 left-0 right-0 h-8 bg-white z-10 zigzag`}
      ></div>
      <h2 className="text-3xl font-bold text-alofa-pink mb-6 font-heading text-left">
        Order Summary
      </h2>
      <div className="flex justify-between border-dashed border-b border-gray-300 pb-4 mb-4">
        <div className="flex flex-col items-start">
          <p className="text-sm text-gray-600">Date</p>
          <p className="font-semibold text-gray-800">
            {orderDate ? formatOrderDate(orderDate) : ""}
          </p>
        </div>
        <div className="border-l border-gray-300 mx-1"></div>
        <div className="flex flex-col items-start">
          <p className="text-sm text-gray-600">Order ID</p>
          <p className="font-semibold text-gray-800">#{orderID}</p>
        </div>
        <div className="border-l border-gray-300 mx-1"></div>
        <div className="flex flex-col items-start">
          <p className="text-sm text-gray-600">Payment Method</p>
          <p className="font-semibold text-gray-800">{paymentMethod}</p>
        </div>
      </div>

      <div className="overflow-y-auto max-h-64 mb-4">
        {orderItems.map((item, index) => {
          // Generate image URL
          const imageName = item.image ? item.image.split("/").pop() : null;
          const imageUrl = imageName
            ? `http://localhost:3001/uploads/${imageName}`
            : `https://via.placeholder.com/150?text=No+Image+Available`;

          return (
            <div key={index} className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <img
                  src={imageUrl}
                  alt={item.product_name}
                  className="w-16 h-16 object-cover rounded mr-4"
                />
                <div>
                  <p className="text-gray-800 font-semibold">
                    {item.product_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Variation: {item.variation_value || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">x{item.quantity}</p>
                </div>
              </div>
              <p className="text-gray-800 font-semibold">
                ₱{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-300 pt-4 mt-4">
        <div className="flex justify-between text-gray-700 mb-2">
          <span>Subtotal</span>
          <span>
            ₱
            {subtotal.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="flex justify-between text-gray-700 mb-2">
          <span>Shipping Fee</span>
          <span>
            ₱
            {shippingFee.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="flex justify-between text-gray-700 mb-2">
          <span>Discount</span>
          <span>
            -₱
            {discount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="flex justify-between font-bold text-2xl mt-4">
          <span>Total</span>
          <span>
            ₱
            {total.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

Receipt.propTypes = {
  orderDetails: PropTypes.shape({
    paymentMethod: PropTypes.string,
    discount: PropTypes.number,
    billingAddress: PropTypes.shape({
      name: PropTypes.string,
      address: PropTypes.string,
      phone: PropTypes.string,
      email: PropTypes.string,
    }),
  }),
};

export default Receipt;
