import { useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { createRefundRequest } from "../api/order";

const RefundModal = ({ isOpen, closeModal, orderItems, selectedOrder }) => {
  const [checkedItems, setCheckedItems] = useState({});
  const [reason, setReason] = useState("");
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (e, orderItemId) => {
    setCheckedItems((prev) => ({
      ...prev,
      [orderItemId]: e.target.checked,
    }));
  };

  const handleReasonChange = (e) => {
    const updatedReason = e.target.value;
    setReason(updatedReason);
  };

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    if (proofs.length + newFiles.length > 5) {
      toast.error("You can only upload up to 5 photos.");
      return;
    }
    setProofs((prev) => [...prev, ...newFiles]);
  };

  const handleSubmit = async () => {
    if (reason.length < 20) {
      toast.error("Reason must be at least 20 characters long.");
      return;
    }

    if (!Object.values(checkedItems).some((value) => value)) {
      toast.error("Please select at least one item to refund.");
      return;
    }

    if (proofs.length === 0) {
      toast.error("Please upload at least one proof image.");
      return;
    }

    const selectedItems = Object.entries(checkedItems)
      .filter(([isChecked]) => isChecked)
      .map(([orderItemId]) => {
        const item = orderItems.find(
          (i) => i.order_item_id === parseInt(orderItemId, 10),
        );
        return {
          order_item_id: item.order_item_id,
          variation_id: item.variation_id,
          quantity: checkedItems[orderItemId]?.quantity || 1,
          unit_price: item.unit_price,
          item_subtotal:
            item.unit_price * (checkedItems[orderItemId]?.quantity || 1),
        };
      });

    // Prepare FormData
    const formData = new FormData();
    formData.append("order_id", selectedOrder.order_id);
    formData.append("customer_id", selectedOrder.customer_id);
    formData.append("reason", reason);
    formData.append("refund_items", JSON.stringify(selectedItems));
    proofs.forEach((file) => {
      formData.append("refund_proof", file);
    });

    try {
      setLoading(true);
      const response = await createRefundRequest(formData);
      if (response.success) {
        toast.success(
          response.message || "Refund request submitted successfully.",
        );
        handleClose();
      } else {
        toast.error(response.message || "Failed to submit refund request.");
      }
    } catch (error) {
      console.error("Error submitting refund request:", error);
      toast.error("An error occurred while submitting the refund request.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCheckedItems({});
    setReason("");
    setProofs([]);
    closeModal();
  };

  return (
    <div className="relative">
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 pointer-events-none">
          <ClipLoader size={50} color="#E53E3E" loading={loading} />
        </div>
      )}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-x-0 top-16 z-10"
          onClose={handleClose}
        >
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
          <div className="flex min-h-full items-center justify-center p-8 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="pt-7 px-8 py-3 w-full max-w-2xl h-[700px] transform overflow-visible rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-3xl font-bold leading-normal gradient-heading mb-4"
                >
                  Request Refund
                </DialogTitle>

                  {/* Order Items Section */}
                  <div className="mt-2">
                    <h3 className="text-gray-800 font-semibold text-md mb-2">
                      Select item(s) for refund
                    </h3>
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
                                      handleCheckboxChange(
                                        e,
                                        item.order_item_id,
                                      )
                                    }
                                    className="w-4 h-4 text-alofa-pink rounded border-gray-300"
                                    disabled={
                                      selectedOrder.order_status_id === 1 ||
                                      selectedOrder.order_status_id === 2 ||
                                      selectedOrder.order_status_id === 3
                                    }
                                  />
                                </td>
                                <td className="px-4 py-2 text-gray-800">
                                  {item.product_name}
                                </td>
                                <td className="px-4 py-2 text-gray-600">
                                  {item.variation_type &&
                                  item.variation_type !== "N/A"
                                    ? item.variation_type
                                    : item.value && item.value !== "N/A"
                                      ? item.value
                                      : ""}
                                </td>
                                <td className="px-4 py-2 text-right text-gray-800">
                                  {item.quantity > 1 ? (
                                    <select
                                      value={
                                        checkedItems[item.order_item_id]
                                          ?.quantity || 1
                                      }
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
                                        (_, i) => i + 1,
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
                      <p className="text-gray-500">
                        No items found for this order.
                      </p>
                    )}
                  </div>

                  {/* Reason Section */}
                  <div className="mt-4">
                    <label
                      htmlFor="reason"
                      className="text-gray-700 block font-semibold mb-1"
                    >
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
                    <p className="text-right text-gray-500 text-sm">
                      {reason.length}/300
                    </p>
                  </div>

                  {/* Upload Proof Section */}
                  <div className="mt-2">
                    <label className="text-gray-700 block font-semibold mb-1">
                      Upload Proof
                    </label>
                    <div className="w-full h-24 border-dashed border-2 flex flex-col items-center justify-center rounded-md cursor-pointer hover:bg-gray-50 p-2">
                      <input
                        type="file"
                        multiple // Allow multiple uploads
                        onChange={handleFileUpload}
                        className="hidden"
                        id="proof"
                      />
                      <label htmlFor="proof" className="cursor-pointer">
                        <span className="text-gray-400">
                          {" "}
                          + Add Up to 5 Photos
                        </span>
                      </label>
                      <div className="flex flex-wrap gap-4  overflow-y-auto max-h-40 w-full p-2">
                        {proofs.map((file, index) => (
                          <img
                            key={index}
                            src={URL.createObjectURL(file)}
                            alt={`Uploaded Proof ${index + 1}`}
                            className="w-24 h-24 object-cover rounded-md border border-gray-300"
                          />
                        ))}
                      </div>
                      {proofs.length >= 5 && (
                        <p className="text-gray-500 text-sm">
                          Maximum of 5 files only
                        </p>
                      )}
                    </div>
                  </div>

                {/* Submit Button */}
                <div className="mt-6 mb-3 pb-3 flex justify-end space-x-1">
                    <button
                      onClick={handleClose}
                      className="border-0 hover:underline text-gray-600 font-semibold py-2 px-4"
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
    </div>
  );
};

RefundModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  orderItems: PropTypes.array.isRequired,
  selectedOrder: PropTypes.object.isRequired,
};

export default RefundModal;
