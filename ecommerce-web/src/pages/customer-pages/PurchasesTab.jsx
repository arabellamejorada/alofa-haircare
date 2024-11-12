import { useState, useEffect } from "react";
import TransactionCard from "../../components/TransactionCard.jsx";

const PurchasesTab = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState(""); // Added missing state for searchQuery
  const [tabUnderlineStyle, setTabUnderlineStyle] = useState({});

  const handleTabClick = (tab, index) => {
    setActiveTab(tab);
    // Calculate the new position for the underline
    const tabElement = document.getElementById(`tab-${index}`);
    if (tabElement) {
      setTabUnderlineStyle({
        width: tabElement.offsetWidth,
        left: tabElement.offsetLeft,
      });
    }
  };

  useEffect(() => {
    // Set the initial position of the underline when the component first mounts
    const initialTabElement = document.getElementById(`tab-0`);
    if (initialTabElement) {
      setTabUnderlineStyle({
        width: initialTabElement.offsetWidth,
        left: initialTabElement.offsetLeft,
      });
    }
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {/* Tabs */}
      <div className="relative mb-4 border-b border-gray-200">
        <div className="flex space-x-4">
          {["All", "To Ship", "To Receive", "Completed", "Return Refund"].map((tab, index) => (
            <button
              key={tab}
              id={`tab-${index}`}
              onClick={() => handleTabClick(tab, index)}
              className={`relative px-4 py-2 font-semibold ${
                activeTab === tab ? "text-black" : "text-gray-500"
              } focus:outline-none`}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Underline */}
        <span
          className="absolute bottom-0 h-1 bg-pink-500 rounded-full transition-all duration-300"
          style={{
            width: tabUnderlineStyle.width,
            left: tabUnderlineStyle.left,
          }}
        />
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Order ID or Product name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      {/* Transaction Cards - Rendering multiple instances of TransactionCard */}
      <div className="space-y-4">
        {/* Render multiple transaction cards as placeholders for now */}
        <TransactionCard activeTab={activeTab} searchQuery={searchQuery} />
        <TransactionCard activeTab={activeTab} searchQuery={searchQuery} />
        <TransactionCard activeTab={activeTab} searchQuery={searchQuery} />
      </div>
    </div>
  );
};

export default PurchasesTab;
