import React from "react";

const QuantityBadge = ({ quantity }) => {
  // Define color classes based on quantity ranges
  let colorClass = " text-gray-500"; // Default color
  if (quantity >= 100) {
    colorClass = " text-green-500";
  } else if (quantity > 50 && quantity < 100) {
    colorClass = " text-yellow-500";
  } else if (quantity > 10 && quantity <= 50) {
    colorClass = " text-orange-500";
  } else if (quantity <= 10) {
    colorClass = " text-red-500";
  }

  return (
    <span
      className={`inline-block w-20 px-3 py-1 text-center rounded-md text-sm font-semibold ${colorClass}`}
    >
      {quantity}
    </span>
  );
};

export default QuantityBadge;
