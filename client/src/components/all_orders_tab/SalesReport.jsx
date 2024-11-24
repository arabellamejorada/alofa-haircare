import React, { useState, useEffect } from "react";
import { getSalesMetrics } from "../../api/orders";

const SalesReport = ({
  orders,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
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

  // Fetch sales metrics whenever startDate or endDate changes
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

  // Calculate total orders excluding "Cancelled" and within the date range
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

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return !isNaN(date) ? date.toLocaleDateString(undefined, options) : "";
  };

  return (
    <div className="bg-gray-50 border rounded-lg p-4 mt-4 shadow-md">
      <h3 className="text-lg font-semibold text-gray-700">Sales Summary</h3>

      {/* Date Range Display */}
      <div className="flex flex-col gap-2 mt-4">
        <p className="text-sm text-gray-600 mt-2">
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
      </div>

      <p className="text-sm text-gray-600 mt-1">
        Note: All statuses are included except "Cancelled".
      </p>

      {/* Metrics */}
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <p className="text-xl font-bold text-gray-800">{totalOrders}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-500 text-sm">
            Sales (Without Refund Deduction)
          </p>
          <p className="text-xl font-bold text-gray-800">
            ₱
            {totalAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-500 text-sm">
            Total Loss (Completed Refunds)
          </p>
          <p className="text-xl font-bold text-gray-800">
            ₱{totalLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-500 text-sm">
            Total Sales (With Refund Deduction)
          </p>
          <p className="text-xl font-bold text-gray-800">
            ₱
            {totalSalesWithRefundDeduction.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
