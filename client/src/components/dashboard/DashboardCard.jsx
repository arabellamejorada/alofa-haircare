// File: src/components/DashboardCard.jsx
import React from "react";
import PropTypes from "prop-types";

const DashboardCard = ({ label, value, icon, change }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex items-center w-full">
      {/* Icon */}
      <div className="bg-pink-100 text-pink-500 rounded-full p-4 mr-4 flex-shrink-0">
        {icon}
      </div>

      {/* Text Content */}
      <div className="flex flex-col">
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        {change && (
          <div className="text-sm text-green-500 font-semibold">{change}</div>
        )}
      </div>
    </div>
  );
};

DashboardCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.element.isRequired, // Icon passed as a React component
  change: PropTypes.string, // Optional change indicator
};

export default DashboardCard;
