import React, { useState, useEffect, Fragment } from "react";
import {
  getAllOrdersWithItems,
  updateShippingStatusAndTrackingNumber,
  updateOrderStatus,
} from "../../api/orders";
import { ClipLoader } from "react-spinners";
import Modal from "../modal/Modal";
import PaymentStatusBadge from "../shared/PaymentStatusBadge";

const Shipping = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getAllOrdersWithItems();
        if (response && response.orders) {
          setOrders(response.orders);
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

    fetchOrders();
  }, []);

  const handleSort = (field) => {
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
    setOrders((prevData) =>
      [...prevData].sort((a, b) => {
        const aField =
          field === "total_amount" ? parseFloat(a[field]) : a[field];
        const bField =
          field === "total_amount" ? parseFloat(b[field]) : b[field];

        if (aField < bField) return newSortOrder === "asc" ? -1 : 1;
        if (aField > bField) return newSortOrder === "asc" ? 1 : -1;
        return 0;
      }),
    );
  };

  const filteredOrders = orders.filter((order) => {
    const orderId = order.order_id.toString();
    const customerName = order.customer_name?.toLowerCase() || "";
    const paymentStatus = order.payment_status_name?.toLowerCase() || "";
    const searchLower = search.toLowerCase();

    return (
      orderId.includes(searchLower) ||
      customerName.includes(searchLower) ||
      paymentStatus.includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredOrders.slice(indexOfFirstRow, indexOfLastRow);

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
    { key: "action", header: "Action" },
    { key: "view_orders", header: "View Orders" },
  ];

  const openModal = (order) => {
    setSelectedOrder(order);
    setTrackingNumber(order.tracking_number || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setTrackingNumber("");
    setIsModalOpen(false);
  };

  const handleUpdateShippingStatus = async () => {
    if (!selectedOrder) return;

    try {
      setLoading(true);

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

      // Check `shipping_id` instead of `id`
      await updateShippingStatusAndTrackingNumber(
        selectedOrder.shipping_id, // Use shipping_id here
        nextStatusId,
        trackingNumber,
      );

      // Update local state to reflect changes
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === selectedOrder.order_id
            ? {
                ...order,
                order_status_id: nextStatusId,
                order_status_name: nextStatusName,
                tracking_number: trackingNumber,
              }
            : order,
        ),
      );

      // Also update the `selectedOrder`
      setSelectedOrder((prevSelectedOrder) => ({
        ...prevSelectedOrder,
        order_status_id: nextStatusId,
        order_status_name: nextStatusName,
        tracking_number: trackingNumber,
      }));

      closeModal();
    } catch (error) {
      console.error("Error updating shipping status:", error);
      setError("Failed to update shipping status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedOrder) {
      setTrackingNumber(selectedOrder.tracking_number || "");
    }
  }, [selectedOrder]);

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Fragment>
      <div className="relative">
        {loading && (
          <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
            <ClipLoader size={50} color="#E53E3E" loading={loading} />
          </div>
        )}

        <div className="container mx-auto">
          <strong className="text-3xl font-bold text-gray-500">Shipping</strong>

          <div className="flex flex-row flex-wrap items-center gap-4 mt-4">
            <input
              type="text"
              className="w-full max-w-md h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
              placeholder="Search by Order ID, Customer Name, or Payment Status..."
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
          </div>

          <table className="min-w-full bg-white mt-4 shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-5 py-3 border-b-2 border-gray-200 bg-alofa-pink text-white text-left text-sm font-semibold ${
                      column.align === "right" ? "text-right" : ""
                    }`}
                    onClick={() => handleSort(column.key)}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((order) => (
                <tr key={order.order_id}>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-5 py-3 border-b ${
                        column.align === "right" ? "text-right" : ""
                      }`}
                    >
                      {column.key === "action" ? (
                        <button
                          onClick={() => openModal(order)}
                          className="px-3 py-1 bg-alofa-pink text-white rounded hover:bg-alofa-dark w-fit"
                        >
                          Update Shipping
                        </button>
                      ) : column.render ? (
                        column.render(order[column.key])
                      ) : (
                        order[column.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

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

          {isModalOpen && selectedOrder && (
            <Modal isVisible={isModalOpen} onClose={closeModal} size="small">
              {console.log("Selected Order:", selectedOrder)}
              <div className="p-6 max-h-[80vh] overflow-y-auto flex flex-col bg-white rounded-lg ">
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
                    className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-alofa-pink hover:bg-white border-slate-300 text-slate-700"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleUpdateShippingStatus}
                    className="px-5 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition duration-200"
                  >
                    {selectedOrder.order_status_id === 2
                      ? "Order Shipped"
                      : selectedOrder.order_status_id === 3
                        ? "Order Complete"
                        : `Update Status (Status ID: ${selectedOrder.order_status_id || "N/A"})`}
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Shipping;
