import Receipt from "../../components/Receipt";
import { useLocation } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation();
  const { formDetails = {}, cartItems = [], subtotal = 0, paymentMethod = "" } = location.state || {};

  console.log("OrderConfirmation state:", location.state);

  return (
    <div className="bg-alofa-bg-white flex flex-col lg:flex-row justify-center p-8 pt-40 lg:px-40 min-h-screen h-full"
    >
      <div className="w-full lg:w-1/2 lg:mr-10">
        <h1 className="text-4xl font-bold font-title text-pink-600 mb-4">Thank you for your purchase!</h1>
        <p className="text-gray-600 mb-4">
          Your order will be verified within 24 hours upon checking out. We will
          notify you by email once your order has been shipped.
        </p>

        {/* Billing Address Section */}
        <div className="billing-address mt-8">
          <h2 className="text-2xl font-semibold font-heading mb-4 text-pink-600">Billing Address</h2>
          
          {formDetails && formDetails.firstName ? (
            <>
              <div className="mb-2">
                <p className="text-lg font-bold">Name</p>
                <p className="text-gray-600">{formDetails.firstName} {formDetails.lastName}</p>
              </div>
              <div className="mb-2">
                <p className="text-lg font-bold">Address</p>
                <p className="text-gray-600">
                  {formDetails.street}, {formDetails.barangay}, {formDetails.city}, {formDetails.province}, {formDetails.region}, {formDetails.postalCode}
                </p>
              </div>
              <div className="mb-2">
                <p className="text-lg font-bold">Phone</p>
                <p className="text-gray-600">{formDetails.phoneNumber}</p>
              </div>
              <div className="mb-2">
                <p className="text-lg font-bold">Email</p>
                <p className="text-gray-600">{formDetails.email}</p>
              </div>
            </>
          ) : (
            <p className="text-gray-600">No billing address provided.</p>
          )}
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="w-full lg:w-1/3 lg:ml-10 mt-5 lg:mt-0">
        <Receipt cartItems={cartItems} subtotal={subtotal} paymentMethod={paymentMethod} />
      </div>
    </div>
  );
};

export default OrderConfirmation;
