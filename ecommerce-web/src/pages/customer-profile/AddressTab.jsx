
import { FaPlus } from 'react-icons/fa';

const AddressTab = () => {
  const addresses = [
    {
      id: 1,
      name: 'Arabella Mejorada',
      phone: '(+63) 939 178 2108',
      street: 'Purok Papaya',
      city: 'Maniklam, Tagum City, Davao del Norte, Region 11, 8100',
    },
    {
      id: 2,
      name: 'Arabella Mejorada',
      phone: '(+63) 939 178 2108',
      street: 'Purok Papaya',
      city: 'Maniklam, Tagum City, Davao del Norte, Region 11, 8100',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-pink-500">My Address</h2>
        <button className="flex items-center px-4 py-2 bg-pink-500 text-white font-medium rounded-md shadow hover:bg-pink-600 focus:outline-none">
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
              <h3 className="text-lg font-semibold text-gray-800">
                {address.name}
              </h3>
              <span className="text-gray-500">{address.phone}</span>
              <p className="text-sm text-gray-700">{address.street}</p>
              <p className="text-sm text-gray-500">{address.city}</p>
            </div>
            <div className="flex space-x-4">
              <button className="text-sm text-pink-500 hover:underline focus:outline-none">
                Edit
              </button>
              <button className="text-sm text-pink-500 hover:underline focus:outline-none">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressTab;
