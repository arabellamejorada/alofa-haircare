// PaymentStatusBadge.js
import React from "react";

const StatusBadge = ({ status }) => {
  // Define color classes based on status type
  const statusColors = {
    Pending: "bg-orange-200 text-orange-800",
    Verified: "bg-green-200 text-green-800",
    Refunded: "bg-red-200 text-red-800",

    Preparing: "bg-gray-200 text-gray-800",
    Shipped: "bg-yellow-200 text-yellow-800",
    Completed: "bg-green-200 text-green-800",
  };

  // Apply default color if status doesn't match any predefined type
  const colorClass = statusColors[status] || "bg-gray-200 text-gray-800";

  return (
    <span
      className={`px-3 py-1 rounded-lg text-sm font-semibold ${colorClass}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
