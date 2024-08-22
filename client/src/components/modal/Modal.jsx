import React from "react";
import { IoCloseCircle } from "react-icons/io5";

const Modal = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  //function so that modal will not close onClick
  const handleClose = (e) => {
    if (e.target.id === "wrapper") onClose();
  };

  return (
    <div
      id="wrapper"
      className="fixed inset-0 bg-black bg-opacity-5 backdrop-blur-md flex justify-center items-center pb-[10%]"
      onClick={handleClose}
    >
      <div className="w-[25rem] flex flex-col gap-1">
        <IoCloseCircle
          fontSize={24}
          className="text-gray-400 place-self-end hover:text-pink-500 active:text-gray-600"
          onClick={() => onClose()}
        />
        <div className="bg-white p-2 rounded-xl flex flex-col py-6">
          {children}
        </div>
      </div>
    </div>
  );
};
export default Modal;
