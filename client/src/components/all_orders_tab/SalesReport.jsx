import React, { useState, useEffect } from "react";
import { getSalesMetrics } from "../../api/orders";

const SalesReport = ({ orders }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [formattedDateRange, setFormattedDateRange] = useState("");
  const [totalLoss, setTotalLoss] = useState(0);
  const [totalSalesWithRefundDeduction, setTotalSalesWithRefundDeduction] =
    useState(0);

  // Set default startDate and endDate based on orders
  useEffect(() => {
    if (orders.length > 0) {
      const sortedOrders = [...orders].sort(
        (a, b) => new Date(a.date_ordered) - new Date(b.date_ordered),
      );
      const defaultStartDate = sortedOrders[0]?.date_ordered;
      const defaultEndDate =
        sortedOrders[sortedOrders.length - 1]?.date_ordered;

      setStartDate(defaultStartDate);
      setEndDate(defaultEndDate);
    }
  }, [orders]);

  // Fetch sales metrics whenever startDate or endDate changes
  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchMetrics = async () => {
      try {
        // Adjust startDate and endDate to remove time and timezone offsets
        const formattedStartDate = new Date(startDate).toLocaleDateString(
          "en-CA",
        ); // Output in YYYY-MM-DD
        const formattedEndDate = new Date(endDate).toLocaleDateString("en-CA"); // Output in YYYY-MM-DD

        const metrics = await getSalesMetrics(
          formattedStartDate,
          formattedEndDate,
        );
        // console.log("Fetched Metrics:", metrics);

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

  // Filter orders to exclude "Cancelled" and within date range
  useEffect(() => {
    if (!startDate || !endDate || orders.length === 0) {
      //   console.log("No orders or invalid date range");
      setTotalOrders(0);
      return;
    }

    const filteredOrders = orders.filter((order) => {
      // Exclude "Cancelled" orders
      const isNotCancelled =
        order.order_status_name.toLowerCase() !== "cancelled";

      // Filter by date range (ignoring time components)
      const orderDate = new Date(order.date_ordered).setHours(0, 0, 0, 0);
      const start = new Date(startDate).setHours(0, 0, 0, 0);
      const end = new Date(endDate).setHours(23, 59, 59, 999);

      const isWithinDateRange = orderDate >= start && orderDate <= end;

      //   console.log(
      //     `Order ${order.order_id}: Status=${order.order_status_name}, Date=${order.date_ordered}, NotCancelled=${isNotCancelled}, WithinDateRange=${isWithinDateRange}`,
      //   );

      return isNotCancelled && isWithinDateRange;
    });

    setTotalOrders(filteredOrders.length);
  }, [orders, startDate, endDate]);

  // Format the date range for display
  const formatDateRange = (startDate, endDate) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const format = new Intl.DateTimeFormat("en-US", options);

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && end) {
      return `${format.format(start)} to ${format.format(end)}`;
    }
    return "Start - End";
  };

  useEffect(() => {
    setFormattedDateRange(formatDateRange(startDate, endDate));
  }, [startDate, endDate]);

  return (
    <div className="bg-gray-50 border rounded-lg p-4 mt-4 shadow-md">
      <h3 className="text-lg font-semibold text-gray-700">Sales Summary</h3>
      <p className="text-sm text-gray-600 mt-1">
        Date Range:{" "}
        <span className="font-medium text-gray-800">{formattedDateRange}</span>
      </p>
      <p className="text-sm text-gray-600">
        Note: All statuses are included except "Cancelled".
      </p>
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
