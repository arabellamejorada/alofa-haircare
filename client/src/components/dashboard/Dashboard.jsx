import React, { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";
import { getAllOrdersWithItems } from "../../api/orders"; // Import your API function
import { FaShoppingBag, FaUsers } from "react-icons/fa"; // Example icons from react-icons
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

  const handleOpenModal = (order) => {
    console.log("Opening modal for order:", order);
    // Implement modal logic here
  };

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);

        // Fetch orders data from API
        const ordersResponse = await getAllOrdersWithItems();
        const orders = ordersResponse.orders;

        // Get today's date at midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter orders placed today
        const todaysOrders = orders.filter((order) => {
          const orderDate = new Date(order.date_ordered); // Use `date_ordered` from API
          return orderDate >= today;
        });

        // Filter unique customers who placed orders today
        const todaysCustomers = new Set(todaysOrders.map((o) => o.customer_id));

        // Calculate cumulative stats
        const totalSales = orders.reduce(
          (sum, order) => sum + parseFloat(order.total_amount || 0),
          0,
        );
        const totalOrders = orders.length;
        const totalCustomers = new Set(orders.map((o) => o.customer_id)).size;

        // Calculate daily stats
        const dailySales = todaysOrders.reduce(
          (sum, order) => sum + parseFloat(order.total_amount || 0),
          0,
        );
        const dailyOrders = todaysOrders.length;
        const dailyCustomers = todaysCustomers.size;

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

    fetchDashboardStats();
  }, []);

  // Format currency with commas
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full mt-[5%]">
        <ClipLoader size={50} color={"#E53E3E"} loading={true} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <strong className="text-3xl font-bold text-gray-500">Dashboard</strong>

      {loading ? (
        <div className="flex items-center justify-center h-full mt-[5%]">
          <ClipLoader size={50} color={"#E53E3E"} loading={true} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-md">
            {/* Total Sales Card */}
            <DashboardCard
              label="Total Sales (This Month)"
              value={formatCurrency(stats.totalSales)}
              icon={<FaShoppingBag size={24} />}
              change={`+${formatCurrency(stats.dailySales)}`} // Daily Sales
            />
            {/* Total Orders Card */}
            <DashboardCard
              label="Total Orders (This Month)"
              value={stats.totalOrders}
              icon={<FaShoppingBag size={24} />}
              change={`+${stats.dailyOrders}`} // Daily Orders
            />
            {/* Total Customers Card */}
            <DashboardCard
              label="Customers"
              value={stats.totalCustomers}
              icon={<FaUsers size={24} />}
            />
          </div>
          <div className="grid grid-cols-4 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl">
            {/* Recent Orders Table */}
            <div className="col-span-3 md:col-span-3">
              <RecentOrdersTable fetchOrders={getAllOrdersWithItems} />
            </div>

            {/* Popular Items Table */}
            <div className="col-span-1 md:col-span-1">
              <PopularItemsTable fetchOrdersWithItems={getAllOrdersWithItems} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
