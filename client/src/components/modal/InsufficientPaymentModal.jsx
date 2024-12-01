import React, { useEffect, useState } from "react";
import Modal from "./Modal";

const InsufficientPaymentModal = ({
  isOpen,
  onClose,
  onSubmit,
  totalAmount,
}) => {
  const [amountPaid, setAmountPaid] = useState(0);
  const [amountDue, setAmountDue] = useState(totalAmount);

  useEffect(() => {
    // Ensure numeric calculation
    const paid = parseFloat(amountPaid) || 0;
    setAmountDue(Math.max(totalAmount - paid, 0)); // Prevent negative due amount
  }, [amountPaid, totalAmount]);

  const handleSubmit = () => {
    const paid = parseFloat(amountPaid);
    if (isNaN(paid) || paid < 0) {
      alert("Please enter a valid Amount Paid.");
      return;
    }
    if (paid >= totalAmount) {
      alert("Payment is sufficient or exceeds the total amount.");
      return;
    }
    onSubmit(paid, amountDue);
    setAmountPaid(0); // Reset state
    onClose(); // Close modal
  };
  return (
    <Modal
      isVisible={isOpen}
      onClose={onClose}
      size="small"
      backdropClassName="bg-black bg-opacity-30"
    >
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-alofa-pink">
          Insufficient Payment Details
        </h2>
        <div className="space-y-4">
          <div>
            <label className="font-semibold">
              Total Amount: ₱
              {Number(totalAmount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </label>
          </div>
          <div>
            <label className="font-semibold">Amount Paid:</label>
            <input
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-alofa-pink"
              placeholder="0.00"
              min="0"
            />
          </div>
          <div>
            <label className="font-semibold">Amount Due:</label>
            <input
              type="text"
              value={`₱${Number(amountDue).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-alofa-pink text-white rounded-lg hover:bg-alofa-dark transition"
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InsufficientPaymentModal;
