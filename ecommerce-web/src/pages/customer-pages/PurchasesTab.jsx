import { useState, useEffect, useContext, useMemo } from "react";
import TransactionCard from "../../components/TransactionCard.jsx";
import {
  getOrderByProfileId,
  getRefundRequestsByProfileId,
} from "../../api/order.js";
import { AuthContext } from "../../components/AuthContext";
import { ClipLoader } from "react-spinners";
import Search from "../../components/Filter/Search.jsx";

const PurchasesTab = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [tabUnderlineStyle, setTabUnderlineStyle] = useState({});
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [refundRequests, setRefundRequests] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusMap = useMemo(
    () => ({
      All: null,
      Pending: "Pending",
      "To Ship": "Preparing",
      "To Receive": "Shipped",
      Completed: "Completed",
      "For Refund": "For Refund",
    }),
    [],
  );

  useEffect(() => {
    const fetchOrderTransactions = async () => {
      if (!user) {
        console.error("user is not defined");
        return;
      }
      try {
        setLoading(true);
        const orders = await getOrderByProfileId(user.id);
        const sortedOrders = orders.sort(
          (a, b) => new Date(b.date_ordered) - new Date(a.date_ordered),
        );
        setTransactions(sortedOrders);

        const refunds = await getRefundRequestsByProfileId(user.id);
        const sortedRefunds = refunds.sort(
          (a, b) => new Date(b.requested_at) - new Date(a.requested_at),
        );
        setRefundRequests(sortedRefunds);

        console.log("Orders fetched:", sortedOrders);
        console.log("Refunds fetched:", sortedRefunds);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderTransactions();
  }, [user]);

  useEffect(() => {
    const initialTabElement = document.getElementById(`tab-0`);
    if (initialTabElement) {
      setTabUnderlineStyle({
        width: initialTabElement.offsetWidth,
        left: initialTabElement.offsetLeft,
      });
    }
  }, []);

  useEffect(() => {
    const filtered = transactions.filter((transaction) => {
      const orderIdString = String(transaction.order_id || "");

      const matchesOrderId = orderIdString
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesProductName = transaction.order_items.some((product) =>
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      const requiredStatus = statusMap[activeTab];

      return (
        (activeTab === "All" ||
          transaction.order_status_name === requiredStatus) &&
        (searchQuery === "" || matchesOrderId || matchesProductName)
      );
    });

    setFilteredOrders(filtered);
  }, [activeTab, searchQuery, transactions, statusMap]);

  const handleTabClick = (tab, index) => {
    setActiveTab(tab);
    const tabElement = document.getElementById(`tab-${index}`);
    if (tabElement) {
      setTabUnderlineStyle({
        width: tabElement.offsetWidth,
        left: tabElement.offsetLeft,
      });
    }
  };

  if (!user) {
    return (
      <div className="text-center text-gray-500">
        No customer information available.
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 pointer-events-none">
          <ClipLoader size={50} color="#E53E3E" loading={loading} />
        </div>
      )}
      <div className="rounded-lg w-full max-w-7xl mx-auto mb-4">
        {/* Tabs */}
        <div className="relative mb-4 border-b border-gray-200">
          <div className="flex space-x-4">
            {[
              "All",
              "Pending",
              "To Ship",
              "To Receive",
              "Completed",
              "For Refund",
            ].map((tab, index) => (
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
            className="absolute bottom-0 h-1 bg-alofa-pink rounded-full transition-all duration-300"
            style={{
              width: tabUnderlineStyle.width,
              left: tabUnderlineStyle.left,
            }}
          />
        </div>

        {/* Search Bar with Search Icon */}
        <div className="w-full mb-6">
          <Search placeholder="Search by Order ID or products..."searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        {/* Transaction Cards - Render filtered transactions */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <TransactionCard
                key={order.order_id}
                activeTab={activeTab}
                order={order}
              />
            ))
          ) : (
            <div className="text-center text-gray-500">No orders found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchasesTab;
