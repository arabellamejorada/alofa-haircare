import {
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../components/CartContext.jsx";
import SelectAddressModal from "./SelectAddressModal.jsx";
import GCashLogo from "../../../../public/static/gcash-logo.svg";
import BPILogo from "../../../../public/static/bpi-logo.svg";
import GCashQR from "../../../../public/static/gcash-qr.jpg";
import axios from "axios";
import { FaRegAddressCard } from "react-icons/fa";
import { AuthContext } from "../../components/AuthContext.jsx";
import { getCustomerByProfileId } from "../../api/customer.js";
import { getCartByCustomerId, applyVoucher } from "../../api/cart.js";
import { createOrder } from "../../api/order.js";

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const voucherInputRef = useRef(null);

  const { cartItems, subtotal, updateCartContext } = useContext(CartContext);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voucherId, setVoucherId] = useState(null);
  const [voucherDiscount, setVoucherDiscount] = useState(() =>
    Number(localStorage.getItem("checkoutVoucherDiscount") || 0),
  );
  const [voucherCode, setVoucherCode] = useState(
    () => localStorage.getItem("checkoutVoucherCode") || "",
  );

  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const [receiptFile, setReceiptFile] = useState(null);
  const [uploadedPaymentMethod, setUploadedPaymentMethod] = useState(null);

  useEffect(() => {
    console.log("Checkout Cart Items:", cartItems);
  }, [cartItems]);

  const handleFileChange = (e, method) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
      setUploadedPaymentMethod(method);
    }
  };

  const handleRemoveFile = () => {
    setReceiptFile(null);
    setUploadedPaymentMethod(null);
  };

  const [formDetails, setFormDetails] = useState(() => {
    const savedFormDetails = localStorage.getItem("checkoutFormDetails");
    return savedFormDetails
      ? JSON.parse(savedFormDetails)
      : {
          email: "",
          firstName: "",
          lastName: "",
          street: "",
          region: { name: "", code: "" },
          province: { name: "", code: "" },
          city: { name: "", code: "" },
          barangay: { name: "", code: "" },
          phoneNumber: "",
          postalCode: "",
          paymentMethod: "",
        };
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const data = await getCustomerByProfileId(user.id);
        setProfileData(data);
      } catch (error) {
        console.error("Failed to fetch customer profile", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchProfileData();
    }
  }, [user]);

  useEffect(() => {
    console.log("Checkout Cart Items:", cartItems);
  }, [cartItems]);

  // Load saved state from local storage when component mounts
  useEffect(() => {
    const savedFormDetails = JSON.parse(
      localStorage.getItem("checkoutFormDetails"),
    );
    const savedVoucherCode = localStorage.getItem("checkoutVoucherCode");
    const savedVoucherDiscount = localStorage.getItem(
      "checkoutVoucherDiscount",
    );

    const savedProofImage = localStorage.getItem("proof_image");

    if (savedFormDetails) setFormDetails(savedFormDetails);
    if (savedVoucherCode) setVoucherCode(savedVoucherCode);
    if (savedVoucherDiscount) setVoucherDiscount(Number(savedVoucherDiscount));
    if (savedProofImage) setReceiptFile(savedProofImage);
  }, []);

  useEffect(() => {
    localStorage.setItem("checkoutFormDetails", JSON.stringify(formDetails));
  }, [formDetails]);

  useEffect(() => {
    localStorage.setItem("checkoutVoucherCode", voucherCode);
  }, [voucherCode]);

  useEffect(() => {
    localStorage.setItem("checkoutVoucherDiscount", voucherDiscount);
  }, [voucherDiscount]);

  useEffect(() => {
    localStorage.setItem("proof_image", receiptFile);
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

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    setFormDetails((prevFormDetails) => {
      let updatedData = { ...prevFormDetails, [name]: value };

      if (name === "region") {
        updatedData = {
          ...updatedData,
          province: { name: "", code: "" },
          city: { name: "", code: "" },
          barangay: { name: "", code: "" },
        };
        fetchProvinces(value);
      } else if (name === "province") {
        updatedData = {
          ...updatedData,
          city: { name: "", code: "" },
          barangay: { name: "", code: "" },
        };
        fetchCities(value);
      } else if (name === "city") {
        updatedData = {
          ...updatedData,
          barangay: { name: "", code: "" },
        };
        fetchBarangays(value);
      }

      return updatedData;
    });
  };

  const handleCompleteOrder = async () => {
    try {
      setLoading(true);
      if (
        !formDetails.firstName ||
        !formDetails.lastName ||
        !formDetails.email ||
        !formDetails.phoneNumber ||
        !formDetails.paymentMethod ||
        !formDetails.region ||
        !formDetails.province ||
        !formDetails.city
      ) {
        toast.error("Please fill out all required fields.");
        return;
      }

      // Only require barangay if there are barangays available
      if (barangays.length > 0 && !formDetails.barangay) {
        toast.error("Please select a barangay.");
        return;
      }

      const formData = new FormData();

      formData.append(
        "orderDetails",
        JSON.stringify({
          ...formDetails,
          customer_id: profileData.customer_id,
          subtotal: subtotal,
          voucher_id: voucherId,
          total_discount: voucherDiscount,
          total_amount: subtotal + 200 - voucherDiscount,
          shipping_address_id: formDetails.shipping_address_id,
        }),
      );

      formData.append("cartItems", JSON.stringify(cartItems));

      if (receiptFile) {
        formData.append("proof_image", receiptFile);
      }

      let order, order_items;
      try {
        const response = await createOrder(formData);
        console.log("Create Order Response:", response);
        order = response.order;
        order_items = response.order_items;
      } catch (error) {
        console.error("Failed to create order:", error);
        toast.error("Failed to create order. Please try again.");
        return;
      }

      try {
        updateCartContext([]);
      } catch (error) {
        toast.error("Failed to clear cart. Please refresh the page.", error);
      }

      // Optional delay to confirm order creation or allow for backend processing
      await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay

      //get customer cart
      await getCartByCustomerId(profileData.profiles.id);
      navigate("/order-confirmed", {
        state: {
          formDetails,
          order,
          order_items,
        },
      });

      // Clear local storage after order is completed
      handleClearCheckoutData();
    } catch (error) {
      toast.error("Failed to complete order. Please try again.");
      console.error("Failed to complete order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyVoucher = async () => {
    try {
      setLoading(true);

      const voucherCode = voucherInputRef.current.value;
      if (!voucherCode) {
        toast.error("Please enter a voucher code.");
        return;
      }

      const response = await applyVoucher(
        voucherCode,
        subtotal,
        profileData.customer_id,
      );
      console.log("Voucher response:", response);
      if (response.error) {
        toast.error(response.error);
        return;
      }

      // Successfully applied voucher
      const { discount, voucher_id } = response;
      setVoucherDiscount(discount);
      setVoucherId(voucher_id);

      toast.success(
        `Voucher applied successfully! You saved ₱${(discount || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      );
      voucherInputRef.current.value = "";
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to apply voucher. Please try again.");
      }
      console.error("Failed to apply voucher:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Updated Voucher applied ID:", voucherId);
    console.log("Updated Voucher applied discount:", voucherDiscount);
  }, [voucherId, voucherDiscount]);

  const handleRemoveVoucher = () => {
    setVoucherDiscount(0);
    if (voucherInputRef.current) {
      voucherInputRef.current.value = "";
    }
    toast.info("Voucher removed successfully");
  };

  const handleClearCheckoutData = () => {
    localStorage.removeItem("checkoutFormDetails");
    localStorage.removeItem("checkoutVoucherCode");
    localStorage.removeItem("checkoutVoucherDiscount");
  };

  return (
    <div className="relative">
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 pointer-events-none">
          <ClipLoader size={50} color="#E53E3E" loading={loading} />
        </div>
      )}
      <div className="pt-15 bg-white p-8 flex justify-center">
        <div className="flex flex-col lg:flex-row items-start justify-between w-full max-w-5xl gap-8">
          {/* Customer Info Section */}
          <div className="w-full lg:w-2/3">
            <h2 className="text-xl font-semibold mb-4 text-gray-500">
              Contact
            </h2>

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
                <SelectAddressModal
                  profileData={profileData}
                  onClose={handleCloseAddressModal}
                  onSave={handleSaveAddress}
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
                disabled={!formDetails.region}
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
                value={formDetails.barangay.code}
                onChange={handleInputChange}
                className={`block w-full px-3 pb-2 pt-4 text-base text-gray-900 bg-transparent
                    rounded-lg border border-gray-300 appearance-none focus:outline-none 
                    focus:ring-0 focus:border-alofa-pink peer`}
                disabled={!formDetails.city || barangays.length === 0}
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
                  className={`border rounded-lg p-4 mb-4 cursor-pointer transition-all duration-700 ease-in-out ${formDetails.paymentMethod === "GCash" ? "max-h-screen" : "max-h-20"}`}
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
                          uploadedPaymentMethod &&
                          uploadedPaymentMethod !== "GCash"
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
                            File:{" "}
                            <b className="text-black">{receiptFile.name}</b>
                          </p>
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
                        disabled={
                          uploadedPaymentMethod &&
                          uploadedPaymentMethod !== "bank"
                        }
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
                      <label className="bg-gray-600 hover:bg-gray-800 text-white py-2 px-4 rounded w-40 whitespace-normal text-center inline-block">
                        Upload receipt
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => handleFileChange(e, "bank")}
                          style={{ display: "none" }}
                          disabled={
                            uploadedPaymentMethod &&
                            uploadedPaymentMethod !== "bank"
                          }
                        />
                      </label>
                      {uploadedPaymentMethod === "bank" && receiptFile && (
                        <div className="flex items-center mt-2">
                          <p className="italic text-gray-400 text-sm">
                            File:{" "}
                            <b className="text-black">{receiptFile.name}</b>
                          </p>
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
              {cartItems.reduce((total, item) => total + item.quantity, 0)}{" "}
              items
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
                    <p className="text-sm text-gray-500">
                      {item.variant?.type} {item.variant?.value}
                    </p>
                  </div>
                  <p className="font-bold text-gray-500">₱{item.unit_price}</p>
                </div>
              ))}
            </div>

            {/* Discount Voucher Section */}
            <div className="flex items-center mb-4">
              <input
                id="voucher"
                type="text"
                ref={voucherInputRef}
                onChange={(e) => setVoucherCode(e.target.value)} // Update voucherCode state on change
                placeholder="Discount voucher code"
                className="w-2/3 border p-3 rounded"
                disabled={voucherDiscount > 0} // Disable if a voucher is applied
              />
              <button
                type="button"
                onClick={handleApplyVoucher}
                className="bg-pink-300 w-1/3 p-3 ml-2 rounded"
                disabled={voucherDiscount > 0} // Disable if a voucher is applied
              >
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
                <span>
                  ₱
                  {subtotal.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </p>
              <p className="flex justify-between mb-2 text-gray-500">
                <span>Shipping Fee</span>₱
                {(200).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
              </p>

              {voucherDiscount > 0 && (
                <div className="flex justify-between items-center mb-2 text-gray-500">
                  <span>Discount voucher</span>
                  <div className="flex items-center">
                    <button
                      onClick={handleRemoveVoucher}
                      className="ml-2 text-sm text-red-500 hover:text-red-700"
                    >
                      [{voucherCode}]Remove
                    </button>
                    <span>
                      -₱
                      {voucherDiscount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              )}

              <p className="flex justify-between font-bold text-3xl">
                <span>Total</span>
                <span>
                  ₱
                  {(subtotal + 200 - voucherDiscount).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
