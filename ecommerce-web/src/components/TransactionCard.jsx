import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from './axios';

const TransactionCard = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/order/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };
    
    fetchOrder();
  }, [orderId]);

  if (!order) {
    return <div>no</div>;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-700 font-semibold">Order ID #{order.id}</div>
        <div className={`text-${order.status === 'delivered' ? 'green' : 'red'}-600 font-medium`}>{order.status === 'delivered' ? 'Parcel has been delivered' : 'Parcel is on the way'}</div>
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

      <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
        <div className="text-pink-600 font-semibold">Order Total: ₱{order.total}</div>
        <div className="flex gap-2">
          <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded">
            Buy Again
          </button>
          <button className="border border-pink-500 hover:bg-gray-100 hover:underline text-gray-700 font-semibold py-2 px-4 rounded">
            Request Return/Refund
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
