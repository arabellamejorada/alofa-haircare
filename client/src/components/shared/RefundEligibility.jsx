// src/components/shared/RefundEligibility.jsx
import React, { useEffect, useState } from "react";

const RefundEligibility = ({ requestedAt, children }) => {
  const [isEligible, setIsEligible] = useState(false);

  useEffect(() => {
    if (!requestedAt) {
      setIsEligible(false);
      return;
    }

    const currentDate = new Date();
    const requestDate = new Date(requestedAt);
    const differenceInDays =
      (currentDate - requestDate) / (1000 * 60 * 60 * 24);

    setIsEligible(differenceInDays <= 7);
  }, [requestedAt]);

  if (!isEligible) {
    return (
      <div className="text-red-500 font-medium">
        Refund Request exceeds 7 days
      </div>
    );
  }

  return <>{children}</>;
};

export default RefundEligibility;
