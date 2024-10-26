import { useEffect, useState, useContext, useCallback, useMemo } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import GCashLogo from '../../../public/static/gcash-logo.svg';
import BPILogo from '../../../public/static/bpi-logo.svg';
import GCashQR from '../../../public/static/gcash-qr.jpg';
import { CartContext } from '../components/CartContext.jsx';
import axios from 'axios';

const Checkout = () => {
  const { cartItems, subtotal } = useContext(CartContext);

  // State for Regions, Provinces, Cities, and Barangays
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    barangayCode: '',
    cityCode: '',
    provinceCode: '',
    regionCode: '',
    postalCode: '',
    phone: '',
    paymentMethod: '',
  });

  const total = subtotal + 150;

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

    // Update formData state correctly, maintaining all values and clearing dependent fields
    setFormData((prevFormData) => {
      let updatedData = { ...prevFormData, [name]: value };

      if (name === 'regionCode') {
        updatedData = {
          ...updatedData,
          provinceCode: '',
          cityCode: '',
          barangayCode: '',
        };
      } else if (name === 'provinceCode') {
        updatedData = {
          ...updatedData,
          cityCode: '',
          barangayCode: '',
        };
      } else if (name === 'cityCode') {
        updatedData = {
          ...updatedData,
          barangayCode: '',
        };
      }

      return updatedData;
    });

    // Fetch options based on user input
    if (name === 'regionCode') {
      await fetchProvinces(value);
    } else if (name === 'provinceCode') {
      await fetchCities(value);
    } else if (name === 'cityCode') {
      await fetchBarangays(value);
    }
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    console.log('Cart Items:', cartItems);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col lg:flex-row w-full h-full bg-white">
        {/* Customer Info Section */}
        <div className="w-full lg:w-2/3 p-8 pl-20 pr-20 flex flex-col justify-between h-full mx-auto overflow-y-auto">
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
            <h2 className="text-xl font-bold mb-4 text-gray-500">Contact</h2>
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
            {/* Region Dropdown */}
            <div className="mb-4">
              <select
                id="region"
                name="regionCode"
                value={formData.regionCode}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md appearance-auto ${formData.regionCode ? 'text-black' : 'text-gray-400'}`}
                style={{ backgroundPosition: 'calc(100% - 1rem) center' }}
              >
                <option value="">Select Region</option>
                {regions.map((region) => (
                  <option key={region.code} value={region.code}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>
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
              placeholder="Street and house number"
              className="w-full p-3 mb-4 border rounded-md"
            />
            {/* Province Dropdown */}
            <div className="mb-4">
              <select
                id="province"
                name="provinceCode"
                value={formData.provinceCode}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md ${formData.provinceCode ? 'text-black' : 'text-gray-400'}`}
                disabled={!formData.regionCode}
              >
                <option value="">Select Province</option>
                {provinces.map((province) => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4 mb-4">
              {/* City Dropdown */}
              <select
                id="city"
                name="cityCode"
                value={formData.cityCode}
                onChange={handleInputChange}
                className={`w-1/2 p-3 border rounded-md appearance-none ${formData.cityCode ? 'text-black' : 'text-gray-400'}`}
                disabled={!formData.provinceCode}
              >
                <option value="">Select City/Municipality</option>
                {cities.map((city) => (
                  <option key={city.code} value={city.code}>
                    {city.name}
                  </option>
                ))}
              </select>
              {/* Barangay Dropdown */}
              <select
                id="barangay"
                name="barangayCode"
                value={formData.barangayCode}
                onChange={handleInputChange}
                className={`w-1/2 p-3 border rounded-md ${formData.barangayCode ? 'text-black' : 'text-gray-400'}`}
                disabled={!formData.cityCode}
              >
                <option value="">Select Barangay</option>
                {barangays.map((barangay) => (
                  <option key={barangay.code} value={barangay.code}>
                    {barangay.name}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Mobile Phone (+63)"
              className="w-full p-3 mb-4 border rounded-md"
            />
          </div>

          {/* Payment and Submit Button */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-500">Payment</h2>
            <div className="accordion overflow-hidden">
              {/* Gcash Payment */}
              <div
                className="border p-4 mb-4 cursor-pointer transition-all duration-700 ease-in-out"
                onClick={() => {
                  setFormData({
                    ...formData,
                    paymentMethod: formData.paymentMethod === 'gcash' ? '' : 'gcash',
                  });
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold">Gcash</span>
                  <img src={GCashLogo} alt="GCash Logo" className="w-10" />
                </div>
                {formData.paymentMethod === 'gcash' && (
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
                  setFormData({
                    ...formData,
                    paymentMethod: formData.paymentMethod === 'bank' ? '' : 'bank',
                  });
                }}
              >
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
                    <button className="bg-gray-600 hover:bg-gray-800 text-white py-2 px-4 rounded flex items-center gap-2 mt-4">
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
          <h2 className="text-3xl font-extrabold font-body mb-6 text-white">Orders</h2>
          <div className="overflow-y-auto max-h-auto mb-4">
            {cartItems.map((item, index) => (
              <div key={index} className="flex items-center mb-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded mr-4 shadow-sm" />
                <div className="flex justify-between w-full text-white">
                  <span>
                    <span className="font-bold">{`${item.quantity}x`}</span>
                    {` ${item.name}`}
                  </span>
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
