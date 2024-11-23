import React, { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import StatusBadge from "../shared/StatusBadge";
import { ClipLoader } from "react-spinners";

const SalesReport = ({ fetchOrders }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const getRecentOrders = async () => {
      try {
        setLoading(true);
        const response = await fetchOrders();
        setOrders(response.orders);
      } catch (error) {
        console.error("Error fetching recent orders:", error);
      } finally {
        setLoading(false);
      }
    };

    getRecentOrders();
  }, [fetchOrders]);

  const handleSort = (key) => {
    const newSortOrder =
      sortField === key && sortOrder === "asc" ? "desc" : "asc";
    setSortField(key);
    setSortOrder(newSortOrder);

    const sortedOrders = [...orders].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      if (aValue < bValue) return newSortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return newSortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setOrders(sortedOrders);
  };

  // Helper function to format amounts
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount);

  const columns = [
    { key: "order_id", header: "Order ID", align: "left" },
    { key: "date_ordered", header: "Date Ordered", align: "left" },
    {
      key: "order_status_name",
      header: "Order Status",
      align: "left",
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: "total_amount",
      header: "Amount (₱)",
      align: "right",
      render: (value) => (
        <span className="font-bold">{formatCurrency(value)}</span>
      ), // Format amount
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full mt-[5%]">
        <ClipLoader size={50} color={"#E53E3E"} loading={true} />
      </div>
    );
  }

  return (
    <div className="mt-2">
      <h2 className="text-xl font-bold text-gray-700 mb-2">Sales Report</h2>
      {loading ? (
        <div className="flex items-center justify-center h-full mt-[5%]">
          <ClipLoader size={50} color={"#E53E3E"} loading={true} />
        </div>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-2 border-b-2 border-gray-200 bg-alofa-pink text-white text-left text-sm font-semibold ${
                    column.align === "right" ? "text-right" : ""
                  }`}
                  {...(column.key !== "total_amount" && {
                    onClick: () => handleSort(column.key),
                  })}
                >
                  {column.header}
                  {sortField === column.key &&
                    (sortOrder === "asc" ? (
                      <FaArrowUp className="inline ml-2" />
                    ) : (
                      <FaArrowDown className="inline ml-2" />
                    ))}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id} className="h-10">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-2 border-b ${
                      column.align === "right" ? "text-right" : ""
                    }`}
                  >
                    {column.render
                      ? column.render(order[column.key], order)
                      : order[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SalesReport;
