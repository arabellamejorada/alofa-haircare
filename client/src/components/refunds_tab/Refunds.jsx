import React, { useState, Fragment } from "react";
import RefundTab from "./tabs/RefundTab";

const Refund = () => {
  const [currentTab, setCurrentTab] = useState("All Refunds");

  const renderCurrentTab = () => {
    switch (currentTab) {
      case "All Refunds":
        return <RefundTab statusFilter="All" />;
      case "Pending Refunds":
        return <RefundTab statusFilter="Pending" />;
      case "Processed Refunds":
        return <RefundTab statusFilter="Processed" />;
      default:
        return null;
    }
  };

  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <strong className="text-3xl font-bold text-gray-500">
          Refund Management
        </strong>

        {/* Tabs */}
        <div className="border-b border-gray-300 mb-2">
          {["All Refunds", "Pending Refunds", "Processed Refunds"].map((tab) => (
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

export default Refund;
