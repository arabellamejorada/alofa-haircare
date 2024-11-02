import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "../../../../src/App.css";

const NewAddressModal = ({ onClose, onSave }) => {
  const [formDetails, setFormDetails] = useState({
    first_name: "",
    last_name: "",
    address_line: "",
    region: "",
    province: "",
    city: "",
    barangay: "",
    phone_number: "",
    zip_code: "",
  });

  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

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

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  const fetchProvinces = async (regionCode) => {
    if (!regionCode) return;
    try {
      const response = await axios.get("https://psgc.gitlab.io/api/provinces/");
      const filteredProvinces = response.data.filter(
        (province) => province.regionCode === regionCode,
      );
      setProvinces(filteredProvinces);
      setCities([]);
      setBarangays([]);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchCities = async (provinceCode) => {
    if (!provinceCode) return;
    try {
      const response = await axios.get(
        "https://psgc.gitlab.io/api/cities-municipalities/",
      );
      const filteredCities = response.data.filter(
        (city) => city.provinceCode === provinceCode,
      );
      setCities(filteredCities);
      setBarangays([]);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchBarangays = async (cityCode) => {
    if (!cityCode) return;
    try {
      const response = await axios.get("https://psgc.gitlab.io/api/barangays/");
      const filteredBarangays = response.data.filter(
        (barangay) => barangay.cityCode === cityCode,
      );
      setBarangays(filteredBarangays);
    } catch (error) {
      console.error("Error fetching barangays:", error);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    setFormDetails((prevFormDetails) => {
      let updatedData = { ...prevFormDetails, [name]: value };

      if (name === "region") {
        updatedData = { ...updatedData, province: "", city: "", barangay: "" };
      } else if (name === "province") {
        updatedData = { ...updatedData, city: "", barangay: "" };
      } else if (name === "city") {
        updatedData = { ...updatedData, barangay: "" };
      }

      return updatedData;
    });

    if (name === "region") {
      await fetchProvinces(value);
    } else if (name === "province") {
      await fetchCities(value);
    } else if (name === "city") {
      await fetchBarangays(value);
    }
  };

  const handleSaveChanges = () => {
    // Check if all required fields are filled
    const {
      first_name,
      last_name,
      address_line,
      region,
      province,
      city,
      barangay,
      phone_number,
      zip_code,
    } = formDetails;
    if (
      !first_name ||
      !last_name ||
      !address_line ||
      !region ||
      !province ||
      !city ||
      !barangay ||
      !phone_number ||
      !zip_code
    ) {
      alert("Please fill in all fields.");
      return;
    }
    // Find the selected region, province, city, and barangay based on the selected codes
    const selectedRegion = regions.find(
      (region) => region.code === formDetails.region,
    );
    const selectedProvince = provinces.find(
      (province) => province.code === formDetails.province,
    );
    const selectedCity = cities.find((city) => city.code === formDetails.city);
    const selectedBarangay = barangays.find(
      (barangay) => barangay.code === formDetails.barangay,
    );

    // Call the onSave prop passed from AddressTab with form details
    onSave({
      first_name: formDetails.first_name,
      last_name: formDetails.last_name,
      phone_number: formDetails.phone_number,
      address_line: formDetails.address_line,
      barangay: selectedBarangay ? selectedBarangay.name : "",
      city: selectedCity ? selectedCity.name : "",
      province: selectedProvince ? selectedProvince.name : "",
      region: selectedRegion ? selectedRegion.name : "",
      zip_code: formDetails.zip_code,
    });
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
        <h2 className="text-3xl font-bold mb-6 text-alofa-pink">New Address</h2>
        <form>
          <div className="flex gap-3 mb-4">
            <div className="relative w-full">
              <input
                type="text"
                name="first_name"
                value={formDetails.first_name}
                onChange={handleInputChange}
                className="block w-full px-3 pb-2 pt-4 text-base 
                  text-gray-900 bg-transparent rounded-lg border 
                  border-gray-300 appearance-none focus:outline-none 
                  focus:ring-0 focus:border-alofa-pink peer"
                placeholder=" "
              />
              <label
                htmlFor="firstName"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] 
                start-2.5 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 
                peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                First Name
              </label>
            </div>

            <div className="relative w-full">
              <input
                type="text"
                name="last_name"
                value={formDetails.last_name}
                onChange={handleInputChange}
                className="block w-full px-3 pb-2 pt-4 text-base 
                  text-gray-900 bg-transparent rounded-lg border 
                  border-gray-300 appearance-none focus:outline-none 
                  focus:ring-0 focus:border-alofa-pink peer"
                placeholder=" "
              />
              <label
                htmlFor="lastName"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] 
                start-2.5 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 
                peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Last Name
              </label>
            </div>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              name="address_line"
              value={formDetails.address_line}
              onChange={handleInputChange}
              className="block w-full px-3 pb-2 pt-4 text-base 
                text-gray-900 bg-transparent rounded-lg border 
                border-gray-300 appearance-none focus:outline-none 
                focus:ring-0 focus:border-alofa-pink peer"
              placeholder=" "
            />
            <label
              htmlFor="street"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] 
              start-2.5 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 
              peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Street and house number
            </label>
          </div>

          <div className="relative mb-4">
            <select
              name="region"
              value={formDetails.region}
              onChange={handleInputChange}
              className="block w-full px-3 pb-2 pt-4 text-base 
                text-gray-900 bg-transparent rounded-lg border 
                border-gray-300 appearance-none focus:outline-none 
                focus:ring-0 focus:border-alofa-pink peer"
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
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] 
              start-3 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 
              peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Region
            </label>
          </div>

          <div className="relative mb-4">
            <select
              name="province"
              value={formDetails.province}
              onChange={handleInputChange}
              className="block w-full px-3 pb-2 pt-4 text-base 
                text-gray-900 bg-transparent rounded-lg border 
                border-gray-300 appearance-none focus:outline-none 
                focus:ring-0 focus:border-alofa-pink peer"
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
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] 
              start-3 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 
              peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Province
            </label>
          </div>

          <div className="relative mb-4">
            <select
              name="city"
              value={formDetails.city}
              onChange={handleInputChange}
              className="block w-full px-3 pb-2 pt-4 text-base 
                text-gray-900 bg-transparent rounded-lg border 
                border-gray-300 appearance-none focus:outline-none 
                focus:ring-0 focus:border-alofa-pink peer"
              disabled={!formDetails.province}
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
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] 
              start-3 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 
              peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              City/Municipality
            </label>
          </div>

          <div className="relative mb-4">
            <select
              name="barangay"
              value={formDetails.barangay}
              onChange={handleInputChange}
              className="block w-full px-3 pb-2 pt-4 text-base 
                text-gray-900 bg-transparent rounded-lg border 
                border-gray-300 appearance-none focus:outline-none 
                focus:ring-0 focus:border-alofa-pink peer"
              disabled={!formDetails.city}
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
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] 
              start-3 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 
              peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Barangay
            </label>
          </div>

          <div className="relative mb-4">
            <input
              type="tel"
              name="phone_number"
              value={formDetails.phone_number}
              onChange={handleInputChange}
              className="block w-full px-3 pb-2 pt-4 text-base 
                text-gray-900 bg-transparent rounded-lg border 
                border-gray-300 appearance-none focus:outline-none 
                focus:ring-0 focus:border-alofa-pink peer"
              placeholder=" "
            />
            <label
              htmlFor="phoneNumber"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] 
              start-2.5 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 
              peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Phone Number
            </label>
          </div>

          <div className="relative mb-10">
            <input
              type="text"
              name="zip_code"
              value={formDetails.zip_code}
              onChange={handleInputChange}
              className="block w-full px-3 pb-2 pt-4 text-base 
                text-gray-900 bg-transparent rounded-lg border 
                border-gray-300 appearance-none focus:outline-none 
                focus:ring-0 focus:border-alofa-pink peer"
              placeholder=" "
            />
            <label
              htmlFor="postalCode"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] 
              start-2.5 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 
              peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Postal Code
            </label>
          </div>

          <button
            type="button"
            className="block w-full py-3 text-white font-bold bg-gradient-to-b from-[#FE699F] to-[#F8587A] rounded-lg hover:from-[#F8587A] hover:to-[#FE699F]"
            onClick={handleSaveChanges}
          >
            SAVE CHANGES
          </button>
        </form>
      </div>
    </div>
  );
};

NewAddressModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default NewAddressModal;
