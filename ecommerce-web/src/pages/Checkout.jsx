import { useContext, useState } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import GCashLogo from '../../../public/static/gcash-logo.svg';
import { CartContext } from '../components/CartContext.jsx';

const Checkout = () => {
  const { cartItems, subtotal } = useContext(CartContext);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    barangay: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
    paymentMethod: '',
  });

  const total = subtotal + 150;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    console.log('Cart Items:', cartItems);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col lg:flex-row w-full h-full bg-white">
        {/* Customer Info Section */}
        <div className="w-full lg:w-2/4 p-16 flex flex-col justify-between h-full mx-auto max-w-5xl">
          <div className="mb-8 flex items-center gap-4">
            <button
              onClick={() => window.location.href = '/shoppingcart'}
              className="text-gray-500 font-bold hover:underline flex items-center"
            >
              <IoChevronBack className="h-6 w-6" />
            </button>
            <h1 className="text-4xl font-bold font-title bg-gradient-to-b from-alofa-pink to-alofa-light-pink bg-clip-text text-transparent">alofa</h1>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-500">Account</h2>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full p-3 mb-4 border rounded-md"
            />
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-500">Shipping Information</h2>
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                className="w-1/2 p-3 border rounded-md"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="w-1/2 p-3 border rounded-md"
              />
            </div>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="w-full p-3 mb-4 border rounded-md"
            />
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                name="barangay"
                value={formData.barangay}
                onChange={handleInputChange}
                placeholder="Barangay"
                className="w-1/2 p-3 border rounded-md"
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                className="w-1/2 p-3 border rounded-md"
              />
            </div>
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                placeholder="Province"
                className="w-1/2 p-3 border rounded-md"
              />
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="Postal Code"
                className="w-1/2 p-3 border rounded-md"
              />
            </div>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone"
              className="w-full p-3 mb-4 border rounded-md"
            />
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-500">Payment</h2>
            <div className="flex gap-4 mb-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="gcash"
                  checked={formData.paymentMethod === 'gcash'}
                  onChange={handleInputChange}
                />
                <img src={GCashLogo} alt="GCash Logo" className="w-20" />
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  checked={formData.paymentMethod === 'bank'}
                  onChange={handleInputChange}
                />
                <img src="/bank.png" alt="Bank Transfer" className="w-20" />
              </label>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full h-15 font-extrabold text-white py-2 px-4 rounded-full focus:outline-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] hover:to-[#FE699F]"
            >
              COMPLETE ORDER
            </button>
          </div>
        </div>

        {/* Orders Section */}
        <div className="w-full lg:w-1/4 p-8 bg-pink-100 flex flex-col justify-between h-full mx-auto max-w-md">
          <h2 className="text-xl font-bold mb-6 text-pink-500">Orders</h2>
          <div className="overflow-y-auto max-h-96 mb-4">
            {cartItems.map((item, index) => (
              <div key={index} className="flex items-center mb-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
                <div className="flex justify-between w-full">
                  <span>{`1x ${item.name}`}</span>
                  <span>{`₱${item.price.toFixed(2)}`}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>{`₱${subtotal.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span>₱150.00</span>
            </div>
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>{`₱${total.toFixed(2)}`}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;