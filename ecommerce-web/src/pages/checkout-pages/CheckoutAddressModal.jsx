import { useState } from 'react';
import PropTypes from 'prop-types';

const CheckoutAddressModal = ({ onClose, onSelectAddress, addresses }) => {
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
  };

  const handleConfirmSelection = () => {
    if (selectedAddressId !== null) {
      onSelectAddress(selectedAddressId);
      onClose();
    } else {
      alert('Please select an address before proceeding.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative z-60">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold mb-6 text-alofa-pink">Select Shipping Address</h2>
        <div className="overflow-y-auto max-h-64 mb-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              onClick={() => handleAddressSelect(address.id)}
              className={`p-4 mb-2 border cursor-pointer rounded-lg ${
                selectedAddressId === address.id ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{address.name}</h3>
              <span className="text-sm text-gray-500">{address.phone}</span>
              <p className="text-sm text-gray-500 mt-1">{address.street}</p>
              <p className="text-sm text-gray-500">{address.barangay}, {address.city}, {address.province}, {address.region}, {address.postalCode}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-full focus:outline-none hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmSelection}
            className="px-4 py-2 bg-pink-500 text-white rounded-full focus:outline-none hover:bg-pink-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

CheckoutAddressModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSelectAddress: PropTypes.func.isRequired,
  addresses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      street: PropTypes.string.isRequired,
      barangay: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      province: PropTypes.string.isRequired,
      region: PropTypes.string.isRequired,
      postalCode: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CheckoutAddressModal;
