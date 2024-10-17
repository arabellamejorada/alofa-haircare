import { useContext, useState } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import GCashLogo from '../../../public/static/gcash-logo.svg';
import BPILogo from '../../../public/static/bpi-logo.svg';
import GCashQR from '../../../public/static/gcash-qr.jpg';
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
        <div className="w-full lg:w-2/3 p-10 ml-20 flex flex-col justify-between h-full mx-auto overflow-y-auto">
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={() => window.location.href = '/shoppingcart'}
              className="text-gray-500 font-bold hover:underline flex items-center"
            >
              <IoChevronBack className="h-6 w-9" />
            </button>
            <h1 className="text-4xl font-bold font-title bg-gradient-to-b from-alofa-pink to-alofa-light-pink bg-clip-text text-transparent">alofa</h1>
          </div>
          <div className="mb-2">
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
          <div className="mb-2">
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
            <div className="accordion overflow-hidden">
              {/* gcash */}
              <div className="border p-4 mb-4 cursor-pointer transition-all duration-700 ease-in-out" 
                onClick={() => { setFormData({ ...formData, paymentMethod: formData.paymentMethod === 'gcash' ? '' : 'gcash' });
                document.querySelector('.accordion').scrollIntoView({ behavior: 'smooth', block: 'center' }); }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold">Gcash</span>
                  <img src={GCashLogo} alt="GCash Logo" className="w-10" />
                </div>
                {formData.paymentMethod === 'gcash' && (
                <div className="mt-4 transition-max-height duration-700 ease-in-out overflow-hidden max-h-[500px]">
                  <p className="text-sm mb-2">Please scan the QR code below to complete the payment:</p>
                  <img src={GCashQR} alt="GCash QR Code" className="w-32 h-32 mb-4" />
                  <button className="bg-gray-800 text-white py-2 px-4 rounded flex items-center gap-2">
                    Upload receipt
                  </button>
                </div>
                )}
              </div>
              {/* bank transfer */}
              <div className="border p-4 mb-4 cursor-pointer transition-all duration-700 ease-in-out"
                onClick={() => { setFormData({ ...formData, paymentMethod: formData.paymentMethod === 'bank' ? '' : 'bank' });
                document.querySelector('.accordion').scrollIntoView({ behavior: 'smooth', block: 'center' }); }}>
                <div className="flex justify-between items-center">
                  <span className="font-bold">Bank Transfer</span>
                  <img src={BPILogo} alt="Bank Transfer Logo" className="w-10" />
                </div>
                {formData.paymentMethod === 'bank' && (
                  <div className="mt-4">
                    <p className="text-sm mb-2">Bank details for transfer:</p>
                    <p className="text-sm">Bank Name: <b>Bank of the Philippine Islands</b></p>
                    <p className="text-sm">Account Number: <b>1234-5678-9012</b></p>
                    <p className="text-sm">Account Name: Alofa Haircare</p>
                    <button className="bg-gray-600 text-white py-2 px-4 rounded flex items-center gap-2 mt-4">
                      Upload receipt
                    </button>
                  </div>
                )}
              </div>
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
        <div className="w-full lg:w-1/3 p-8 bg-alofa-pink flex flex-col justify-between h-full mx-auto shadow-sm shadow-slate-400">
        {/* bg-gradient-to-b from-[#FF82AF] via-[#FF82AF] to-[#FFCED9] */}
          <h2 className="text-3xl font-extrabold font-body mb-6 text-white">Orders</h2>
          <div className="overflow-y-auto max-h-96 mb-4">
            {cartItems.map((item, index) => (
              <div key={index} className="flex items-center mb-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded mr-4 shadow-sm" />
                <div className="flex justify-between w-full text-white">
                  <span>{`${item.quantity}x ${item.name}`}</span>
                  <span className="font-bold">{`₱${item.price.toFixed(2)}`}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 mt-auto text-white">
            <div className="flex justify-between mb-2 ">
              <span>Subtotal</span>
              <span>{`₱${subtotal.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping Fee</span>
              {/* to edit; for placeholder only */}
              <span>₱150.00</span>
            </div>
            <div className="flex justify-between text-3xl font-bold">
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