import { useState } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogTitle, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";

const RefundModal = ({ isOpen, closeModal, orderItems, selectedOrder }) => {
  const [checkedItems, setCheckedItems] = useState({});
  const [reason, setReason] = useState("");
  const [proof, setProof] = useState(null);

  const handleCheckboxChange = (e, orderItemId) => {
    setCheckedItems((prev) => ({
      ...prev,
      [orderItemId]: e.target.checked,
    }));
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleFileUpload = (e) => {
    setProof(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (reason.length < 20) {
      alert("Reason must be at least 20 characters long");
      return;
    }
    if (!Object.values(checkedItems).some((value) => value)) {
      alert("Please select at least one item to refund");
      return;
    }
    
    // Handle form submission logic here, e.g. call an API.
    alert("Refund request submitted");
    closeModal();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="pt-8 w-full max-w-2xl h-[700px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-3xl font-bold leading-6 gradient-heading mb-4"
                >
                  Request Refund
                </DialogTitle>

                {/* Order Items Section */}
                <div className="mt-2">
                  <h3 className="text-gray-800 font-semibold text-md mb-2">Select item(s) for refund</h3>
                  {orderItems.length > 0 ? (
                    <div className="max-h-40 overflow-y-auto border rounded-md bg-gray-50 shadow-sm">
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-gray-700 font-semibold sticky top-0 bg-gray-100">
                              Select
                            </th>
                            <th className="px-4 py-2 text-left text-gray-700 font-semibold sticky top-0 bg-gray-100">
                              Product
                            </th>
                            <th className="px-4 py-2 text-left text-gray-700 font-semibold sticky top-0 bg-gray-100">
                              Variation
                            </th>
                            <th className="px-4 py-2 text-right text-gray-700 font-semibold sticky top-0 bg-gray-100">
                              Quantity
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderItems.map((item) => (
                            <tr key={item.variation_id} className="border-t">
                              <td className="px-4 py-2">
                                <input
                                  type="checkbox"
                                  checked={!!checkedItems[item.order_item_id]}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, item.order_item_id)
                                  }
                                  className="w-4 h-4 text-alofa-pink rounded border-gray-300"
                                  disabled={
                                    selectedOrder.order_status_id === 3 ||
                                    selectedOrder.order_status_id === 4
                                  }
                                />
                              </td>
                              <td className="px-4 py-2 text-gray-800">
                                {item.product_name}
                              </td>
                              <td className="px-4 py-2 text-gray-600">
                                {item.variation_type && item.variation_type !== "N/A"
                                  ? item.variation_type
                                  : item.value && item.value !== "N/A"
                                  ? item.value
                                  : ""}
                              </td>
                              <td className="px-4 py-2 text-right text-gray-800">
                                {item.quantity > 1 ? (
                                  <select
                                    value={checkedItems[item.order_item_id]?.quantity || 1}
                                    onChange={(e) =>
                                      setCheckedItems((prev) => ({
                                        ...prev,
                                        [item.order_item_id]: {
                                          ...prev[item.order_item_id],
                                          quantity: e.target.value,
                                        },
                                      }))
                                    }
                                    className="border rounded-md p-1"
                                  >
                                    {Array.from(
                                      { length: item.quantity },
                                      (_, i) => i + 1
                                    ).map((q) => (
                                      <option key={q} value={q}>
                                        {q}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  item.quantity
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">No items found for this order.</p>
                  )}
                </div>

                {/* Reason Section */}
                <div className="mt-4">
                  <label htmlFor="reason" className="text-gray-700 block font-semibold mb-1">
                    Reason
                  </label>
                  <textarea
                    id="reason"
                    value={reason}
                    onChange={handleReasonChange}
                    placeholder="Minimum of 20 characters"
                    maxLength={300}
                    rows={4}
                    className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring focus:border-pink-300"
                  />
                  <p className="text-right text-gray-500 text-sm">{reason.length}/300</p>
                </div>

                {/* Upload Proof Section */}
                <div className="mt-4">
                  <label className="text-gray-700 block font-semibold mb-1">Upload Proof</label>
                  <div className="w-full h-32 border-dashed border-2 flex items-center justify-center rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="proof"
                    />
                    <label htmlFor="proof" className="cursor-pointer">
                      {proof ? proof.name : "Add Photo"}
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6 mb-7 pb-5 text-right">
                    <button
                    onClick={handleSubmit}
                    className="border-0 hover:underline text-gray-600 font-semibold py-2 px-6"
                    >
                    Cancel
                    </button>
                  
                  <button
                    onClick={handleSubmit}
                    className="bg-alofa-pink hover:bg-alofa-pink-gradient text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:ring"
                  >
                    Submit
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

RefundModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  orderItems: PropTypes.array.isRequired,
  selectedOrder: PropTypes.object.isRequired,
};

export default RefundModal;
