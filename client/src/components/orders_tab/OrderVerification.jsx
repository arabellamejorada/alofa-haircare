// src/components/OrderVerification.jsx

import React, { useState, Fragment } from "react";
import OrderVerificationTab from "./tabs/OrderVerificationTab";

const OrderVerification = () => {
  const [currentTab, setCurrentTab] = useState("All Orders");

  const renderCurrentTab = () => {
    switch (currentTab) {
      case "All Orders":
        return <OrderVerificationTab statusFilter="All" />;
      case "Pending Payment":
        return <OrderVerificationTab statusFilter="Pending" />;
      case "Verified Payment":
        return <OrderVerificationTab statusFilter="Verified" />;
      default:
        return null;
    }
  };

  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <strong className="text-3xl font-bold text-gray-500">
          Verify Order Payments
        </strong>

        {/* Tabs */}
        <div className="border-b border-gray-300 mb-2">
          {["All Orders", "Pending Payment", "Verified Payment"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 ${
                currentTab === tab
                  ? "text-alofa-highlight border-b-2 border-alofa-highlight"
                  : "text-gray-500"
              }`}
              onClick={() => setCurrentTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {renderCurrentTab()}
      </div>
    </Fragment>
  );
};

export default OrderVerification;
