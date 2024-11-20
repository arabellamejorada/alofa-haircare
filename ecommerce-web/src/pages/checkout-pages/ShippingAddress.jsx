import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { PropTypes } from "prop-types";
import { toast } from "sonner";
import SelectAddressModal from "./SelectAddressModal.jsx";
import GCashLogo from "../../../../public/static/gcash-logo.svg";
import BPILogo from "../../../../public/static/bpi-logo.svg";
import GCashQR from "../../../../public/static/gcash-qr.jpg";
import { FaRegAddressCard } from "react-icons/fa";

const ShippingAddress = ({
  profileData,
  loading,
  setLoading,
  barangays,
  setBarangays,
  formDetails,
  setFormDetails,
  uploadedPaymentMethod,
  setUploadedPaymentMethod,
  handleCompleteOrder,
  receiptFile,
  setReceiptFile,
  setReceiptFileName,
  errors,
  setErrors,
}) => {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    // Validate field on change
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));

    setFormDetails((prevFormDetails) => {
      let updatedData = { ...prevFormDetails };

      if (name === "region") {
        const selectedRegion = regions.find((r) => r.code === value);
        const shippingFee = shippingFeeByRegion[selectedRegion?.name] || 0;
        updatedData.region = {
          name: selectedRegion ? selectedRegion.name : "",
          code: value,
        };
        updatedData.shipping_fee = shippingFee;
        updatedData.province = { name: "", code: "" };
        updatedData.city = { name: "", code: "" };
        updatedData.barangay = { name: "", code: "" };
        fetchProvinces(value);
      } else if (name === "province") {
        const selectedProvince = provinces.find((p) => p.code === value);
        updatedData.province = {
          name: selectedProvince ? selectedProvince.name : "",
          code: value,
        };
        updatedData.city = { name: "", code: "" };
        updatedData.barangay = { name: "", code: "" };
        fetchCities(value);
      } else if (name === "city") {
        const selectedCity = cities.find((c) => c.code === value);
        updatedData.city = {
          name: selectedCity ? selectedCity.name : "",
          code: value,
        };
        updatedData.barangay = { name: "", code: "" };
        fetchBarangays(value);
      } else if (name === "barangay") {
        const selectedBarangay = barangays.find((b) => b.code === value);
        updatedData.barangay = {
          name: selectedBarangay ? selectedBarangay.name : "",
          code: value,
        };
      } else {
        updatedData[name] = value;
      }

      return updatedData;
    });
  };

  const handleFileChange = (e, method) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        if (base64String) {
          localStorage.setItem("proof_image", base64String);
          localStorage.setItem("proof_image_name", file.name);
          setReceiptFile(base64String);
          setReceiptFileName(file.name);
          setUploadedPaymentMethod(method);
          localStorage.setItem("uploadedPaymentMethod", method);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file removal: clear the base64 image and file name from state and local storage
  const handleRemoveFile = () => {
    setReceiptFile(null);
    setReceiptFileName("");
    setUploadedPaymentMethod(null);
    localStorage.removeItem("proof_image");
    localStorage.removeItem("proof_image_name");
  };

  useEffect(() => {
    if (receiptFile) {
      localStorage.setItem("proof_image", receiptFile);
    }
  }, [receiptFile]);

  useEffect(() => {
    if (formDetails.region.code) {
      fetchProvinces(formDetails.region.code);
    }
    if (formDetails.province.code) {
      fetchCities(formDetails.province.code);
    }
    if (formDetails.city.code) {
      fetchBarangays(formDetails.city.code);
    }
  }, [
    formDetails.region.code,
    formDetails.province.code,
    formDetails.city.code,
  ]);

  const handleOpenAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  const handleSaveAddress = async (address) => {
    try {
      setLoading(true);
      // Set form details for the selected address
      setFormDetails((prevFormDetails) => ({
        ...prevFormDetails,
        shipping_address_id: address.shipping_address_id,
        email: profileData.profiles.email,
        firstName: address.first_name,
        lastName: address.last_name,
        street: address.address_line,
        region: {
          name: address.region?.name || "",
          code: address.region?.code || "",
        },
        province: {
          name: address.province?.name || "",
          code: address.province?.code || "",
        },
        city: {
          name: address.city?.name || "",
          code: address.city?.code || "",
        },
        barangay: {
          name: address.barangay?.name || "",
          code: address.barangay?.code || "",
        },
        phoneNumber: address.phone_number,
        postalCode: address.zip_code,
        shipping_fee: address.shipping_fee,
      }));

      if (address.region?.code) {
        await fetchProvinces(address.region.code);
      }
      if (address.province?.code) {
        await fetchCities(address.province.code);
      }
      if (address.city?.code) {
        await fetchBarangays(address.city.code);
      }
      console.log("Selected address:", formDetails);
      setIsAddressModalOpen(false);
    } catch (error) {
      toast.error("Failed to save address. Please try again.");
      console.error("Failed to save address:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name, value) => {
    let error = "";
    if (!value) {
      error = "Field is required";
    }
    return error;
  };

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

  const shippingFeeByRegion = useMemo(
    () => ({
      "Region 1": 105,
      "Region 2": 105,
      "Region 3": 105,
      "Region 4-A": 105,
      "Region 4-B": 115,
      "Region 5": 105,
      "Region 6": 105,
      "Region 7": 105,
      "Region 8": 105,
      "Region 9": 85,
      "Region 10": 85,
      "Region 11": 85,
      "Region 12": 85,
      "Region 13": 85,
      NCR: 105,
      CAR: 105,
      BARMM: 85,
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
    if (!cityCode) return [];
    try {
      const response = await axios.get(`https://psgc.gitlab.io/api/barangays/`);
      const filteredBarangays = response.data.filter(
        (barangay) => barangay.cityCode === cityCode,
      );
      setBarangays(filteredBarangays);
      return filteredBarangays;
    } catch (error) {
      console.error("Error fetching barangays:", error);
      return [];
    }
  };

  const renderError = (field) => {
    if (errors[field]) {
      return <span className="text-red-500 text-xs">{errors[field]}</span>;
    }
  };

  return (
    <div className="relative">
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 pointer-events-none">
          <ClipLoader size={50} color="#E53E3E" loading={loading} />
        </div>
      )}

      {/* Customer Info Section */}
      <div className="w-full lg:6/8">
        <h2 className="text-xl font-semibold mb-4 text-gray-500">Contact</h2>

        <div className="relative mb-6">
          <input
            type="text"
            name="email"
            value={formDetails.email}
            onChange={handleInputChange}
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
          {renderError("email")}
        </div>

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold mb-4 text-gray-500 flex items-center">
            Shipping Information
          </h2>
          {profileData?.profiles && (
            <button
              className="ml-4 bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b 
                          hover:from-[#F8587A] hover:to-[#FE699F] text-white font-normal py-1 px-3 rounded-md 
                          focus:outline-none flex items-center"
              onClick={handleOpenAddressModal}
            >
              <FaRegAddressCard className="mr-2" /> Select Address
            </button>
          )}

          {/* Render the modal conditionally */}
          {isAddressModalOpen && (
            <SelectAddressModal
              profileData={profileData}
              onClose={handleCloseAddressModal}
              onSave={handleSaveAddress}
              shippingFeeByRegion={shippingFeeByRegion}
              formDetails={formDetails}
            />
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
            {renderError("firstName")}
          </div>

          <div className="relative w-full">
            <input
              type="text"
              id="lastName"
              name="lastName"
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
            {renderError("lastName")}
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
            Street and house number
          </label>
          {renderError("street")}
        </div>

        <div className="relative mb-4">
          <select
            id="region"
            name="region"
            value={formDetails.region.code}
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
          {renderError("region")}
        </div>

        <div className="relative mb-4">
          <select
            id="province"
            name="province"
            value={formDetails.province.code}
            onChange={handleInputChange}
            className={`block w-full px-3 pb-2 pt-4 text-base text-gray-900 bg-transparent
                rounded-lg border border-gray-300 appearance-none focus:outline-none 
                focus:ring-0 focus:border-alofa-pink peer`}
            disabled={!formDetails.region.code}
            placeholder=""
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
          {renderError("province")}
        </div>

        <div className="relative mb-4">
          <select
            id="city"
            name="city"
            value={formDetails.city.code}
            onChange={handleInputChange}
            className={`block w-full px-3 pb-2 pt-4 text-base text-gray-900 bg-transparent
                  rounded-lg border border-gray-300 appearance-none focus:outline-none 
                  focus:ring-0 focus:border-alofa-pink peer`}
            disabled={!formDetails.province.code}
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
          {renderError("city")}
        </div>

        <div className="relative mb-4">
          <select
            id="barangay"
            name="barangay"
            value={formDetails.barangay.code}
            onChange={handleInputChange}
            className={`block w-full px-3 pb-2 pt-4 text-base text-gray-900 bg-transparent
                    rounded-lg border border-gray-300 appearance-none focus:outline-none 
                    focus:ring-0 focus:border-alofa-pink peer`}
            disabled={!formDetails.city.code || barangays.length === 0}
            placeholder=""
          >
            <option value="">Select Barangay</option>
            {barangays.length === 0 ? (
              <option value="">No Barangay</option>
            ) : (
              barangays.map((barangay) => (
                <option key={barangay.code} value={barangay.code}>
                  {barangay.name}
                </option>
              ))
            )}
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
          {renderError("phoneNumber")}
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
          {renderError("postalCode")}
        </div>

        {/* Payment and Submit Button */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-500">Payment</h2>
          <div className="accordion overflow-hidden">
            {/* Gcash Payment */}
            <div
              className={`border rounded-lg p-4 mb-4 cursor-pointer transition-all duration-700 ease-in-out ${
                formDetails.paymentMethod === "GCash"
                  ? "max-h-screen"
                  : "max-h-20"
              }`}
            >
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="GCash"
                    checked={formDetails.paymentMethod === "GCash"}
                    onChange={() => {
                      setFormDetails({
                        ...formDetails,
                        paymentMethod: "GCash",
                      });
                    }}
                    disabled={
                      uploadedPaymentMethod && uploadedPaymentMethod !== "GCash"
                    }
                  />
                  <span className="font-bold">Gcash</span>
                </label>
                <img src={GCashLogo} alt="GCash Logo" className="w-10" />
              </div>
              {formDetails.paymentMethod === "GCash" && (
                <div className="mt-4">
                  <p className="text-sm mb-2">
                    Please scan the QR code below to complete the payment:
                  </p>
                  <img
                    src={GCashQR}
                    alt="GCash QR Code"
                    className="w-32 h-32 mb-4"
                  />
                  <label className="bg-gray-600 hover:bg-gray-800 text-white py-2 px-4 rounded w-40 whitespace-normal text-center inline-block">
                    Upload receipt
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => handleFileChange(e, "GCash")}
                      style={{ display: "none" }}
                      disabled={
                        uploadedPaymentMethod &&
                        uploadedPaymentMethod !== "GCash"
                      }
                    />
                  </label>

                  {uploadedPaymentMethod === "GCash" && receiptFile && (
                    <div className="flex items-center mt-2">
                      <p className="italic text-gray-400 text-sm">
                        File: <b className="text-black">{receiptFile.name}</b>
                      </p>
                      <img
                        src={receiptFile}
                        alt="Uploaded Proof"
                        className="w-32 h-32 object-cover"
                      />
                      <button
                        onClick={handleRemoveFile}
                        className="ml-2 text-red-500 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bank Transfer */}
            <div
              className={`border rounded-lg p-4 mb-4 cursor-pointer transition-all duration-700 ease-in-out ${
                formDetails.paymentMethod === "Bank Transfer"
                  ? "max-h-screen"
                  : "max-h-20"
              }`}
            >
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Bank Transfer"
                    checked={formDetails.paymentMethod === "Bank Transfer"}
                    onChange={() => {
                      setFormDetails({
                        ...formDetails,
                        paymentMethod: "Bank Transfer",
                      });
                    }}
                    disabled={
                      uploadedPaymentMethod &&
                      uploadedPaymentMethod !== "Bank Transfer"
                    }
                  />
                  <span className="font-bold">Bank Transfer</span>
                </label>
                <img src={BPILogo} alt="Bank Transfer Logo" className="w-10" />
              </div>
              {formDetails.paymentMethod === "Bank Transfer" && (
                <div className="mt-4">
                  <p className="text-sm mb-2">Bank details for transfer:</p>
                  <p className="text-sm">
                    Bank Name: <b>Bank of the Philippine Islands</b>
                  </p>
                  <p className="text-sm">
                    Account Number: <b>1234-5678-9012</b>
                  </p>
                  <p className="text-sm">Account Name: Alofa Haircare</p>
                  <label className="bg-gray-600 hover:bg-gray-800 text-white py-2 px-4 rounded w-40 whitespace-normal text-center inline-block">
                    Upload receipt
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => handleFileChange(e, "Bank Transfer")}
                      style={{ display: "none" }}
                      disabled={
                        uploadedPaymentMethod &&
                        uploadedPaymentMethod !== "Bank Transfer"
                      }
                    />
                  </label>
                  {uploadedPaymentMethod === "Bank Transfer" && receiptFile && (
                    <div className="flex items-center mt-2">
                      <p className="italic text-gray-400 text-sm">
                        File: <b className="text-black">{receiptFile.name}</b>
                      </p>
                      <img
                        src={receiptFile}
                        alt="Uploaded Proof"
                        className="w-32 h-32 object-cover"
                      />
                      <button
                        onClick={handleRemoveFile}
                        className="ml-2 text-red-500 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="mb-6">
              <button
                onClick={handleCompleteOrder}
                className="font-extrabold text-white py-2 px-4 rounded-full focus:outline-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] hover:to-[#FE699F]"
              >
                COMPLETE ORDER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Adding prop validation using PropTypes
ShippingAddress.propTypes = {
  profileData: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
  barangays: PropTypes.array.isRequired,
  setBarangays: PropTypes.func.isRequired,
  formDetails: PropTypes.shape({
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    street: PropTypes.string.isRequired,
    region: PropTypes.shape({
      name: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
    }).isRequired,
    province: PropTypes.shape({
      name: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
    }).isRequired,
    city: PropTypes.shape({
      name: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
    }).isRequired,
    barangay: PropTypes.shape({
      name: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
    }).isRequired,
    phoneNumber: PropTypes.string.isRequired,
    postalCode: PropTypes.string.isRequired,
    paymentMethod: PropTypes.string.isRequired,
    shipping_address_id: PropTypes.number,
  }).isRequired,
  setFormDetails: PropTypes.func.isRequired,
  uploadedPaymentMethod: PropTypes.string,
  setUploadedPaymentMethod: PropTypes.func.isRequired,
  handleCompleteOrder: PropTypes.func.isRequired,
  receiptFile: PropTypes.string,
  setReceiptFile: PropTypes.func.isRequired,
  setReceiptFileName: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  setErrors: PropTypes.func.isRequired,
};

export default ShippingAddress;
