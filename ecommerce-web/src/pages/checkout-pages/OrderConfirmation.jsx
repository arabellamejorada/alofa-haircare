import Receipt from "../../components/Receipt";
import { useLocation } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation();
  const { formDetails = {}, cartItems = [], subtotal = 0, paymentMethod = "" } = location.state || {};

  console.log("OrderConfirmation state:", location.state);

  return (
    <div className="bg-alofa-bg-white flex flex-col lg:flex-row justify-between p-8 pt-36 lg:px-36 min-h-screen h-full">
      {/* Main Content (Thank You and Billing Address) */}
      <div className="w-full lg:w-1/2 lg:mr-4">
        <h1 className="text-3xl font-bold font-title text-alofa-pink mb-3">Thank you for your purchase!</h1>
        <p className="text-gray-600 mb-3">
          Your order will be verified within 24 hours upon checking out. We will notify you by email once your order has been shipped.
        </p>

        {/* Billing Address Section */}
        <div className="billing-address mt-6">
          <h2 className="text-xl font-semibold font-heading mb-3 text-alofa-pink-gradient">Billing Address</h2>
          
          {formDetails && formDetails.firstName ? (
            <div className="grid grid-cols-3 gap-y-3 text-gray-600">
              {/* Labels */}
              <p className="text-base font-bold">Name</p>
              <p className="col-span-2 text-gray-600 text-base">{formDetails.firstName} {formDetails.lastName}</p>
              
              <p className="text-base font-bold">Address</p>
              <p className="col-span-2 text-base">
                {formDetails.street}, 
                {formDetails.barangayName ? ` ${formDetails.barangayName},` : ""} 
                {formDetails.cityName ? ` ${formDetails.cityName},` : ""}
                {formDetails.provinceName ? ` ${formDetails.provinceName},` : ""}
                {formDetails.regionName ? ` ${formDetails.regionName}, ` : ""} 
                {formDetails.postalCode}
              </p>
              
              <p className="text-base font-bold">Phone</p>
              <p className="col-span-2 text-base">{formDetails.phoneNumber}</p>
              
              <p className="text-base font-bold">Email</p>
              <p className="col-span-2 text-base">{formDetails.email}</p>
            </div>
          ) : (
            <p className="text-gray-600">No billing address provided.</p>
          )}
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="w-full lg:w-1/2 lg:ml-6 mt-0 lg:mt-0 self-start">
        <Receipt cartItems={cartItems} subtotal={subtotal} paymentMethod={paymentMethod} />
      </div>
    </div>
  );
};

export default OrderConfirmation;
