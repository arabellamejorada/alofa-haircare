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

  const fetchTransactions = async () => {
    if (!user) {
      console.error("User is not defined");
      return;
    }

    try {
      setLoading(true);

      if (activeTab === "For Refund") {
        // Fetch refund requests for "For Refund" tab
        const refunds = await getRefundRequestsByProfileId(user.id);
        const sortedRefunds = refunds.sort(
          (a, b) => new Date(b.requested_at) - new Date(a.requested_at),
        );
        setRefundRequests(sortedRefunds);
        // console.log("Refunds:", refunds);
      } else {
        // Fetch orders for other tabs
        const orders = await getOrderByProfileId(user.id);
        const sortedOrders = orders.sort(
          (a, b) => new Date(b.date_ordered) - new Date(a.date_ordered),
        );
        setTransactions(sortedOrders);
        // console.log("Orders:", orders);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [activeTab, user]);

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

      // Ensure order_items and refund_items exist
      const orderItems = transaction.order_items || [];
      const refundItems = transaction.refund_items || [];

      // Check if search query matches order ID, product name in orders, or product name in refunds
      const matchesOrderId = orderIdString
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesProductName = orderItems.some((product) =>
        product.product_name?.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      const matchesRefundItems = refundItems.some((product) =>
        product.product_name?.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      const requiredStatus = statusMap[activeTab];

      // Ensure the transaction matches the active tab and search query
      const matchesTab =
        activeTab === "All" ||
        transaction.order_status_name === requiredStatus ||
        transaction.refund_status_name === requiredStatus;

      const matchesSearch =
        searchQuery === "" ||
        matchesOrderId ||
        matchesProductName ||
        matchesRefundItems;

      return matchesTab && matchesSearch;
    });

    // Sort "Completed" tab by `date_delivered`
    if (activeTab === "Completed") {
      filtered.sort(
        (a, b) => new Date(b.date_delivered) - new Date(a.date_delivered),
      );
    }

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
          <Search
            placeholder="Search by Order ID or products..."
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        <div className="space-y-4">
          {/* For Orders */}
          {activeTab !== "For Refund" ? (
            filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TransactionCard
                  key={order.order_id}
                  activeTab={activeTab}
                  order={order}
                  loading={loading}
                  setLoading={setLoading}
                  setTransactions={setTransactions}
                />
              ))
            ) : (
              <div className="text-center text-gray-500">No orders found.</div>
            )
          ) : null}

          {/* For Refunds */}
          {activeTab === "For Refund" ? (
            refundRequests.length > 0 ? (
              refundRequests.map((refund) => (
                <TransactionCard
                  key={refund.refund_request_id}
                  activeTab={activeTab}
                  refund={refund}
                  loading={loading}
                  setLoading={setLoading}
                  setTransactions={setTransactions}
                />
              ))
            ) : (
              <div className="text-center text-gray-500">
                No refund requests.
              </div>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PurchasesTab;
