import React from "react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  additionalNote,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Modal content */}
      <div className="bg-white p-8 rounded-lg shadow-2xl z-10 w-96">
        <h2 className="text-2xl font-bold text-pink-600 mb-4">Confirmation</h2>

        {/* Main message */}
        <p className="text-gray-800 mb-4">{message}</p>

        {/* Additional note */}
        {additionalNote && (
          <p className="text-sm text-gray-600 mb-6">{additionalNote}</p>
        )}

        <div className="flex justify-end gap-4">
          {/* Cancel button */}
          <button
            className="px-4 py-2 text-pink-600 border border-pink-600 rounded-md hover:bg-pink-100 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>

          {/* Confirm button */}
          <button
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
