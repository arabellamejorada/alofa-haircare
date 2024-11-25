import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "../../../../src/App.css";
import { toast } from "sonner";

const EditAddressModal = ({ address, onClose, onSave, errors, setErrors }) => {
  const [formDetails, setFormDetails] = useState({
    shipping_address_id: "",
    first_name: "",
    last_name: "",
    address_line: "",
    region: { name: "", code: "" },
    province: { name: "", code: "" },
    city: { name: "", code: "" },
    barangay: { name: "", code: "" },
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

  useEffect(() => {
    if (address) {
      setFormDetails({
        shipping_address_id: address.shipping_address_id || "",
        first_name: address.first_name || "",
        last_name: address.last_name || "",
        address_line: address.address_line || "",
        region: address.region || { name: "", code: "" },
        province: address.province || { name: "", code: "" },
        city: address.city || { name: "", code: "" },
        barangay: address.barangay || { name: "", code: "" },
        phone_number: address.phone_number || "",
        zip_code: address.zip_code || "",
      });
      fetchRegions(); // Load regions on component mount
    }
  }, [address, fetchRegions]);

  useEffect(() => {
    if (formDetails.region.code) fetchProvinces(formDetails.region.code);
  }, [formDetails.region]);

  useEffect(() => {
    if (formDetails.province.code) fetchCities(formDetails.province.code);
  }, [formDetails.province]);

  useEffect(() => {
    if (formDetails.city.code) fetchBarangays(formDetails.city.code);
  }, [formDetails.city]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    setFormDetails((prevFormDetails) => {
      let updatedData = { ...prevFormDetails };

      if (name === "region") {
        const selectedRegion = regions.find((region) => region.code === value);
        updatedData = {
          ...updatedData,
          region: selectedRegion
            ? { name: selectedRegion.name, code: selectedRegion.code }
            : { name: "", code: "" },
          province: { name: "", code: "" },
          city: { name: "", code: "" },
          barangay: { name: "", code: "" },
        };
      } else if (name === "province") {
        const selectedProvince = provinces.find(
          (province) => province.code === value,
        );
        updatedData = {
          ...updatedData,
          province: selectedProvince
            ? { name: selectedProvince.name, code: selectedProvince.code }
            : { name: "", code: "" },
          city: { name: "", code: "" },
          barangay: { name: "", code: "" },
        };
      } else if (name === "city") {
        const selectedCity = cities.find((city) => city.code === value);
        updatedData = {
          ...updatedData,
          city: selectedCity
            ? { name: selectedCity.name, code: selectedCity.code }
            : { name: "", code: "" },
          barangay: { name: "", code: "" },
        };
      } else if (name === "barangay") {
        const selectedBarangay = barangays.find(
          (barangay) => barangay.code === value,
        );
        updatedData = {
          ...updatedData,
          barangay: selectedBarangay
            ? { name: selectedBarangay.name, code: selectedBarangay.code }
            : { name: "", code: "" },
        };
      } else {
        updatedData = { ...updatedData, [name]: value };
      }

      return updatedData;
    });

    // Validation logic
    setErrors((prevErrors) => {
      let updatedErrors = { ...prevErrors };

      if (name === "first_name") {
        updatedErrors[name] =
          value.trim() === "" ? "First name is required" : "";
      } else if (name === "last_name") {
        updatedErrors[name] =
          value.trim() === "" ? "Last name is required" : "";
      } else if (name === "address_line") {
        updatedErrors[name] = value.trim() === "" ? "Address is required" : "";
      } else if (name === "phone_number") {
        const regex = /^(09|\+639)\d{0,9}$/; // Allow typing but enforce pattern
        if (value.length > 11) {
          updatedErrors[name] = "Phone number cannot exceed 11 digits.";
        } else if (!regex.test(value)) {
          updatedErrors[name] =
            "Invalid phone number format. Example: 09123456789";
        } else {
          updatedErrors[name] = "";
        }
      } else if (name === "zip_code") {
        updatedErrors[name] =
          value.trim() === "" ? "Please enter a valid postal code" : "";
      } else if (name === "region") {
        updatedErrors[name] = value === "" ? "Please select a region" : "";
      } else if (name === "province") {
        updatedErrors[name] = value === "" ? "Please select a province" : "";
      } else if (name === "city") {
        updatedErrors[name] = value === "" ? "Please select a city" : "";
      } else if (name === "barangay") {
        updatedErrors[name] = value === "" ? "Please select a barangay" : "";
      }

      return updatedErrors;
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
    const {
      first_name,
      last_name,
      address_line,
      region,
      province,
      city,
      // barangay,
      phone_number,
      zip_code,
    } = formDetails;

    if (
      !first_name ||
      !last_name ||
      !address_line ||
      !region.code ||
      !province.code ||
      !city.code ||
      !phone_number ||
      !zip_code
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Check for errors in state
    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (hasErrors) {
      toast.error("Please fix the errors in the form before saving.");
      return;
    }

    onSave(formDetails);
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
                className={`block w-full px-3 pb-2 pt-4 text-base 
                  text-gray-900 bg-transparent rounded-lg border 
                  ${errors.first_name ? "border-red-500" : "border-gray-300"} 
                  appearance-none focus:outline-none 
                  focus:ring-0 focus:border-alofa-pink peer`}
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
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
              )}
            </div>

            <div className="relative w-full">
              <input
                type="text"
                name="last_name"
                value={formDetails.last_name}
                onChange={handleInputChange}
                className={`block w-full px-3 pb-2 pt-4 text-base 
                  text-gray-900 bg-transparent rounded-lg border 
                  ${errors.last_name ? "border-red-500" : "border-gray-300"} 
                  appearance-none focus:outline-none 
                  focus:ring-0 focus:border-alofa-pink peer`}
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
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
              )}
            </div>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              name="address_line"
              value={formDetails.address_line}
              onChange={handleInputChange}
              className={`block w-full px-3 pb-2 pt-4 text-base 
                  text-gray-900 bg-transparent rounded-lg border 
                  ${errors.address_line ? "border-red-500" : "border-gray-300"} 
                  appearance-none focus:outline-none 
                  focus:ring-0 focus:border-alofa-pink peer`}
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
            {errors.address_line && (
              <p className="text-red-500 text-sm mt-1">{errors.address_line}</p>
            )}
          </div>

          {/* Repeat similar changes for Region, Province, City, and Barangay fields */}
          {/* Region */}
          <div className="relative mb-4">
            <select
              name="region"
              value={formDetails.region.code}
              onChange={handleInputChange}
              className={`block w-full px-3 pb-2 pt-4 text-base 
                  text-gray-900 bg-transparent rounded-lg border 
                  ${errors.region ? "border-red-500" : "border-gray-300"} 
                  appearance-none focus:outline-none 
                  focus:ring-0 focus:border-alofa-pink peer`}
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
            {errors.region && (
              <p className="text-red-500 text-sm mt-1">{errors.region}</p>
            )}
          </div>

          {/* Province */}
          <div className="relative mb-4">
            <select
              name="province"
              value={formDetails.province.code}
              onChange={handleInputChange}
              className={`block w-full px-3 pb-2 pt-4 text-base 
                  text-gray-900 bg-transparent rounded-lg border 
                  ${errors.province ? "border-red-500" : "border-gray-300"} 
                  appearance-none focus:outline-none 
                  focus:ring-0 focus:border-alofa-pink peer`}
              disabled={!formDetails.region.code}
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
            {errors.province && (
              <p className="text-red-500 text-sm mt-1">{errors.province}</p>
            )}
          </div>

          {/* City */}
          <div className="relative mb-4">
            <select
              name="city"
              value={formDetails.city.code}
              onChange={handleInputChange}
              className={`block w-full px-3 pb-2 pt-4 text-base 
                  text-gray-900 bg-transparent rounded-lg border 
                  ${errors.city ? "border-red-500" : "border-gray-300"} 
                  appearance-none focus:outline-none 
                  focus:ring-0 focus:border-alofa-pink peer`}
              disabled={!formDetails.province.code}
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
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          {/* Barangay */}
          <div className="relative mb-4">
            <select
              name="barangay"
              value={formDetails.barangay.code}
              onChange={handleInputChange}
              className={`block w-full px-3 pb-2 pt-4 text-base 
                  text-gray-900 bg-transparent rounded-lg border 
                  ${errors.barangay ? "border-red-500" : "border-gray-300"} 
                  appearance-none focus:outline-none 
                  focus:ring-0 focus:border-alofa-pink peer`}
              disabled={!formDetails.city.code || barangays.length === 0}
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
            {errors.barangay && (
              <p className="text-red-500 text-sm mt-1">{errors.barangay}</p>
            )}
          </div>

          <div className="relative mb-4">
            <input
              type="tel"
              name="phone_number"
              value={formDetails.phone_number}
              onChange={handleInputChange}
              className={`block w-full px-3 pb-2 pt-4 text-base 
                  text-gray-900 bg-transparent rounded-lg border 
                  ${errors.phone_number ? "border-red-500" : "border-gray-300"} 
                  appearance-none focus:outline-none 
                  focus:ring-0 focus:border-alofa-pink peer`}
              placeholder=" "
              maxLength={11}
            />
            <label
              htmlFor="phone_number"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] 
              start-2.5 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 
              peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Phone Number
            </label>
            {errors.phone_number && (
              <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
            )}
          </div>

          <div className="relative mb-10">
            <input
              type="text"
              name="zip_code"
              value={formDetails.zip_code}
              onChange={handleInputChange}
              className={`block w-full px-3 pb-2 pt-4 text-base 
                  text-gray-900 bg-transparent rounded-lg border 
                  ${errors.zip_code ? "border-red-500" : "border-gray-300"} 
                  appearance-none focus:outline-none 
                  focus:ring-0 focus:border-alofa-pink peer`}
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
            {errors.zip_code && (
              <p className="text-red-500 text-sm mt-1">{errors.zip_code}</p>
            )}
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

EditAddressModal.propTypes = {
  address: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditAddressModal;
