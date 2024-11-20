// src/components/shared/ReasonModal.jsx

import React, { useState } from "react";
import Modal from "../modal/Modal"; // Adjust the path as necessary

const ReasonModal = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (reason.trim() === "") {
      alert("Please provide a reason.");
      return;
    }
    onSubmit(reason);
    setReason("");
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <Modal
      isVisible={isOpen}
      onClose={handleClose}
      size="small"
      backdropClassName="bg-black bg-opacity-30" // Adjust opacity here
    >
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-alofa-pink">Provide a Reason</h2>
        <textarea
          className="w-full h-32 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-alofa-pink"
          placeholder="Input reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        ></textarea>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={handleClose}
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

export default ReasonModal;
