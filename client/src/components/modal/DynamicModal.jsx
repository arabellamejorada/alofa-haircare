import React, { useState } from "react";
import Modal from "./Modal"; // Adjust the path as necessary

const DynamicModal = ({
  isOpen,
  onClose,
  onSubmit,
  title = "Provide Details",
  placeholder = "Enter details...",
  initialValue = "",
  inputType = "textarea", // Support for different input types (e.g., text, textarea)
}) => {
  const [inputValue, setInputValue] = useState(initialValue);

  const handleSubmit = () => {
    if (inputValue.trim() === "") {
      alert("Input cannot be empty.");
      return;
    }
    onSubmit(inputValue);
    setInputValue("");
  };

  const handleClose = () => {
    setInputValue("");
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
        <h2 className="text-2xl font-semibold mb-4 text-alofa-pink">{title}</h2>
        {inputType === "textarea" ? (
          <textarea
            className="w-full h-32 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-alofa-pink"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          ></textarea>
        ) : (
          <input
            type={inputType}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-alofa-pink"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        )}
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

export default DynamicModal;
