import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "../../../../src/App.css";

const EditAddressModal = ({ address, onClose, onSave }) => {
  const [formDetails, setFormDetails] = useState({
    shipping_address_id: "",
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

  // State to store fetched data
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  // Mapping of region names to codes
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

  // Fetch regions data
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

  // Fetch provinces data based on region code
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

  // Fetch cities data based on province code
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

  // Fetch barangays data based on city code
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
  // Initialize formDetails and load dependencies
  useEffect(() => {
    if (address) {
      setFormDetails({
        shipping_address_id: address.shipping_address_id || "",
        first_name: address.first_name || "",
        last_name: address.last_name || "",
        address_line: address.address_line || "",
        region: address.region || "",
        province: address.province || "",
        city: address.city || "",
        barangay: address.barangay || "",
        phone_number: address.phone_number || "",
        zip_code: address.zip_code || "",
      });
      fetchRegions(); // Load regions on component mount
    }
  }, [address, fetchRegions]);

  // Handle cascading dropdowns based on selection
  useEffect(() => {
    if (formDetails.region) fetchProvinces(formDetails.region);
  }, [formDetails.region]);

  useEffect(() => {
    if (formDetails.province) fetchCities(formDetails.province);
  }, [formDetails.province]);

  useEffect(() => {
    if (formDetails.city) fetchBarangays(formDetails.city);
  }, [formDetails.city]);

  // Handle input changes
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

    // Fetch dependent data based on selection
    if (name === "region") {
      await fetchProvinces(value);
    } else if (name === "province") {
      await fetchCities(value);
    } else if (name === "city") {
      await fetchBarangays(value);
    }
  };

  // Handle save changes
  const handleSaveChanges = () => {
    // Validate required fields
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

    // Retrieve selected options
    const selectedRegion = regions.find((r) => r.code === formDetails.region);
    const selectedProvince = provinces.find(
      (p) => p.code === formDetails.province,
    );
    const selectedCity = cities.find((c) => c.code === formDetails.city);
    const selectedBarangay = barangays.find(
      (b) => b.code === formDetails.barangay,
    );

    // Call onSave with updated address details
    onSave({
      ...formDetails,
      region: selectedRegion ? selectedRegion.name : "",
      province: selectedProvince ? selectedProvince.name : "",
      city: selectedCity ? selectedCity.name : "",
      barangay: selectedBarangay ? selectedBarangay.name : "",
    });
    onClose();
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
        <h2 className="text-3xl font-bold mb-6 text-alofa-pink">
          Edit Address
        </h2>
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
                htmlFor="first_name"
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
                htmlFor="last_name"
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
              htmlFor="address_line"
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
              htmlFor="zip_code"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] 
              start-2.5 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 
              peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Postal Code
            </label>
          </div>

          {/* Save Changes Button */}
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

EditAddressModal.propTypes = {
  address: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditAddressModal;
