import { useContext, useState } from 'react';
import { CartContext } from '../components/CartContext.jsx';
import { IoChevronBack } from "react-icons/io5";

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

  const total = subtotal;


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    
    console.log('Form Data:', formData);
    console.log('Cart Items:', cartItems);
  };

  return (
    <div className="pt-20 bg-[url('../../public/images/body-bg.png')] bg-cover bg-center min-h-screen p-8 flex flex-col items-center">
      <div className="flex flex-col lg:flex-row p-8 justify-between">
        <div className="w-full lg:w-2/3">
          <div className="mb-8">
            <button onClick={() => window.location.href = '/shoppingcart'}
            className="text-gray-500 font-bold hover:underline flex items-center">
            <IoChevronBack />
            </button>
          </div>
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-alofa-pink">Account</h2>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full p-2 mb-4 border rounded-md"
            />
            <h2 className="text-xl font-bold mb-4 text-alofa-pink">Shipping Information</h2>
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                className="w-1/2 p-2 border rounded-md"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="w-1/2 p-2 border rounded-md"
              />
            </div>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="w-full p-2 mb-4 border rounded-md"
            />
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                name="barangay"
                value={formData.barangay}
                onChange={handleInputChange}
                placeholder="Barangay"
                className="w-1/2 p-2 border rounded-md"
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                className="w-1/2 p-2 border rounded-md"
              />
            </div>
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                placeholder="Province"
                className="w-1/2 p-2 border rounded-md"
              />
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="Postal Code"
                className="w-1/2 p-2 border rounded-md"
              />
            </div>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone"
              className="w-full p-2 mb-4 border rounded-md"
            />
            <h2 className="text-xl font-bold mb-4 text-alofa-pink">Payment</h2>
            <div className="flex gap-4 mb-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="gcash"
                  checked={formData.paymentMethod === 'gcash'}
                  onChange={handleInputChange}
                />
                {/* to insert gcash logos */}
                <img src="/gcash.png" alt="GCash" className="w-10" />
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  checked={formData.paymentMethod === 'bank'}
                  onChange={handleInputChange}
                />
                {/* insert bank logos */}
                <img src="/bank.png" alt="Bank Transfer" className="w-10" />
              </label>
            </div>
            <button
              onClick={handleSubmit}
              className="font-extrabold text-white w-full py-2 rounded-full focus:outline-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] hover:to-[#FE699F]"
            >
              COMPLETE ORDER
            </button>
          </div>
        </div>
        <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-xl font-bold mb-6 text-alofa-pink">Orders</h2>


          {cartItems.map((item, index) => (
            <div key={index} className="flex items-center mb-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
              <div className="flex justify-between w-full">
                <span>{`1x ${item.name}`}</span>
                <span>{`₱${item.price.toFixed(2)}`}</span>
              </div>
            </div>
          ))}

          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>{`₱${subtotal.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>₱150.00</span>
            </div>
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>{`₱${total.toFixed(2)}`}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;