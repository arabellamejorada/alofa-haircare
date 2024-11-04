import Receipt from "../../components/Receipt";
import { useLocation } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation();
  const { formDetails = {}, cartItems = [], subtotal = 0, paymentMethod = "" } = location.state || {};

  console.log("OrderConfirmation state:", location.state);

  return (
    <div className="flex flex-col lg:flex-row justify-between p-8 pt-36 lg:px-48 min-h-screen h-full">
      <div className="absolute inset-0 bg-[url('../../../public/images/alofa-white-bg.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-white opacity-90"></div>
      </div>
      {/* Main Content (Thank You and Billing Address) */}
      <div className="relative z-10 w-full lg:w-1/2 lg:mr-4 overflow-visible">
        <div className="overflow-visible">
          <h1 className="text-7xl font-bold font-heading gradient-heading mb-4 leading-tight">Thank you for your purchase!</h1>
          <p className="text-gray-600 mb-3">
            Your order will be verified within 24 hours upon checking out. We will notify you by email once your order has been shipped.
          </p>
        </div>

        {/* Billing Address Section */}
        <div className="relative z-10 billing-address mt-6">
          <h2 className="text-2xl font-semibold font-heading mb-3 text-alofa-pink">Billing Address</h2>
          
          {formDetails && formDetails.firstName ? (
            <div className="grid grid-cols-4 gap-y-2 text-gray-600">
              {/* Labels */}
              <p className="col-span-1 text-base font-bold m-0">Name</p>
              <p className="col-span-3 text-gray-600 text-base m-0">{formDetails.firstName} {formDetails.lastName}</p>
              
              <p className="col-span-1 text-base font-bold m-0">Address</p>
              <p className="col-span-3 text-base m-0">
                {formDetails.street}, 
                {formDetails.barangayName ? ` ${formDetails.barangayName},` : ""} 
                {formDetails.cityName ? ` ${formDetails.cityName},` : ""}
                {formDetails.provinceName ? ` ${formDetails.provinceName},` : ""}
                {formDetails.regionName ? ` ${formDetails.regionName}, ` : ""} 
                {formDetails.postalCode}
              </p>
              
              <p className="col-span-1 text-base font-bold m-0">Phone</p>
              <p className="col-span-3 text-base m-0">{formDetails.phoneNumber}</p>
              
              <p className="col-span-1 text-base font-bold m-0">Email</p>
              <p className="col-span-3 text-base m-0">{formDetails.email}</p>
            </div>
          ) : (
            <p className="text-gray-600">No billing address provided.</p>
          )}
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="relative z-10 w-full lg:w-1/2 lg:ml-6 mt-0 lg:mt-0 self-start">
        <Receipt cartItems={cartItems} subtotal={subtotal} paymentMethod={paymentMethod} />
      </div>
    </div>
  );
};

export default OrderConfirmation;
