import React, { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";

const StatusFilterDropdown = ({
  statuses,
  selectedStatuses,
  setSelectedStatuses,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleStatus = (status) => {
    setSelectedStatuses((prevSelected) => {
      if (prevSelected.includes(status)) {
        return prevSelected.filter((s) => s !== status);
      } else {
        return [...prevSelected, status];
      }
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-[150px] h-10 px-4 appearance-none border rounded-xl bg-gray-50 hover:border-alofa-pink hover:bg-white border-slate-300 text-slate-700 flex justify-between items-center"
      >
        Statuses
        <IoMdArrowDropdown className="text-gray-500" />
      </button>
      {isOpen && (
        <div className="absolute mt-2 bg-white border rounded-xl shadow-lg z-10">
          <ul className="flex flex-col p-2">
            {statuses.map((status) => (
              <li key={status.status_id} className="flex items-center">
                <input
                  type="checkbox"
                  id={status.status_description}
                  checked={selectedStatuses.includes(status.description)}
                  onChange={() => handleToggleStatus(status.description)}
                  className="mr-2"
                />
                <label htmlFor={status.status_description}>
                  {status.description}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StatusFilterDropdown;
