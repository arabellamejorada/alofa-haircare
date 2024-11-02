import { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { CartContext } from '../components/CartContext';

const Receipt = ({ orderDetails }) => {
  const { cartItems, subtotal } = useContext(CartContext);
  const [orderDate, setOrderDate] = useState(null);
  const orderID = '0001'; // Placeholder for now
  const paymentMethod = orderDetails?.paymentMethod || '';
  const shippingFee = 150; // Assuming fixed shipping fee for now
  const discount = orderDetails?.discount || 0;

  useEffect(() => {
    // Set order date when the component mounts
    setOrderDate(new Date());
  }, []);

  // Format order date to '02 Nov 2024, 6:09 PM' in Philippines timezone
  const formatOrderDate = (date) => {
    if (!date) return '';
    return date.toLocaleString('en-PH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Manila',
    }).replace(',', '');
  };

  // Calculate total amount
  const total = subtotal + shippingFee - discount;

  return (
    <div className="relative max-w-lg mx-auto rounded-lg p-6 mt-10 z-20 shadow-xl">
        <div 
            style={{bottom: '-1.85rem'}}
            className={`absolute -bottom-8 left-0 right-0 h-8 bg-white z-10 zigzag`}>
        </div>
        <h2 className="text-3xl font-bold text-pink-600 mb-6 font-heading text-left">Order Summary</h2>
            <div className="flex justify-between border-dashed border-b border-gray-300 pb-4 mb-4">
                <div className="flex flex-col items-start">
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold text-gray-800">{orderDate ? formatOrderDate(orderDate) : ''}</p>
                </div>
                <div className="border-l border-gray-300 mx-1"></div>
                <div className="flex flex-col items-start">
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-semibold text-gray-800">{orderID}</p>
                </div>
                <div className="border-l border-gray-300 mx-1"></div>
                <div className="flex flex-col items-start">
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-semibold text-gray-800">{paymentMethod}</p>
                </div>
            </div>

      {cartItems.map((item, index) => (
        <div key={index} className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
            <div>
              <p className="text-gray-800 font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">Variation: {item.variant || 'N/A'}</p>
              <p className="text-sm text-gray-500">x{item.quantity}</p>
            </div>
          </div>
          <p className="text-gray-800 font-semibold">₱{(item.unit_price * item.quantity).toLocaleString()}</p>
        </div>
      ))}

      <div className="border-t border-gray-300 pt-4 mt-4">
        <div className="flex justify-between text-gray-700 mb-2">
          <span>Subtotal</span>
          <span>₱{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-700 mb-2">
          <span>Shipping Fee</span>
          <span>₱{shippingFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-700 mb-2">
          <span>Discount</span>
          <span>-₱{discount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-bold text-2xl mt-4">
          <span>Total</span>
          <span>₱{total.toLocaleString()}</span>
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
