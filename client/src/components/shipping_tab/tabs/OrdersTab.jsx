// src/components/ShippingTabs/OrdersTab.jsx

import React, { useState, useEffect } from "react";
import {
  getAllOrdersWithItems,
  updateShippingStatusAndTrackingNumber,
  getOrderItemsByOrderId,
} from "../../../api/orders";
import { createStockOut } from "../../../api/stockOut";
import { ClipLoader } from "react-spinners";
import Modal from "../../modal/Modal";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import PaymentStatusBadge from "../../shared/StatusBadge";
import { toast } from "sonner";
import { useAuth } from "../../AuthContext";

const OrdersTab = ({ statusFilter }) => {
  const { employeeId } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState(null);

  // Sorting states
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Pagination states
  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState("");

  const [orderItems, setOrderItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  const openModal = async (order) => {
    setSelectedOrder(order);
    setTrackingNumber(order.tracking_number || "");

    // Fetch order items for the selected order
    try {
      const response = await getOrderItemsByOrderId(order.order_id);
      if (response && response.order_items) {
        setOrderItems(response.order_items);

        // Initialize checkedItems based on order status
        const initialCheckedItems = {};
        response.order_items.forEach((item) => {
          initialCheckedItems[item.order_item_id] =
            order.order_status_id === 3 || order.order_status_id === 4
              ? true
              : !!checkedItems[item.order_item_id];
        });
        setCheckedItems(initialCheckedItems);
      } else {
        setOrderItems([]);
      }
    } catch (error) {
      console.error("Error fetching order items:", error);
      setOrderItems([]);
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setTrackingNumber("");
    setOrderItems([]);
    setCheckedItems({});
    setIsModalOpen(false);
  };

  const handleCheckboxChange = (e, itemId) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: e.target.checked,
    }));
  };

  const allItemsChecked = () => {
    return orderItems.every((item) => checkedItems[item.order_item_id]);
  };

  const handleUpdateShippingStatus = async () => {
    if (!selectedOrder) return;

    if (!trackingNumber) {
      toast.error("Please enter a tracking number.");
      return;
    }

    if (!allItemsChecked()) {
      toast.error(
        "Please verify all items are prepared before updating the status.",
      );
      return;
    }

    try {
      setUpdatingStatus(true);

      let nextStatusId;
      let nextStatusName;

      if (selectedOrder.order_status_id === 2) {
        nextStatusId = 3;
        nextStatusName = "Shipped";
      } else if (selectedOrder.order_status_id === 3) {
        nextStatusId = 4;
        nextStatusName = "Completed";
      } else {
        return;
      }

      // Only handle stock out when status changes to "Shipped"
      if (nextStatusName === "Shipped") {
        await handleStockOutOnShipping();
      }

      // Update the shipping status and tracking number
      await updateShippingStatusAndTrackingNumber(
        selectedOrder.shipping_id,
        nextStatusId,
        trackingNumber,
      );

      toast.success("Shipping status updated successfully.");

      closeModal();
      await fetchOrders();
    } catch (error) {
      console.error("Error updating shipping status:", error);
      setError("Failed to update shipping status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleStockOutOnShipping = async () => {
    if (!allItemsChecked()) {
      toast.error("Please check all items before shipping.");
      return;
    }

    if (!employeeId) {
      toast.error("Employee ID is missing. Cannot proceed with stock out.");
      console.error("Employee ID is null or undefined.");
      return;
    }

    // Prepare data with the current date and dynamic reason based on order ID
    const stockOutDate = new Date().toISOString();
    const stockOutProducts = orderItems.map((item) => ({
      variation_id: item.variation_id,
      quantity: item.quantity,
      reason: `Shipped Order #${selectedOrder.order_id}`,
    }));

    const stockOutData = {
      stock_out_date: stockOutDate,
      order_id: selectedOrder.order_id,
      employee_id: employeeId,
      stockOutProducts,
    };

    try {
      await createStockOut(stockOutData);
      toast.success("Stock out recorded successfully for shipped order.");
    } catch (error) {
      console.error("Error processing stock out and shipping:", error);
      toast.error("An error occurred while processing the stock out.");
      throw error; // Re-throw to prevent proceeding
    }
  };

  const handleCancelShipping = async () => {
    if (!selectedOrder) return;

    try {
      setUpdatingStatus(true);

      const revertStatusId = 2;
      const revertStatusName = "Preparing";

      await updateShippingStatusAndTrackingNumber(
        selectedOrder.shipping_id,
        revertStatusId,
        null,
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === selectedOrder.order_id
            ? {
                ...order,
                order_status_id: revertStatusId,
                order_status_name: revertStatusName,
                tracking_number: null,
              }
            : order,
        ),
      );

      setSelectedOrder((prevSelectedOrder) => ({
        ...prevSelectedOrder,
        order_status_id: revertStatusId,
        order_status_name: revertStatusName,
        tracking_number: null,
      }));

      setCheckedItems({});
      toast.success("Shipping cancelled successfully.");

      closeModal();
    } catch (error) {
      console.error("Error canceling shipping:", error);
      setError("Failed to cancel shipping");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrdersWithItems();
      if (response && response.orders) {
        let filteredOrders;
        if (statusFilter === "All") {
          filteredOrders = response.orders.filter(
            (order) => order.order_status_name !== "Pending",
          );
        } else {
          filteredOrders = response.orders.filter(
            (order) => order.order_status_name === statusFilter,
          );
        }

        setOrders(filteredOrders);
      } else {
        console.error("No orders data found.");
      }
    } catch (err) {
      setError("Failed to fetch orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    setCurrentPage(1); // Reset to first page when filters change
  }, [statusFilter]);

  // Handle sorting
  const handleSort = (field) => {
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);

    const sortedData = [...orders].sort((a, b) => {
      const aField = isNaN(a[field]) ? a[field] : parseFloat(a[field]);
      const bField = isNaN(b[field]) ? b[field] : parseFloat(b[field]);

      if (aField < bField) return newSortOrder === "asc" ? -1 : 1;
      if (aField > bField) return newSortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setOrders(sortedData);
  };

  // Filtered orders based on search and date filters
  const filteredOrders = orders.filter((order) => {
    const orderId = order.order_id.toString();
    const customerName = order.customer_name?.toLowerCase() || "";
    const searchLower = search.toLowerCase();

    // Filter by search terms
    const matchesSearch =
      orderId.includes(searchLower) || customerName.includes(searchLower);

    // Filter by date
    let withinDateRange = true;

    if (startDate || endDate) {
      const orderDateStr = order.order_date;
      if (!orderDateStr) {
        withinDateRange = false; // If order date is missing, exclude it
      } else {
        const orderDate = new Date(orderDateStr);
        const orderDateTime = orderDate.getTime();

        let startDateTime = startDate
          ? new Date(startDate).setHours(0, 0, 0, 0)
          : null;
        let endDateTime = endDate
          ? new Date(endDate).setHours(23, 59, 59, 999)
          : null;

        if (startDateTime && orderDateTime < startDateTime) {
          withinDateRange = false;
        }
        if (endDateTime && orderDateTime > endDateTime) {
          withinDateRange = false;
        }
      }
    }

    return matchesSearch && withinDateRange;
  });

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedData = filteredOrders.slice(indexOfFirstRow, indexOfLastRow);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const columns = [
    { key: "order_id", header: "Order ID" },
    { key: "customer_name", header: "Customer Name" },
    {
      key: "order_status_name",
      header: "Order Status",
      render: (status) => <PaymentStatusBadge status={status} />,
    },
    { key: "order_date", header: "Date Ordered" },
    { key: "actions", header: "Actions" },
  ];

  if (error) return <div className="text-red-500">{error}</div>;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full mt-[5%]">
        <ClipLoader size={50} color={"#E53E3E"} loading={true} />
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        {/* Filters Section */}
        <div className="flex flex-row flex-wrap items-center gap-4">
          <input
            type="text"
            className="w-full max-w-md h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
            placeholder="Search by Order ID or Customer Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-sm ml-2 text-alofa-pink hover:text-alofa-dark"
            >
              Clear
            </button>
          )}
          {/* Date Filters */}
          <div className="flex items-center">
            <label className="mr-2 text-sm font-medium text-gray-700">
              Start Date:
            </label>
            <input
              type="date"
              className="h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <label className="mr-2 text-sm font-medium text-gray-700">
              End Date:
            </label>
            <input
              type="date"
              className="h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="text-sm ml-2 text-alofa-pink hover:text-alofa-dark"
            >
              Clear Dates
            </button>
          )}
        </div>

        {/* Table */}
        {filteredOrders.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-600">
                No data available
              </p>
              <p className="text-sm text-gray-500 mt-2">
                There are currently no records to display.
              </p>
            </div>
          </div>
        ) : (
          <>
            <table className="min-w-full bg-white mt-4 shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-5 py-3 border-b-2 border-gray-200 bg-alofa-pink text-white text-left text-sm font-semibold cursor-pointer"
                      onClick={() => handleSort(column.key)}
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
                {paginatedData.map((order) => (
                  <tr key={order.order_id}>
                    <td className="px-5 py-3 border-b">{order.order_id}</td>
                    <td className="px-5 py-3 border-b">
                      {order.customer_name}
                    </td>
                    <td className="px-5 py-3 border-b">
                      <PaymentStatusBadge status={order.order_status_name} />
                    </td>
                    <td className="px-5 py-3 border-b">
                      {(() => {
                        const dateValue = order.order_date;
                        if (!dateValue) return "Date not available";
                        const date = new Date(dateValue);
                        return !isNaN(date.getTime())
                          ? date.toLocaleString()
                          : "Date not available";
                      })()}
                    </td>
                    <td className="px-5 py-3 border-b">
                      <button
                        onClick={() => openModal(order)}
                        className="px-3 py-1 bg-alofa-pink text-white rounded hover:bg-alofa-dark"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Loading Overlay */}
        {updatingStatus && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <ClipLoader size={50} color={"#E53E3E"} loading={true} />
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <Modal isVisible={isModalOpen} onClose={closeModal} size="small">
          <div className="p-6 max-h-[80vh] overflow-y-auto flex flex-col bg-white rounded-lg">
            <>
              <div className="flex flex-col w-full">
                <div className="font-extrabold text-3xl text-alofa-dark mb-4">
                  Update Shipping Status
                </div>
                <label className="font-bold" htmlFor="tracking_number">
                  Tracking Number:
                </label>
                <input
                  type="text"
                  name="tracking_number"
                  id="tracking_number"
                  placeholder="Tracking Number"
                  className={`rounded-xl border w-full h-10 pl-4 
                    ${
                      selectedOrder.order_status_id === 4 ||
                      selectedOrder.order_status_id === 3
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-50 text-slate-700 hover:border-alofa-pink hover:bg-white"
                    }`}
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  disabled={
                    selectedOrder.order_status_id === 3 ||
                    selectedOrder.order_status_id === 4
                  }
                />
              </div>
              {/* Order Items Section */}
              <div className="mt-4">
                <h3 className="font-bold text-lg mb-2">Order Items</h3>
                {orderItems.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto border rounded-md bg-gray-50 shadow-sm">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-gray-700 font-semibold sticky top-0 bg-gray-100">
                            Select
                          </th>
                          <th className="px-4 py-2 text-left text-gray-700 font-semibold sticky top-0 bg-gray-100">
                            Product
                          </th>
                          <th className="px-4 py-2 text-left text-gray-700 font-semibold sticky top-0 bg-gray-100">
                            Variation
                          </th>
                          <th className="px-4 py-2 text-right text-gray-700 font-semibold sticky top-0 bg-gray-100">
                            Quantity
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderItems.map((item) => (
                          <tr key={item.order_item_id} className="border-t">
                            <td className="px-4 py-2">
                              <input
                                type="checkbox"
                                checked={!!checkedItems[item.order_item_id]}
                                onChange={(e) =>
                                  handleCheckboxChange(e, item.order_item_id)
                                }
                                className="w-4 h-4 text-alofa-pink rounded border-gray-300"
                                disabled={
                                  selectedOrder.order_status_id === 3 ||
                                  selectedOrder.order_status_id === 4
                                }
                              />
                            </td>
                            <td className="px-4 py-2 text-gray-800">
                              {item.product_name}
                            </td>
                            <td className="px-4 py-2 text-gray-600">
                              {item.variation_type} ({item.variation_value})
                            </td>
                            <td className="px-4 py-2 text-right text-gray-800">
                              {item.quantity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No items found for this order.
                  </p>
                )}
              </div>
              <div className="mt-8 flex justify-end">
                {selectedOrder.order_status_id !== 4 && (
                  <button
                    onClick={handleUpdateShippingStatus}
                    className="px-5 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition duration-200"
                  >
                    {selectedOrder.order_status_id === 2
                      ? "Order Shipped"
                      : selectedOrder.order_status_id === 3
                        ? "Order Complete"
                        : `Update Status (Status ID: ${
                            selectedOrder.order_status_id || "N/A"
                          })`}
                  </button>
                )}
                {selectedOrder.order_status_id !== 2 && (
                  <button
                    onClick={handleCancelShipping}
                    className="ml-4 px-5 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition duration-200"
                  >
                    Cancel Shipping
                  </button>
                )}
              </div>
            </>
          </div>
        </Modal>
      )}
    </>
  );
};

export default OrdersTab;
