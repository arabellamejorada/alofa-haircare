import { useContext, useState, useEffect, useCallback, useMemo } from "react";
import { CartContext } from "../components/CartContext.jsx";
import CheckoutAddressModal from './CheckoutAddressModal.jsx';
import GCashLogo from "../../../public/static/gcash-logo.svg";
import BPILogo from "../../../public/static/bpi-logo.svg";
import GCashQR from "../../../public/static/gcash-qr.jpg";
import axios from "axios";
import { FaRegAddressCard } from "react-icons/fa";

const Checkout = () => {
  const { cartItems, subtotal } = useContext(CartContext);
  const [formDetails, setFormDetails] = useState({
    email: "",
    region: "",
    province: "",
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    barangay: "",
    phoneNumber: "",
    paymentMethod: "",
  });

  // State for Regions, Provinces, Cities, and Barangays
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  // Memoize region mapping to prevent unnecessary re-renders
  const regionMapping = useMemo(
    () => ({
      "Ilocos Region": "Region 1",
      "Cagayan Valley": "Region 2",
      "Central Luzon": "Region 3",
      CALABARZON: "Region 4-A",
      "MIMAROPA Region": "Region 4-B",
      "Bicol Region": "Region 5",
      "Western Visayas": "Region 6",
      "Central Visayas": "Region 7",
      "Eastern Visayas": "Region 8",
      "Zamboanga Peninsula": "Region 9",
      "Northern Mindanao": "Region 10",
      "Davao Region": "Region 11",
      SOCCSKSARGEN: "Region 12",
      Caraga: "Region 13",
      "National Capital Region (NCR)": "NCR",
      "Cordillera Administrative Region (CAR)": "CAR",
      "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)": "BARMM",
    }),
    [],
  );

  // Wrap fetchRegions in useCallback
  const fetchRegions = useCallback(async () => {
    try {
      const response = await axios.get("https://psgc.gitlab.io/api/regions/");
      const mappedRegions = response.data.map((region) => ({
        ...region,
        name: regionMapping[region.name] || region.name,
      }));
      setRegions(mappedRegions);
    } catch (error) {
      console.error("Error fetching regions:", error);
    }
  }, [regionMapping]);

  // Fetch regions when the component mounts
  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  // Fetch provinces based on the selected region
  const fetchProvinces = async (regionCode) => {
    if (!regionCode) return;
    try {
      const response = await axios.get(`https://psgc.gitlab.io/api/provinces/`);
      const filteredProvinces = response.data.filter(
        (province) => province.regionCode === regionCode,
      );
      setProvinces(filteredProvinces);
      setCities([]); // Clear cities when changing provinces
      setBarangays([]); // Clear barangays when changing provinces
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  // Fetch cities/municipalities based on the selected province
  const fetchCities = async (provinceCode) => {
    if (!provinceCode) return;
    try {
      const response = await axios.get(
        `https://psgc.gitlab.io/api/cities-municipalities/`,
      );
      const filteredCities = response.data.filter(
        (city) => city.provinceCode === provinceCode,
      );
      setCities(filteredCities);
      setBarangays([]); // Clear barangays when changing cities
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Fetch barangays based on the selected city/municipality
  const fetchBarangays = async (cityCode) => {
    if (!cityCode) return;
    try {
      const response = await axios.get(`https://psgc.gitlab.io/api/barangays/`);
      const filteredBarangays = response.data.filter(
        (barangay) => barangay.cityCode === cityCode,
      );
      setBarangays(filteredBarangays);
    } catch (error) {
      console.error("Error fetching barangays:", error);
    }
  };

  // Handle input changes
  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    // Update formDetails state correctly, maintaining all values and clearing dependent fields
    setFormDetails((prevFormDetails) => {
      let updatedData = { ...prevFormDetails, [name]: value };

      if (name === "region") {
        updatedData = {
          ...updatedData,
          province: "",
          city: "",
          barangay: "",
        };
      } else if (name === "province") {
        updatedData = {
          ...updatedData,
          city: "",
          barangay: "",
        };
      } else if (name === "city") {
        updatedData = {
          ...updatedData,
          barangay: "",
        };
      }

      return updatedData;
    });

    // Fetch options based on user input
    if (name === "region") {
      await fetchProvinces(value);
    } else if (name === "province") {
      await fetchCities(value);
    } else if (name === "city") {
      await fetchBarangays(value);
    }
  };

  const handleCompleteOrder = () => {
    console.log("Order completed", formDetails, cartItems);
  };

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Function to open the modal
  const handleOpenAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  // Function to close the modal
  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  // Function to handle the selected address
  const handleSelectAddress = (addressId) => {
    setSelectedAddress(addressId);
    setIsAddressModalOpen(false); // Close the modal after selecting an address
  };

  return (
    <div className="pt-15 bg-white p-8 flex justify-center">
      <div className="flex flex-col lg:flex-row items-start justify-between w-full max-w-5xl gap-8">
        {/* Customer Info Section */}
        <div className="w-full lg:w-2/3">
          <h2 className="text-xl font-semibold mb-4 text-gray-500">Contact</h2>

          <div className="relative mb-6">
            <input
              type="text"
              name="email"
              className="block w-full px-3 pb-2 pt-4 text-base 
              text-gray-900 bg-transparent rounded-lg border 
              border-gray-300 appearance-none focus:outline-none 
              focus:ring-0 focus:border-alofa-pink peer"
              placeholder=" "
            />
            <label
              htmlFor="email"
              className="absolute text-sm text-gray-500 dark:text-gray-400
              duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] 
              start-2.5 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 
              peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 
              rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Email
            </label>
          </div>

          <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold mb-4 text-gray-500 flex items-center">
            Shipping Information
          </h2>
          <button
              className="ml-4 bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b 
              hover:from-[#F8587A] hover:to-[#FE699F] text-white font-normal py-1 px-3 rounded-md 
              focus:outline-none flex items-center"
              onClick={handleOpenAddressModal}
            >
              <FaRegAddressCard className="mr-2" /> Select Address
            </button>

            {/* Render the modal conditionally */}
            {isAddressModalOpen && (
              <CheckoutAddressModal
                onClose={handleCloseAddressModal}
                onSelectAddress={handleSelectAddress}
              />
            )}

            {selectedAddress && (
              <p className="mt-4">Selected Address ID: {selectedAddress}</p> // Display the selected address (optional)
            )}
          </div>

          <div className="flex gap-3 mb-4">
            <div className="relative w-full">
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formDetails.firstName}
                onChange={handleInputChange}
                className="block w-full px-3 pb-2 pt-4 text-base 
                      text-gray-900 bg-transparent rounded-lg border 
                      border-gray-300 appearance-none focus:outline-none 
                      focus:ring-0 focus:border-alofa-pink peer"
                placeholder=" "
              />
              <label
                htmlFor="firstName"
                className="absolute text-sm text-gray-500 dark:text-gray-400
                    duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] 
                    start-2.5 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 
                    peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 
                    rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
              >
                First Name
              </label>
            </div>

            <div className="relative w-full">
              <input
                type="text"
                id="lastName"
                value={formDetails.lastName}
                onChange={handleInputChange}
                className="block w-full px-3 pb-2 pt-4 text-base 
                    text-gray-900 bg-transparent rounded-lg border 
                    border-gray-300 appearance-none focus:outline-none 
                    focus:ring-0 focus:border-alofa-pink peer"
                placeholder=" "
              />
              <label
                htmlFor="lastName"
                className="absolute text-sm text-gray-500 dark:text-gray-400
                    duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] 
                    start-2.5 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 
                    peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 
                    rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
              >
                Last Name
              </label>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              name="street"
              value={formDetails.street}
              onChange={handleInputChange}
              className="block w-full px-3 pb-2 pt-4 text-base 
              text-gray-900 bg-transparent rounded-lg border 
              border-gray-300 appearance-none focus:outline-none 
              focus:ring-0 focus:border-alofa-pink peer mb-4"
              placeholder=""
            />
            <label
              htmlFor="street"
              className="absolute text-sm text-gray-500 dark:text-gray-400
              duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] 
              start-2.5 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 
              peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 
              rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Street and house number
            </label>
          </div>

          <div className="relative mb-4">
            <select
              id="region"
              name="region"
              value={formDetails.region}
              onChange={handleInputChange}
              className={`block w-full px-3 pb-2 pt-4 text-base text-gray-900 bg-transparent
                rounded-lg border border-gray-300 appearance-none focus:outline-none 
                focus:ring-0 focus:border-alofa-pink peer`}
              placeholder=" "
            >
              <option value="" disabled>
                Select Region
              </option>
              {regions.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.name}
                </option>
              ))}
            </select>
            <label
              htmlFor="region"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Region
            </label>
          </div>

          <div className="relative mb-4">
            <select
              id="province"
              name="province"
              value={formDetails.province}
              onChange={handleInputChange}
              className={`block w-full px-3 pb-2 pt-4 text-base text-gray-900 bg-transparent
                rounded-lg border border-gray-300 appearance-none focus:outline-none 
                focus:ring-0 focus:border-alofa-pink peer`}
              disabled={!formDetails.region}
            >
              <option value="">Select Province</option>
              {provinces.map((province) => (
                <option key={province.code} value={province.code}>
                  {province.name}
                </option>
              ))}
            </select>
            <label
              htmlFor="province"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Province
            </label>
          </div>

          <div className="relative mb-4">
            <select
              id="city"
              name="city"
              value={formDetails.city}
              onChange={handleInputChange}
              className={`block w-full px-3 pb-2 pt-4 text-base text-gray-900 bg-transparent
                  rounded-lg border border-gray-300 appearance-none focus:outline-none 
                  focus:ring-0 focus:border-alofa-pink peer`}
              disabled={!formDetails.province}
              placeholder=""
            >
              <option value="">Select City/Municipality</option>
              {cities.map((city) => (
                <option key={city.code} value={city.code}>
                  {city.name}
                </option>
              ))}
            </select>
            <label
              htmlFor="city"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              City/Municipality
            </label>
          </div>

          <div className="relative mb-4">
            <select
              id="barangay"
              name="barangay"
              value={formDetails.barangay}
              onChange={handleInputChange}
              className={`block w-full px-3 pb-2 pt-4 text-base text-gray-900 bg-transparent
                    rounded-lg border border-gray-300 appearance-none focus:outline-none 
                    focus:ring-0 focus:border-alofa-pink peer`}
              disabled={!formDetails.city}
              placeholder=""
            >
              <option value="">Select Barangay</option>
              {barangays.map((barangay) => (
                <option key={barangay.code} value={barangay.code}>
                  {barangay.name}
                </option>
              ))}
            </select>
            <label
              htmlFor="barangay"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Barangay
            </label>
          </div>

          <div className="relative mb-4">
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              value={formDetails.phoneNumber}
              onChange={handleInputChange}
              className="block w-full px-3 pb-2 pt-4 text-base 
                      text-gray-900 bg-transparent rounded-lg border 
                      border-gray-300 appearance-none focus:outline-none 
                      focus:ring-0 focus:border-alofa-pink peer"
              placeholder=""
            />
            <label
              htmlFor="phoneNumber"
              className="absolute text-sm text-gray-500 dark:text-gray-400
                    duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] 
                    start-2.5 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 
                    peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 
                    rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Phone Number
            </label>
          </div>

          <div className="relative mb-4">
            <input
              type="tel"
              name="postalCode"
              id="postalCode"
              value={formDetails.postalCode}
              onChange={handleInputChange}
              className="block w-full px-3 pb-2 pt-4 text-base 
                      text-gray-900 bg-transparent rounded-lg border 
                      border-gray-300 appearance-none focus:outline-none 
                      focus:ring-0 focus:border-alofa-pink peer"
              placeholder=""
            />
            <label
              htmlFor="postalCode"
              className="absolute text-sm text-gray-500 dark:text-gray-400
                    duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] 
                    start-2.5 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 
                    peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 
                    rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Postal Code
            </label>
          </div>

          {/* Payment and Submit Button */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-500">
              Payment
            </h2>
            <div className="accordion overflow-hidden">
              {/* Gcash Payment */}
              <div
                className={`border rounded-lg p-4 mb-4 cursor-pointer transition-all duration-700 ease-in-out ${formDetails.paymentMethod === "gcash" ? "max-h-screen" : "max-h-20"}`}
              >
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="gcash"
                      checked={formDetails.paymentMethod === "gcash"}
                      onChange={() => {
                        setFormDetails({
                          ...formDetails,
                          paymentMethod: "gcash",
                        });
                      }}
                    />
                    <span className="font-bold">Gcash</span>
                  </label>
                  <img src={GCashLogo} alt="GCash Logo" className="w-10" />
                </div>
                {formDetails.paymentMethod === "gcash" && (
                  <div className="mt-4">
                    <p className="text-sm mb-2">
                      Please scan the QR code below to complete the payment:
                    </p>
                    <img
                      src={GCashQR}
                      alt="GCash QR Code"
                      className="w-32 h-32 mb-4"
                    />
                    <button className="bg-gray-600 hover:bg-gray-800 text-white py-2 px-4 rounded flex items-center gap-2">
                      Upload receipt
                    </button>
                  </div>
                )}
              </div>

              {/* Bank Transfer */}
              <div
                className={`border rounded-lg p-4 mb-4 cursor-pointer transition-all duration-700 ease-in-out ${formDetails.paymentMethod === "bank" ? "max-h-screen" : "max-h-20"}`}
              >
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={formDetails.paymentMethod === "bank"}
                      onChange={() => {
                        setFormDetails({
                          ...formDetails,
                          paymentMethod: "bank",
                        });
                      }}
                    />
                    <span className="font-bold">Bank Transfer</span>
                  </label>
                  <img
                    src={BPILogo}
                    alt="Bank Transfer Logo"
                    className="w-10"
                  />
                </div>
                {formDetails.paymentMethod === "bank" && (
                  <div className="mt-4">
                    <p className="text-sm mb-2">Bank details for transfer:</p>
                    <p className="text-sm">
                      Bank Name: <b>Bank of the Philippine Islands</b>
                    </p>
                    <p className="text-sm">
                      Account Number: <b>1234-5678-9012</b>
                    </p>
                    <p className="text-sm">Account Name: Alofa Haircare</p>
                    <button className="bg-gray-600 hover:bg-gray-800 text-white py-2 px-4 rounded flex items-center gap-2 mt-4">
                      Upload receipt
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleCompleteOrder}
            className="font-extrabold text-white py-2 px-4 rounded-full focus:outline-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] hover:to-[#FE699F]"
          >
            COMPLETE ORDER
          </button>
        </div>

        {/* Order Summary Section */}
        <div className="w-full lg:w-1/3 lg:sticky lg:top-20">
          <h2 className="text-xl font-semibold mb-1 text-gray-500">Orders</h2>
          <p className="text-gray-500 text-sm mb-2">
            Created: {new Date().toLocaleDateString()}{" "}
            {new Date().toLocaleTimeString()}
          </p>
          <p className="text-gray-500 text-sm mb-4 italic">
            {cartItems.reduce((total, item) => total + item.quantity, 0)} items
          </p>

          <div className="mb-4">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between mb-4"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  {/* Quantity badge */}
                  <div className="absolute -top-1 right-1 bg-gray-600 opacity-80 text-white rounded-md w-6 h-6 flex items-center justify-center text-xs">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex-1 text-gray-500">
                  <p className="font-bold">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.variant}</p>
                </div>
                <p className="font-bold text-gray-500">₱{item.unit_price}</p>
              </div>
            ))}
          </div>

          {/* Discount Voucher Section */}
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Discount voucher code"
              className="w-2/3 border p-3 rounded"
            />
            <button className="bg-pink-300 w-1/3 p-3 ml-2 rounded">
              Apply
            </button>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <p className="flex justify-between mb-2 text-gray-500">
              <span>
                Subtotal •{" "}
                {cartItems.reduce((total, item) => total + item.quantity, 0)}{" "}
                items
              </span>
              <span>₱{subtotal.toLocaleString()}</span>
            </p>
            <p className="flex justify-between mb-2 text-gray-500">
              <span>Shipping Fee</span>
              <span>₱{(1680).toLocaleString()}</span>
            </p>
            <p className="flex justify-between mb-2 text-gray-500">
              <span>Discount voucher</span>
              <span>-₱{(1680).toLocaleString()}</span>
            </p>
            <p className="flex justify-between font-bold text-3xl">
              <span>Total</span>
              <span>₱{(subtotal + 1680 - 1680).toLocaleString()}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
