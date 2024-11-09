import { useEffect } from "react";
import Receipt from "../../components/Receipt";
import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract order, order_items, and formDetails from location.state
  const {
    order = {},
    order_items = [],
    formDetails = {},
  } = location.state || {};

  // If location.state is undefined or missing order data, redirect to home
  useEffect(() => {
    if (!location.state || !order.order_id) {
      navigate("/", { replace: true });
    }
  }, [location.state, navigate, order.order_id]);

  console.log("OrderConfirmation state:", location.state);

  const orderDetails = {
    order,
    order_items,
  };

  // Determine the shipping address to display
  const shippingAddress = order.shipping_address || formDetails;

  // Prevent going back to checkout by redirecting to home if back button is pressed
  useEffect(() => {
    const handleBackNavigation = () => {
      navigate("/", { replace: true });
    };

    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", handleBackNavigation);

    return () => {
      window.removeEventListener("popstate", handleBackNavigation);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col lg:flex-row justify-between p-8 pt-36 lg:px-48 min-h-screen h-full">
      <div className="absolute inset-0 bg-[url('../../../public/images/alofa-white-bg.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-white opacity-90"></div>
      </div>
      {/* Main Content (Thank You and Billing Address) */}
      <div className="relative z-10 w-full lg:w-1/2 lg:mr-4 overflow-visible">
        <div className="overflow-visible">
          <h1 className="text-7xl font-bold font-heading gradient-heading mb-4 leading-tight">
            Thank you for your purchase!
          </h1>
          <p className="text-gray-600 mb-3">
            Your order will be verified within 24 hours upon checking out. We
            will notify you by email once your order has been shipped.
          </p>
        </div>

        {/* Billing Address Section */}
        <div className="relative z-10 billing-address mt-6">
          <h2 className="text-2xl font-semibold font-heading mb-3 text-alofa-pink">
            Billing Address
          </h2>

          {shippingAddress &&
          (shippingAddress.firstName || shippingAddress.first_name) ? (
            <div className="grid grid-cols-4 gap-y-2 text-gray-600">
              {/* Labels */}
              <p className="col-span-1 text-base font-bold m-0">Name</p>
              <p className="col-span-3 text-gray-600 text-base m-0">
                {shippingAddress.firstName || shippingAddress.first_name}{" "}
                {shippingAddress.lastName || shippingAddress.last_name}
              </p>

              <p className="col-span-1 text-base font-bold m-0">Address</p>
              <p className="col-span-3 text-base m-0">
                {shippingAddress.street || shippingAddress.address_line},
                {shippingAddress.barangay?.name || shippingAddress.barangay
                  ? ` ${shippingAddress.barangay.name || shippingAddress.barangay},`
                  : ""}
                {shippingAddress.city?.name || shippingAddress.city
                  ? ` ${shippingAddress.city.name || shippingAddress.city},`
                  : ""}
                {shippingAddress.province?.name || shippingAddress.province
                  ? ` ${shippingAddress.province.name || shippingAddress.province},`
                  : ""}
                {shippingAddress.region?.name || shippingAddress.region
                  ? ` ${shippingAddress.region.name || shippingAddress.region}, `
                  : ""}
                {shippingAddress.postalCode || shippingAddress.zip_code}
              </p>

              <p className="col-span-1 text-base font-bold m-0">Phone</p>
              <p className="col-span-3 text-base m-0">
                {shippingAddress.phoneNumber || shippingAddress.phone_number}
              </p>

              <p className="col-span-1 text-base font-bold m-0">Email</p>
              <p className="col-span-3 text-base m-0">
                {order.customer_email || formDetails.email}
              </p>
            </div>
          ) : (
            <p className="text-gray-600">No billing address provided.</p>
          )}
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="relative z-10 w-full lg:w-1/2 lg:ml-6 mt-0 lg:mt-0 self-start">
        <Receipt orderDetails={orderDetails} />
      </div>
    </div>
  );
};

export default OrderConfirmation;
