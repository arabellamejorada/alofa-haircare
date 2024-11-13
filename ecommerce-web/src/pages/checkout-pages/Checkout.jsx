import React, { useContext, useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../components/CartContext.jsx";
import { AuthContext } from "../../components/AuthContext.jsx";
import { getCustomerByProfileId } from "../../api/customer.js";
import { getCartByCustomerId, applyVoucher } from "../../api/cart.js";
import { createOrder } from "../../api/order.js";
import ShippingAddress from "./ShippingAddress.jsx";

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const voucherInputRef = useRef(null);
  const {
    cartItems,
    setCartItems,
    subtotal,
    updateCartContext,
    resetSubtotal,
  } = useContext(CartContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [barangays, setBarangays] = useState([]);
  const [voucherId, setVoucherId] = useState(null);
  const [errors, setErrors] = useState([]);

  const [voucherDiscount, setVoucherDiscount] = useState(() =>
    Number(localStorage.getItem("checkoutVoucherDiscount") || 0),
  );
  const [voucherCode, setVoucherCode] = useState(
    () => localStorage.getItem("checkoutVoucherCode") || "",
  );

  const [receiptFile, setReceiptFile] = useState(() => {
    return localStorage.getItem("proof_image") || null;
  });
  const [receiptFileName, setReceiptFileName] = useState(() => {
    return localStorage.getItem("proof_image_name") || "";
  });
  const [uploadedPaymentMethod, setUploadedPaymentMethod] = useState(() => {
    return localStorage.getItem("uploadedPaymentMethod") || null;
  });

  const navigate = useNavigate();

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
          shipping_address_id: null,
        };
  });

  useEffect(() => {
    const savedProofImage = localStorage.getItem("proof_image");
    const savedProofImageName = localStorage.getItem("proof_image_name");
    const savedPaymentMethod = localStorage.getItem("uploadedPaymentMethod");
    const savedCartItems = JSON.parse(
      localStorage.getItem("checkoutCartItems"),
    );
    if (savedCartItems) {
      setCartItems(savedCartItems);
    }
    if (savedProofImage && savedProofImage.startsWith("data:image")) {
      setReceiptFile(savedProofImage);
      setReceiptFileName(savedProofImageName || "");
      setUploadedPaymentMethod(savedPaymentMethod || null);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("checkoutCartItems", JSON.stringify(cartItems));
    console.log("Updated Cart Items:", cartItems);
  }, [cartItems]);

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

  // Load saved state from local storage when component mounts
  useEffect(() => {
    const savedFormDetails = JSON.parse(
      localStorage.getItem("checkoutFormDetails"),
    );
    const savedVoucherCode = localStorage.getItem("checkoutVoucherCode");
    const savedVoucherDiscount = localStorage.getItem(
      "checkoutVoucherDiscount",
    );

    if (savedFormDetails) setFormDetails(savedFormDetails);
    if (savedVoucherCode) setVoucherCode(savedVoucherCode);
    if (savedVoucherDiscount) setVoucherDiscount(Number(savedVoucherDiscount));
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

  const validateErrors = () => {
    const newErrors = {};

    if (!formDetails.firstName) {
      newErrors.firstName = "First name is required.";
    }
    if (!formDetails.lastName) {
      newErrors.lastName = "Last name is required.";
    }
    if (!formDetails.email) {
      newErrors.email = "Email is required.";
    }
    if (!formDetails.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required.";
    }
    if (!formDetails.street) {
      newErrors.street = "Address is required.";
    }
    if (!formDetails.region.code) {
      newErrors.region = "Region is required.";
    }
    if (!formDetails.province.code) {
      newErrors.province = "Province is required.";
    }
    if (!formDetails.city.code) {
      newErrors.city = "City is required.";
    }
    if (!formDetails.postalCode) {
      newErrors.postalCode = "Postal code is required.";
    }
    if (!formDetails.paymentMethod) {
      newErrors.paymentMethod = "Payment method is required.";
    }

    setErrors(newErrors);
  };

  const handleCompleteOrder = async () => {
    try {
      setLoading(true);

      validateErrors();
      if (Object.keys(errors).length > 0) {
        toast.error("Please fill out all required fields.");
        setLoading(false);
        return;
      }

      // Only require barangay if there are barangays available
      if (barangays.length > 0 && !formDetails.barangay.code) {
        toast.error("Field is required.");
        setLoading(false);
        return;
      }

      const formData = new FormData();

      // Explicitly define the orderDetails object with necessary fields
      const orderDetails = {
        customer_id: profileData.customer_id,
        subtotal: subtotal,
        voucher_id: voucherId,
        total_discount: voucherDiscount,
        total_amount: subtotal + 200 - voucherDiscount,
        shipping_address_id: formDetails.shipping_address_id,
        paymentMethod: formDetails.paymentMethod,
        shipping_fee: 200,
      };

      formData.append("orderDetails", JSON.stringify(orderDetails));
      formData.append("cartItems", JSON.stringify(cartItems));

      if (receiptFile) {
        // Extract MIME type and base64 data from the data URL
        const mimeType = receiptFile.match(/data:(.*);base64,/)[1];
        const base64Data = receiptFile.replace(/^data:image\/\w+;base64,/, "");

        // Convert base64 to binary data
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });

        // Use the stored filename or provide a default
        const fileName = receiptFileName || "receipt_image.jpg";

        // Append the image blob with filename
        formData.append("proof_image", blob, fileName);
      }

      // Log all formData contents
      console.log("Creating order with form data:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
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
        setLoading(false);
        return;
      }

      try {
        updateCartContext([]);
        resetSubtotal();
      } catch (error) {
        toast.error("Failed to clear cart. Please refresh the page.");
        console.error("Failed to clear cart:", error);
      }

      // Optional delay to confirm order creation or allow for backend processing
      await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay

      // Get customer cart
      await getCartByCustomerId(profileData.profiles.id);

      navigate("/order-confirmed", {
        state: {
          formDetails,
          order,
          order_items,
        },
      });

      // Clear local storage and reset state after order is completed
      handleClearCheckoutData();
      setReceiptFile(null);
      setUploadedPaymentMethod(null);
    } catch (error) {
      toast.error("Please fill out all required fields.");
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
        setLoading(false);
        return;
      }

      const response = await applyVoucher(
        voucherCode,
        subtotal,
        profileData.customer_id,
        cartItems,
      );

      console.log("Voucher response:", response);
      if (response.error) {
        toast.error(response.error);
        setLoading(false);
        return;
      }

      // Successfully applied voucher
      const { discount, voucher_id, updatedCartItems } = response;
      setVoucherDiscount(discount);
      setVoucherId(voucher_id);

      // Update cart items with discounted prices and save to local storage
      const discountedCartItems = updatedCartItems.map((item) => ({
        ...item,
        discounted_price: item.discounted_price,
      }));
      setCartItems(discountedCartItems);
      localStorage.setItem(
        "checkoutCartItems",
        JSON.stringify(discountedCartItems),
      );
      localStorage.setItem("checkoutVoucherCode", voucherCode);
      localStorage.setItem("checkoutVoucherDiscount", discount);

      toast.success(
        `Voucher applied successfully! You saved ₱${discount.toLocaleString(
          "en-US",
          { minimumFractionDigits: 2, maximumFractionDigits: 2 },
        )}`,
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
    setVoucherId(null);

    const originalCartItems = cartItems.map((item) => {
      const updatedItem = { ...item };
      delete updatedItem.discounted_price; // Remove discounted price
      return updatedItem;
    });

    setCartItems(originalCartItems);
    localStorage.setItem(
      "checkoutCartItems",
      JSON.stringify(originalCartItems),
    );

    if (voucherInputRef.current) {
      voucherInputRef.current.value = "";
    }

    toast.info("Voucher removed successfully");
  };

  const handleClearCheckoutData = () => {
    localStorage.removeItem("checkoutFormDetails");
    localStorage.removeItem("checkoutVoucherCode");
    localStorage.removeItem("checkoutVoucherDiscount");
    localStorage.removeItem("checkoutCartItems");
    localStorage.removeItem("proof_image");
    localStorage.removeItem("receiptFile");
    localStorage.removeItem("uploadedPaymentMethod");
  };

  return (
    <div className="pt-15 bg-white p-8 flex justify-center">
      <div className="flex flex-col lg:flex-row items-start justify-between w-full max-w-5xl gap-8">
        {/* Customer/Shipping Information Section */}
        <div className="w-full lg:w-3/5 mb-8">
          <ShippingAddress
            user={user}
            profileData={profileData}
            loading={loading}
            setLoading={setLoading}
            barangays={barangays}
            setBarangays={setBarangays}
            formDetails={formDetails}
            setFormDetails={setFormDetails}
            uploadedPaymentMethod={uploadedPaymentMethod}
            setUploadedPaymentMethod={setUploadedPaymentMethod}
            handleCompleteOrder={handleCompleteOrder}
            receiptFile={receiptFile}
            setReceiptFile={setReceiptFile}
            receiptFileName={receiptFileName}
            setReceiptFileName={setReceiptFileName}
            errors={errors}
            setErrors={setErrors}
          />
        </div>

        {/* Order Summary Section */}
        <div className="w-full lg:w-2/5 lg:sticky lg:top-20">
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
                  <p className="text-sm text-gray-500">
                    ₱
                    {item.unit_price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    {item.value && item.value !== "N/A"
                      ? ", " + item.value
                      : ""}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  {item.discounted_price ? (
                    <>
                      <p className="font-bold text-gray-500 line-through">
                        ₱
                        {(item.unit_price * item.quantity).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                      </p>
                      <p className="font-bold text-red-500">
                        ₱
                        {(item.discounted_price * item.quantity).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                      </p>
                    </>
                  ) : (
                    <p className="font-bold text-gray-500">
                      ₱
                      {(item.unit_price * item.quantity).toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}
                    </p>
                  )}
                </div>
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
                    [{voucherCode}] Remove
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
  );
};

export default Checkout;
