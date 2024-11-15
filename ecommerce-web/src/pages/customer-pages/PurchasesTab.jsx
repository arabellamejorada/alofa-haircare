import { useState, useEffect, useContext } from "react";
import TransactionCard from "../../components/TransactionCard.jsx";
import { getOrderByProfileId } from "../../api/order.js";
import { AuthContext } from "../../components/AuthContext";

const PurchasesTab = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [tabUnderlineStyle, setTabUnderlineStyle] = useState({});
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    console.log("user", user);
    const fetchOrderTransactions = async () => {
      if (!user) {
        console.error("user is not defined");
        return;
      }
      try {
        const orders = await getOrderByProfileId(user.id);
        console.log("Fetched orders:", orders);
        setTransactions(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrderTransactions();
  }, [user]);

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
    console.log("transactions", transactions);
    const filtered = transactions.filter(
      (transaction) =>
        (activeTab === "All" || transaction.order_status_name === activeTab) &&
        (searchQuery === "" ||
          transaction.order_id.includes(searchQuery) ||
          transaction.order_items.some((product) =>
            product.product_name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()),
          )),
    );

    setFilteredOrders(filtered);
  }, [activeTab, searchQuery, transactions]);

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

  // Render a fallback if customer_id is not available
  if (!user) {
    return (
      <div className="text-center text-gray-500">
        No customer information available.
      </div>
    );
  }
  return (
    <div className=" rounded-lg w-full max-w-7xl mx-auto">
      {/* Tabs */}
      <div className="relative mb-4 border-b border-gray-200">
        <div className="flex space-x-4">
          {["All", "To Ship", "To Receive", "Completed", "For Refund"].map(
            (tab, index) => (
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
            ),
          )}
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
            <TransactionCard
              key={order.order_id}
              activeTab={activeTab}
              searchQuery={searchQuery}
              order={order}
              transactions={transactions}
            />
          ))
        ) : (
          <div className="text-center text-gray-500">No orders found.</div>
        )}
      </div>
    </div>
  );
};

export default PurchasesTab;
