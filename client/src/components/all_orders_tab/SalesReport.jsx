import React, { useEffect, useState } from "react";
import { getSalesMetrics } from "../../api/orders";

const SalesReport = ({
  orders,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalLoss, setTotalLoss] = useState(0);
  const [totalSalesWithRefundDeduction, setTotalSalesWithRefundDeduction] =
    useState(0);

  // Set default startDate and endDate based on orders if not provided
  useEffect(() => {
    // console.log("startDate", startDate);
    // console.log("endDate", endDate);
    if (orders.length > 0 && (!startDate || !endDate)) {
      const sortedOrders = [...orders].sort(
        (a, b) => new Date(a.date_ordered) - new Date(b.date_ordered),
      );
      const defaultStartDate = new Date(sortedOrders[0]?.date_ordered)
        .toISOString()
        .split("T")[0]; // Earliest order date (YYYY-MM-DD)
      const defaultEndDate = new Date(
        sortedOrders[sortedOrders.length - 1]?.date_ordered,
      )
        .toISOString()
        .split("T")[0]; // Latest order date (YYYY-MM-DD)

      setStartDate(defaultStartDate);
      setEndDate(defaultEndDate);
    }
  }, [orders, startDate, endDate, setStartDate, setEndDate]);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchMetrics = async () => {
      try {
        const metrics = await getSalesMetrics(startDate, endDate);
        setTotalAmount(Number(metrics.total_sales || 0));
        setTotalLoss(Number(metrics.total_loss || 0));
        setTotalSalesWithRefundDeduction(
          Number(metrics.total_sales_with_refund_deduction || 0),
        );
      } catch (error) {
        console.error("Error fetching sales metrics:", error);
      }
    };

    fetchMetrics();
  }, [startDate, endDate]);

  useEffect(() => {
    if (!startDate || !endDate || orders.length === 0) {
      setTotalOrders(0);
      return;
    }

    const filteredOrders = orders.filter((order) => {
      const isNotCancelled =
        order.order_status_name.toLowerCase() !== "cancelled";

      const orderDate = new Date(order.date_ordered).setHours(0, 0, 0, 0);
      const start = new Date(startDate).setHours(0, 0, 0, 0);
      const end = new Date(endDate).setHours(23, 59, 59, 999);

      return isNotCancelled && orderDate >= start && orderDate <= end;
    });

    setTotalOrders(filteredOrders.length);
  }, [orders, startDate, endDate]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return !isNaN(date) ? date.toLocaleDateString(undefined, options) : "";
  };

  return (
    <div className="rounded-xl shadow-md border bg-white mt-4">
      <button
        className="w-full flex justify-between items-center px-6 py-2 bg-gradient-to-r from-alofa-pink to-alofa-pink text-white text-lg font-semibold rounded-t-lg transition hover:from-alofa-pink hover:to-red-400"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>Sales Summary</span>
        <span className="text-xl">{isExpanded ? "−" : "+"}</span>
      </button>
      {isExpanded && (
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-600">
              Date Range:{" "}
              <span className="font-medium text-gray-800">
                {startDate && endDate
                  ? `${formatDate(startDate)} to ${formatDate(endDate)}`
                  : orders.length > 0
                    ? `${formatDate(
                        new Date(orders[0]?.date_ordered)
                          .toISOString()
                          .split("T")[0],
                      )} to ${formatDate(
                        new Date(orders[orders.length - 1]?.date_ordered)
                          .toISOString()
                          .split("T")[0],
                      )}`
                    : "No orders available"}
              </span>
            </p>
            <p className="text-xs text-gray-500">
              Note: Cancelled orders not included.
            </p>
          </div>

          {/* Row Layout for Metrics */}
          <div className="flex flex-wrap justify-around items-center gap-4">
            {/* Total Orders */}
            <div className="flex flex-col items-center text-center">
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
            </div>

            {/* Gross Sales */}
            <div className="flex flex-col items-center text-center">
              <p className="text-gray-500 text-sm">Gross Sales</p>
              <p className="text-2xl font-bold text-gray-800">
                ₱
                {totalAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            {/* Plus Icon */}
            <div className="text-gray-500 text-xl font-bold">-</div>

            {/* Total Loss */}
            <div className="flex flex-col items-center text-center">
              <p className="text-gray-500 text-sm">Total Loss (Refunds)</p>
              <p className="text-2xl font-bold text-gray-800">
                ₱
                {totalLoss.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>

            {/* Equals Icon */}
            <div className="text-gray-500 text-xl font-bold">=</div>

            {/* Net Income */}
            <div className="flex flex-col items-center text-center">
              <p className="text-gray-500 text-sm">Net Income</p>
              <p className="text-2xl font-bold text-gray-800">
                ₱
                {totalSalesWithRefundDeduction.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesReport;
