import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { IoCloseCircle } from "react-icons/io5";

const Modal = ({ isVisible, onClose, children, backdropClassName, size }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isVisible) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const handleClose = (e) => {
    if (e.target.id === "wrapper") onClose();
  };

  const defaultBackdropClasses = "bg-black bg-opacity-75 backdrop-blur-sm";

  return (
    <div
      id="wrapper"
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 flex justify-center items-center z-50 ${
        backdropClassName || defaultBackdropClasses
      }`}
      onClick={handleClose}
    >
      <div
        className={`${
          size === "xlarge"
            ? "w-[800px]"
            : size === "large"
            ? "w-[600px]"
            : "w-fit"
        } flex flex-col gap-1`}
        onClick={(e) => e.stopPropagation()}
      >
        <IoCloseCircle
          fontSize={24}
          className="text-gray-400 place-self-end hover:text-alofa-pink active:text-gray-600 cursor-pointer"
          onClick={() => onClose()}
        />
        <div className="bg-white p-2 rounded-xl flex flex-col py-6">
          {children}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  backdropClassName: PropTypes.string,
  size: PropTypes.oneOf(["small", "large", "xlarge"]), // New prop for size
};

export default Modal;
