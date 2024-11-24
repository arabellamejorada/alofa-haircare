import React, { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";
import { getAllOrdersWithItems } from "../../api/orders";
import { FaShoppingBag, FaUsers } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Import arrow icons
import RecentOrdersTable from "./RecentOrdersTable";
import PopularItemsTable from "./PopularItemsTable";
import { ClipLoader } from "react-spinners";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    dailySales: 0,
    dailyOrders: 0,
    dailyCustomers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1); // First day of the current month
  });

  const currentMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  ); // Current month

  useEffect(() => {
    fetchDashboardStats(selectedMonth);
  }, [selectedMonth]);

  const fetchDashboardStats = async (month) => {
    try {
      setLoading(true);

      const ordersResponse = await getAllOrdersWithItems();
      const orders = ordersResponse.orders;

      const startDate = new Date(month);
      const endDate = new Date(month);
      endDate.setMonth(endDate.getMonth() + 1);

      const filteredOrders = orders.filter((order) => {
        const orderDate = new Date(order.date_ordered);
        return orderDate >= startDate && orderDate < endDate;
      });

      const totalSales = filteredOrders.reduce(
        (sum, order) => sum + parseFloat(order.total_amount || 0),
        0,
      );
      const totalOrders = filteredOrders.length;
      const totalCustomers = new Set(filteredOrders.map((o) => o.customer_id))
        .size;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todaysOrders = filteredOrders.filter((order) => {
        const orderDate = new Date(order.date_ordered);
        return (
          orderDate >= today &&
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear()
        );
      });

      const dailySales = todaysOrders.reduce(
        (sum, order) => sum + parseFloat(order.total_amount || 0),
        0,
      );
      const dailyOrders = todaysOrders.length;
      const dailyCustomers = new Set(todaysOrders.map((o) => o.customer_id))
        .size;

      setStats({
        totalSales: totalSales.toFixed(2),
        totalOrders,
        totalCustomers,
        dailySales: dailySales.toFixed(2),
        dailyOrders,
        dailyCustomers,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handlePreviousMonth = () => {
    setSelectedMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setSelectedMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const isPreviousMonthValid = () => {
    const previousMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() - 1,
      1,
    );
    return previousMonth < currentMonth;
  };

  const isNextMonthValid = () => {
    const nextMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() + 1,
      1,
    );
    return nextMonth <= currentMonth;
  };

  const formattedMonth = selectedMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const isCurrentMonth = () =>
    selectedMonth.getFullYear() === currentMonth.getFullYear() &&
    selectedMonth.getMonth() === currentMonth.getMonth();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <strong className="text-3xl font-bold text-gray-700">Dashboard</strong>
        <div className="flex items-center">
          <button
            onClick={handlePreviousMonth}
            className={`p-2 bg-gray-200 rounded-md hover:bg-gray-300 ${
              !isPreviousMonthValid() ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isPreviousMonthValid()}
          >
            <FaChevronLeft />
          </button>
          <span className="mx-4 text-lg font-medium text-gray-700">
            {formattedMonth}
          </span>
          <button
            onClick={handleNextMonth}
            className={`p-2 bg-gray-200 rounded-md hover:bg-gray-300 ${
              !isNextMonthValid() ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isNextMonthValid()}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-full mt-[5%]">
          <ClipLoader size={50} color={"#E53E3E"} loading={true} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-md">
            <DashboardCard
              label="Total Sales"
              value={formatCurrency(stats.totalSales)}
              icon={<FaShoppingBag size={24} />}
              change={
                isCurrentMonth() && stats.dailySales > 0
                  ? `+${formatCurrency(stats.dailySales)}`
                  : undefined
              }
            />
            <DashboardCard
              label="Total Orders"
              value={stats.totalOrders}
              icon={<FaShoppingBag size={24} />}
              change={
                isCurrentMonth() && stats.dailyOrders > 0
                  ? `+${stats.dailyOrders}`
                  : undefined
              }
            />
            <DashboardCard
              label="Total Customers"
              value={stats.totalCustomers}
              icon={<FaUsers size={24} />}
              change={
                isCurrentMonth() && stats.dailyCustomers > 0
                  ? `+${stats.dailyCustomers}`
                  : undefined
              }
            />
          </div>

          <div className="grid grid-cols-4 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl">
            <div className="col-span-3 md:col-span-3">
              <RecentOrdersTable fetchOrders={getAllOrdersWithItems} />
            </div>

            <div className="col-span-1 md:col-span-1">
              <PopularItemsTable
                fetchOrdersWithItems={getAllOrdersWithItems}
                selectedMonth={selectedMonth}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
