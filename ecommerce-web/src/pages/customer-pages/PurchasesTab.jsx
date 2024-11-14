import { useState, useEffect } from "react";
import TransactionCard from "../../components/TransactionCard.jsx";

const PurchasesTab = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [tabUnderlineStyle, setTabUnderlineStyle] = useState({});
  const [filteredOrders, setFilteredOrders] = useState([]); // To store filtered transaction data

  // Placeholder transaction data (Mock Data)
  const placeholderTransactions = [
    {
      id: "20240001",
      status: "Completed",
      products: [{ id: "1", name: "Jade Hair Brush", value: 1, price: 280, sku: "BRUSH-JADE" }],
      total: 280,
    },
    {
      id: "20240002",
      status: "To Ship",
      products: [{ id: "2", name: "Hair Oil", value: 1, price: 450, sku: "HAIR-OIL-LAV" }],
      total: 450,
    },
    {
      id: "20240003",
      status: "To Receive",
      products: [{ id: "3", name: "Hair Clips Set", value: 2, price: 150, sku: "CLIPS-PSTL" }],
      total: 300,
    },
  ];

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

  useEffect(() => {
    // Filter transactions based on activeTab and searchQuery
    const filtered = placeholderTransactions.filter(
      (transaction) =>
        (activeTab === "All" || transaction.status === activeTab) &&
        (searchQuery === "" ||
          transaction.id.includes(searchQuery) ||
          transaction.products.some((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
          ))
    );

    setFilteredOrders(filtered);
  }, [activeTab, searchQuery]);

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

  return (
    <div className=" rounded-lg w-full max-w-7xl mx-auto">
      {/* Tabs */}
      <div className="relative mb-4 border-b border-gray-200">
        <div className="flex space-x-4">
          {["All", "To Ship", "To Receive", "Completed", "For Refund"].map((tab, index) => (
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

      {/* Transaction Cards - Render filtered transactions */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <TransactionCard key={order.id} activeTab={activeTab} searchQuery={searchQuery} order={order} />
          ))
        ) : (
          <div className="text-center text-gray-500">No orders found.</div>
        )}
      </div>
    </div>
  );
};

export default PurchasesTab;
