import React, { useState, Fragment } from "react";
import OrdersTab from "./tabs/OrdersTab";

const Shipping = () => {
  const [currentTab, setCurrentTab] = useState("View All Orders");

  const renderCurrentTab = () => {
    switch (currentTab) {
      case "View All Orders":
        return <OrdersTab statusFilter="All" />;
      case "Prepared Orders":
        return <OrdersTab statusFilter="Preparing" />;
      case "Shipped Orders":
        return <OrdersTab statusFilter="Shipped" />;
      case "Completed Orders":
        return <OrdersTab statusFilter="Completed" />;
      default:
        return null;
    }
  };

  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <strong className="text-3xl font-bold text-gray-500">Shipping</strong>

        {/* Tabs */}
        <div className="border-b border-gray-300 mb-2">
          {[
            "View All Orders",
            "Prepared Orders",
            "Shipped Orders",
            "Completed Orders",
          ].map((tab) => (
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

export default Shipping;
