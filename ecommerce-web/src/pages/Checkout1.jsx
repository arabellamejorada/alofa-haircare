import { useContext, useState, useEffect, useCallback, useMemo } from "react";
import { CartContext } from "../components/CartContext.jsx";
import GCashLogo from '../../../public/static/gcash-logo.svg';
import BPILogo from '../../../public/static/bpi-logo.svg';
import GCashQR from '../../../public/static/gcash-qr.jpg';
import axios from 'axios';

const Checkout1 = () => {
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
  const regionMapping = useMemo(() => ({
    "Ilocos Region": "Region 1",
    "Cagayan Valley": "Region 2",
    "Central Luzon": "Region 3",
    "CALABARZON": "Region 4-A",
    "MIMAROPA Region": "Region 4-B",
    "Bicol Region": "Region 5",
    "Western Visayas": "Region 6",
    "Central Visayas": "Region 7",
    "Eastern Visayas": "Region 8",
    "Zamboanga Peninsula": "Region 9",
    "Northern Mindanao": "Region 10",
    "Davao Region": "Region 11",
    "SOCCSKSARGEN": "Region 12",
    "Caraga": "Region 13",
    "National Capital Region (NCR)": "NCR",
    "Cordillera Administrative Region (CAR)": "CAR",
    "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)": "BARMM"
  }), []);

  // Wrap fetchRegions in useCallback
  const fetchRegions = useCallback(async () => {
    try {
      const response = await axios.get('https://psgc.gitlab.io/api/regions/');
      const mappedRegions = response.data.map((region) => ({
        ...region,
        name: regionMapping[region.name] || region.name,
      }));
      setRegions(mappedRegions);
    } catch (error) {
      console.error('Error fetching regions:', error);
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
        (province) => province.regionCode === regionCode
      );
      setProvinces(filteredProvinces);
      setCities([]); // Clear cities when changing provinces
      setBarangays([]); // Clear barangays when changing provinces
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  // Fetch cities/municipalities based on the selected province
  const fetchCities = async (provinceCode) => {
    if (!provinceCode) return;
    try {
      const response = await axios.get(`https://psgc.gitlab.io/api/cities-municipalities/`);
      const filteredCities = response.data.filter(
        (city) => city.provinceCode === provinceCode
      );
      setCities(filteredCities);
      setBarangays([]); // Clear barangays when changing cities
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  // Fetch barangays based on the selected city/municipality
  const fetchBarangays = async (cityCode) => {
    if (!cityCode) return;
    try {
      const response = await axios.get(`https://psgc.gitlab.io/api/barangays/`);
      const filteredBarangays = response.data.filter(
        (barangay) => barangay.cityCode === cityCode
      );
      setBarangays(filteredBarangays);
    } catch (error) {
      console.error('Error fetching barangays:', error);
    }
  };

  // Handle input changes
  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    // Update formDetails state correctly, maintaining all values and clearing dependent fields
    setFormDetails((prevFormDetails) => {
      let updatedData = { ...prevFormDetails, [name]: value };

      if (name === 'region') {
        updatedData = {
          ...updatedData,
          province: '',
          city: '',
          barangay: '',
        };
      } else if (name === 'province') {
        updatedData = {
          ...updatedData,
          city: '',
          barangay: '',
        };
      } else if (name === 'city') {
        updatedData = {
          ...updatedData,
          barangay: '',
        };
      }

      return updatedData;
    });

    // Fetch options based on user input
    if (name === 'region') {
      await fetchProvinces(value);
    } else if (name === 'province') {
      await fetchCities(value);
    } else if (name === 'city') {
      await fetchBarangays(value);
    }
  };

  const handleCompleteOrder = () => {
    console.log("Order completed", formDetails, cartItems);
  };

  return (
    <div className="pt-20 bg-white p-8 flex justify-center">
      <div className="flex flex-col lg:flex-row items-start justify-between w-full max-w-5xl gap-8">
        {/* Customer Info Section */}
        <div className="w-full lg:w-2/3">
          <h2 className="text-xl font-semibold mb-4 text-gray-500">Contact</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formDetails.email}
            onChange={handleInputChange}
            className="w-full border p-3 rounded mb-4"
          />
        
            <h2 className="text-xl font-semibold mb-4 text-gray-500">Shipping Information</h2>
            
            <div className="mb-4">
          
            <div className="flex gap-3 mb-4">
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formDetails.firstName}
                    onChange={handleInputChange}
                    className="w-full border p-3 rounded"
                    />
                    <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formDetails.lastName}
                    onChange={handleInputChange}
                    className="w-full border p-3 rounded"
                />
            </div>
            
            <input
              type="text"
              name="street"
              placeholder="Street and house number"
              value={formDetails.street}
              onChange={handleInputChange}
              className="w-full border p-3 rounded mb-4"
            />

            <select
              id="region"
              name="region"
              value={formDetails.region}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded appearance-auto ${formDetails.region ? 'text-black' : 'text-gray-400'}`}
            >
              <option value="">Select Region</option>
              {regions.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.name}
                </option>
              ))}
            </select>
            </div>

            <div className="mb-4">
                <select
                id="province"
                name="province"
                value={formDetails.province}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded ${formDetails.province ? 'text-black' : 'text-gray-400'}`}
                disabled={!formDetails.region}
                >
                <option value="">Select Province</option>
                {provinces.map((province) => (
                    <option key={province.code} value={province.code}>
                    {province.name}
                    </option>
                ))}
                </select>
            </div>

            <div className="mb-4">
                <select
                id="city"
                name="city"
                value={formDetails.city}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded ${formDetails.city ? 'text-black' : 'text-gray-400'}`}
                disabled={!formDetails.province}
                >
                <option value="">Select City</option>
                {cities.map((city) => (
                    <option key={city.code} value={city.code}>
                    {city.name}
                    </option>
                ))}
                </select>
            </div>

            <div className="mb-4">
                <select
                id="barangay"
                name="barangay"
                value={formDetails.barangay}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded ${formDetails.barangay ? 'text-black' : 'text-gray-400'}`}
                disabled={!formDetails.city}
                >
                <option value="">Select Barangay</option>
                {barangays.map((barangay) => (
                    <option key={barangay.code} value={barangay.code}>
                    {barangay.name}
                    </option>
                ))}
                </select>
            </div>

            <div className="mb-4">
                <input
                type="tel"
                name="phoneNumber"
                placeholder="Mobile Phone (+63)"
                value={formDetails.phoneNumber}
                onChange={handleInputChange}
                className="w-full border p-3 rounded"
                />
            </div>

            

          {/* Payment and Submit Button */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-500">Payment</h2>
            <div className="accordion overflow-hidden">
              {/* Gcash Payment */}
              <div
                className="border p-4 mb-4 cursor-pointer transition-all duration-700 ease-in-out"
                onClick={() => {
                  setFormDetails({
                    ...formDetails,
                    paymentMethod: formDetails.paymentMethod === "gcash" ? "" : "gcash",
                  });
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold">Gcash</span>
                  <img src={GCashLogo} alt="GCash Logo" className="w-10" />
                </div>
                {formDetails.paymentMethod === "gcash" && (
                  <div className="mt-4">
                    <p className="text-sm mb-2">Please scan the QR code below to complete the payment:</p>
                    <img src={GCashQR} alt="GCash QR Code" className="w-32 h-32 mb-4" />
                    <button className="bg-gray-600 hover:bg-gray-800 text-white py-2 px-4 rounded flex items-center gap-2">
                      Upload receipt
                    </button>
                  </div>
                )}
              </div>

              {/* Bank Transfer */}
              <div
                className="border p-4 mb-4 cursor-pointer transition-all duration-700 ease-in-out"
                onClick={() => {
                  setFormDetails({
                    ...formDetails,
                    paymentMethod: formDetails.paymentMethod === "bank" ? "" : "bank",
                  });
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold">Bank Transfer</span>
                  <img src={BPILogo} alt="Bank Transfer Logo" className="w-10" />
                </div>
                {formDetails.paymentMethod === "bank" && (
                  <div className="mt-4">
                    <p className="text-sm mb-2">Bank details for transfer:</p>
                    <p className="text-sm">Bank Name: <b>Bank of the Philippine Islands</b></p>
                    <p className="text-sm">Account Number: <b>1234-5678-9012</b></p>
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
            className="w-full bg-pink-500 text-white p-4 rounded mt-6 hover:bg-pink-600"
          >
            COMPLETE ORDER
          </button>
        </div>

        {/* Order Summary Section */}
        <div className="w-full lg:w-1/3">
          <h2 className="text-2xl font-bold mb-4">Orders</h2>
          <div className="border rounded p-4 mb-4">
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded mr-4"
                />
                <div className="flex-1">
                  <p className="font-bold">{item.name}</p>
                  <p className="text-sm">{item.variant}</p>
                </div>
                <p className="font-bold">₱{item.price}</p>
              </div>
            ))}
            <input
              type="text"
              placeholder="Discount voucher code"
              className="w-full border p-3 rounded mb-4"
            />
            <button className="bg-pink-300 w-full p-3 rounded">Apply</button>
          </div>
          <div className="border-t pt-4">
            <p className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₱{subtotal}</span>
            </p>
            <p className="flex justify-between mb-2">
              <span>Shipping Fee</span>
              <span>₱1,680.00</span>
            </p>
            <p className="flex justify-between mb-2">
              <span>Discount voucher</span>
              <span>-₱1,680.00</span>
            </p>
            <p className="flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>₱{subtotal}</span>
            </p>
          </div>
          <button
            onClick={handleCompleteOrder}
            className="w-full bg-pink-500 text-white p-4 rounded mt-6 hover:bg-pink-600"
          >
            COMPLETE ORDER
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout1;
