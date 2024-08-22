import React from "react";
import DashboardStatsGrid from "./DashboardStatsGrid";
import TransactionChart from "./TransactionChart";
import BuyerProfileChart from "./BuyerProfileChart";
import RecentOrders from "./RecentOrders";
import PopularProducts from "./PopularProducts";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-2">
      <strong className="text-3xl font-bold text-gray-500">Dashboard</strong>
      <DashboardStatsGrid />
      <div className="flex flex-row gap-2 w-full">
        <TransactionChart />
        <BuyerProfileChart />
      </div>
      <div className="flex flex-row gap-2 w-full">
        <RecentOrders />
        <PopularProducts />
      </div>
    </div>
  );
}
