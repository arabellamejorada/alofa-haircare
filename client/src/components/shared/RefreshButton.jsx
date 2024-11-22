// src/components/shared/RefreshIcon.jsx
import React from "react";
import { FaSyncAlt } from "react-icons/fa";
import PropTypes from "prop-types";

const RefreshIcon = ({
  size = 24,
  colorClass = "text-gray-700",
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center p-2 rounded-full hover:bg-gray-200 transition ${className}`}
      aria-label="Refresh"
    >
      <FaSyncAlt className={`${colorClass}`} style={{ fontSize: size }} />
    </button>
  );
};

RefreshIcon.propTypes = {
  size: PropTypes.number,
  colorClass: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default RefreshIcon;
