import React from "react";
import { Link } from "react-router-dom";
import { getOrderStatus } from "../lib/consts/utils";

const recentOrderData = [
  {
    id: "1",
    product_id: "12",
    customer_id: "23143",
    customer_name: "Shirley A. Lape",
    order_date: "2022-05-17",
    order_total: "₱435.50",
    current_order_status: "PLACED",
    shipment_address: "Matina, Davao City",
  },
  {
    id: "7",
    product_id: "1",
    customer_id: "96453",
    customer_name: "Ryan Carroll",
    order_date: "2022-05-14",
    order_total: "₱96.35",
    current_order_status: "CONFIRMED",
    shipment_address: "Mintal, Davao City",
  },
  {
    id: "2",
    product_id: "4",
    customer_id: "65345",
    customer_name: "Mason Nash",
    order_date: "2022-05-17",
    order_total: "₱836.44",
    current_order_status: "SHIPPED",
    shipment_address: "Catalunan Pequeno, Davao City",
  },
  {
    id: "3",
    product_id: "2",
    customer_id: "87832",
    customer_name: "Luke Parkin",
    order_date: "2022-05-16",
    order_total: "₱334.50",
    current_order_status: "SHIPPED",
    shipment_address: "Bangkal, Davao City",
  },
  {
    id: "4",
    product_id: "9",
    customer_id: "09832",
    customer_name: "Anthony Fry",
    order_date: "2022-05-14",
    order_total: "₱876.00",
    current_order_status: "DELIVERED",
    shipment_address: "Madang, Mati City",
  },
  {
    id: "5",
    product_id: "6",
    customer_id: "97632",
    customer_name: "Ryan Carroll",
    order_date: "2022-05-14",
    order_total: "₱96.35",
    current_order_status: "DELIVERED",
    shipment_address: "Jacinto St., Davao City",
  },
];

function RecentOrders() {
  return (
    <div className="bg-white px-4 pt-3 pb-4 rounded-sm border-gray-200 flex-1">
      <strong className="text-gray-700 font-medium">Recent Orders</strong>
      <div className="mt-3">
        <table className="w-full text-gray-700 border-x border-gray-200 rounded-sm">
          <thead>
            <tr>
              <td>ID</td>
              <td>Product ID</td>
              <td>Customer Name</td>
              <td>Order Date</td>
              <td>Order Total</td>
              <td>Shipment Address</td>
              <td>Current Order Status</td>
            </tr>
          </thead>

          {/* 
          Fill tables with data.
          For each order, render out a table row with the following columns:
          */}
          <tbody>
            {recentOrderData.map((order) => (
              <tr key={order.id}>
                <td>
                  <Link to={"/order/$order.id"}>#{order.id}</Link>
                </td>
                <td>
                  <Link to={"/product/$order.product_id"}>
                    {order.product_id}
                  </Link>
                </td>
                <td>
                  <Link to={"/customer/$order.customer_name"}>
                    {order.customer_name}
                  </Link>
                </td>
                <td>{order.order_date}</td>
                <td>{order.order_total}</td>
                <td>{order.shipment_address}</td>
                <td>{getOrderStatus(order.current_order_status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentOrders;
