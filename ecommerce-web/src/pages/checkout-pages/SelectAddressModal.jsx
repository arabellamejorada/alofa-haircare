import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getShippingAddressesByCustomerId } from "../../api/customer.js";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

const SelectAddressModal = ({ profileData, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const customer_id = profileData.customer_id;
        console.log("customer_id", customer_id);
        if (!customer_id) {
          throw new Error("Customer ID not found");
        }

        // Fetch addresses
        const addresses = await getShippingAddressesByCustomerId(customer_id);
        if (addresses.length === 0) {
          setAddresses([]);
        } else {
          setAddresses(addresses);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setAddresses([]);
          console.log("No addresses found for this customer.");
          toast.error("No addresses found for this customer.");
        } else {
          console.error("Error fetching addresses:", error);
          toast.error("Error fetching addresses.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleSelectAddress = (addressId) => {
    setSelectedAddressId(addressId);
  };

  const handleSaveAddress = () => {
    if (selectedAddressId) {
      const selectedAddress = addresses.find(
        (address) => address.shipping_address_id === selectedAddressId,
      );

      onSave(selectedAddress);
      onClose();
    } else {
      toast.error("Please select an address.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none focus:ring focus:ring-pink-200 rounded-full"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-alofa-pink mb-4">
          Select Address
        </h2>
        {loading ? (
          <div className="flex justify-center items-center">
            <ClipLoader size={50} color="#E53E3E" loading={loading} />
          </div>
        ) : addresses.length === 0 ? (
          <p className="text-gray-500">
            No addresses found. Please add a new address.
          </p>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.shipping_address_id}
                className={`p-4 border rounded-lg cursor-pointer flex items-start space-x-4 ${
                  selectedAddressId === address.shipping_address_id
                    ? "border-pink-500"
                    : "border-gray-200"
                }`}
                onClick={() => handleSelectAddress(address.shipping_address_id)}
              >
                <input
                  type="radio"
                  checked={selectedAddressId === address.shipping_address_id}
                  onChange={() =>
                    handleSelectAddress(address.shipping_address_id)
                  }
                  className="mt-1"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {address.first_name} {address.last_name}
                  </h3>
                  <span className="text-gray-500">{address.phone_number}</span>
                  <p className="text-sm text-gray-500">
                    {address.address_line},
                    {address.barangay?.name ? ` ${address.barangay.name},` : ""}
                    {address.city?.name ? ` ${address.city.name},` : ""}
                    {address.province?.name ? ` ${address.province.name},` : ""}
                    {address.region?.name ? ` ${address.region.name}, ` : ""}
                    {address.zip_code}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveAddress}
            className="bg-pink-500 text-white py-2 px-6 rounded-lg shadow hover:bg-pink-600 focus:outline-none"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

SelectAddressModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default SelectAddressModal;
