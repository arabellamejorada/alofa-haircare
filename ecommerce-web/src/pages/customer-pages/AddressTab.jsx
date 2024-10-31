import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import NewAddressModal from './customer-modals/NewAddressModal.jsx';
import EditAddressModal from './customer-modals/EditAddressModal.jsx'; // Import the edit modal

const AddressTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Arabella Mejorada',
      phone: '(+63) 939 178 2108',
      street: 'Purok Papaya',
      barangay: 'Mankilam',
      city: 'Tagum City',
      province: 'Davao del Norte',
      region: 'Region 11',
      postalCode: '8100',
    },
    {
      id: 2,
      name: 'Arabella Mejorada',
      phone: '(+63) 939 178 2108',
      street: 'Purok Papaya',
      barangay: 'Mankilam',
      city: 'Tagum City',
      province: 'Davao del Norte',
      region: 'Region 11',
      postalCode: '8100',
    },
  ]);

  // Function to open the new address modal
  const handleAddNewAddress = () => {
    setIsModalOpen(true);
  };

  // Function to close the new address modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Function to add a new address
  const handleSaveNewAddress = (newAddress) => {
    setAddresses((prevAddresses) => [
      ...prevAddresses,
      { ...newAddress, id: prevAddresses.length + 1 }, // Assign a new ID
    ]);
    setIsModalOpen(false);
  };

  // Function to open the edit address modal
  const handleOpenEditModal = (address) => {
    setSelectedAddress(address);
    setIsEditModalOpen(true);
  };

  // Function to close the edit address modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAddress(null);
  };

  // Function to save the edited address
  const handleSaveEditedAddress = (updatedAddress) => {
    setAddresses((prevAddresses) =>
      prevAddresses.map((address) =>
        address.id === updatedAddress.id ? updatedAddress : address
      )
    );
    setIsEditModalOpen(false);
  };

  return (
    <div className="px-8 py-5 lg:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="bg-gradient-to-b from-alofa-pink via-alofa-pink to-alofa-light-pink bg-clip-text text-transparent font-extrabold text-4xl">
          My Address
        </h2>
        <button
          onClick={handleAddNewAddress}
          className="flex items-center px-4 py-2 font-bold text-white rounded-full focus:outline-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] hover:to-[#FE699F]"
        >
          <FaPlus className="mr-2" />
          Add New Address
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-8">Last updated: 16 Oct 2024 22:54</p>

      {/* Address List */}
      <div className="space-y-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="p-4 bg-white rounded-lg shadow border border-gray-200 flex justify-between items-start"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{address.name}</h3>
              <span className="text-gray-500">{address.phone}</span>
              <p className="text-sm text-gray-500">{address.street}</p>
              <p className="text-sm text-gray-500">{address.barangay}, {address.city}, {address.province}, {address.region}, {address.postalCode}</p>
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleOpenEditModal(address)}
                className="text-sm text-pink-500 hover:underline focus:outline-none"
              >
                Edit
              </button>
              <button className="text-sm text-pink-500 hover:underline focus:outline-none">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Address Modal */}
      {isModalOpen && <NewAddressModal onClose={handleCloseModal} onSave={handleSaveNewAddress} />}

      {/* Edit Address Modal */}
      {isEditModalOpen && (
        <EditAddressModal
          address={selectedAddress}
          onClose={handleCloseEditModal}
          onSave={handleSaveEditedAddress}
        />
      )}
    </div>
  );
};

export default AddressTab;
