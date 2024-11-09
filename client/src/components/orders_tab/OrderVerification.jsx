import React, { useState, useEffect, Fragment } from "react";
import {
  getAllOrdersWithItems,
  updateOrderPaymentStatus,
} from "../../api/orders";
import { ClipLoader } from "react-spinners";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Modal from "../modal/Modal"; // Adjust the import path as needed
import PaymentStatusBadge from "./PaymentStatusBadge"; // Import the PaymentStatusBadge component

const OrderVerification = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Filter states
  const [search, setSearch] = useState("");

  // Sorting states
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleImageClick = () => {
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
  };

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

  // Handle sorting
  const handleSort = (field) => {
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
    setOrders((prevData) =>
      [...prevData].sort((a, b) => {
        if (a[field] < b[field]) return newSortOrder === "asc" ? -1 : 1;
        if (a[field] > b[field]) return newSortOrder === "asc" ? 1 : -1;
        return 0;
      }),
    );
  };

  // Calculate filtered and paginated data
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

  // Define columns for orders table, using PaymentStatusBadge for payment status
  const columns = [
    { key: "order_id", header: "Order ID" },
    { key: "customer_name", header: "Customer Name" },
    {
      key: "total_amount",
      header: "Total Amount",
      align: "right",
      render: (amount) => `₱${Number(amount).toFixed(2).toLocaleString()}`,
    },
    {
      key: "payment_status_name",
      header: "Payment Status",
      render: (status) => <PaymentStatusBadge status={status} />, // Use PaymentStatusBadge here
    },
    { key: "order_status_name", header: "Order Status" },
    { key: "order_date", header: "Date Ordered" },
    { key: "action", header: "Action" },
  ];

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const handleVerifyPayment = async () => {
    if (!selectedOrder) return;
    try {
      setLoading(true);
      await updateOrderPaymentStatus(selectedOrder.order_id, 2); // Assuming 2 is 'Verified'

      // Update the local state to reflect the change
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === selectedOrder.order_id
            ? {
                ...order,
                payment_status_id: 2,
                payment_status_name: "Verified",
              }
            : order,
        ),
      );
      closeModal();
    } catch (error) {
      console.error("Error verifying payment:", error);
      setError("Failed to verify payment");
    } finally {
      setLoading(false);
    }
  };

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
          <strong className="text-3xl font-bold text-gray-500">
            Verify Order Payments
          </strong>

          {/* Filters Section */}
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

          {/* Orders Table */}
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
              {currentData.map((order) => (
                <tr key={order.order_id}>
                  {columns.slice(0, -1).map((column) => (
                    <td
                      key={column.key}
                      className={`px-5 py-2 border-b ${
                        column.align === "right" ? "text-right" : ""
                      }`}
                    >
                      {column.render
                        ? column.render(order[column.key])
                        : order[column.key]}
                    </td>
                  ))}
                  <td className="text-center border-b">
                    <button
                      onClick={() => openModal(order)}
                      className="px-3 py-1 bg-alofa-pink text-white rounded hover:bg-alofa-dark w-fit"
                    >
                      Review Payment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
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
          {/* Order Details Modal */}
          {isModalOpen && selectedOrder && (
            <Modal isVisible={isModalOpen} onClose={closeModal} size="large">
              <div className="p-6 max-h-[80vh] overflow-y-auto flex flex-col bg-white rounded-lg ">
                <h2 className="text-4xl font-bold mb-6 text-alofa-pink">
                  Order Details
                </h2>

                <div className="flex flex-col md:flex-row gap-2">
                  {/* Order Details Section */}
                  <div className="flex-1 text-lg space-y-3">
                    <div className="flex flex-col gap-3 pb-4">
                      <p className="flex flex-col">
                        <strong className="font-bold">Customer Name:</strong>
                        <div>{selectedOrder.customer_name}</div>
                      </p>
                      <p>
                        <strong className="font-bold">Total Amount:</strong>
                        <div>
                          ₱{Number(selectedOrder.total_amount).toLocaleString()}
                        </div>
                      </p>
                      <p>
                        <strong className="font-bold">Payment Status:</strong>
                        <div>
                          <PaymentStatusBadge
                            status={selectedOrder.payment_status_name}
                          />
                        </div>
                      </p>
                      <p>
                        <strong className="font-bold">Order Status:</strong>
                        <div>{selectedOrder.order_status_name}</div>
                      </p>
                      <p>
                        <strong className="font-bold">Date Ordered:</strong>
                        <div>
                          {(() => {
                            const dateValue = selectedOrder.order_date;
                            if (!dateValue) return "Date not available";
                            const date = new Date(dateValue);
                            return !isNaN(date.getTime())
                              ? date.toLocaleString()
                              : "Date not available";
                          })()}
                        </div>
                      </p>
                    </div>
                  </div>

                  {/* Proof Image Section */}
                  {selectedOrder.proof_image ? (
                    <div>
                      <strong className="font-bold mb-2">
                        Proof of Payment:
                      </strong>
                      <img
                        src={`http://localhost:3001/${selectedOrder.proof_image.substring(7)}`}
                        alt="Payment Proof"
                        className="mt-2 max-w-xs h-[30rem] mx-auto border rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                        onClick={handleImageClick}
                      />

                      {/* Full-Screen Image Modal */}
                      {isFullScreen && (
                        <div
                          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
                          onClick={closeFullScreen}
                        >
                          <img
                            src={`http://localhost:3001/${selectedOrder.proof_image.substring(7)}`}
                            alt="Full-Sized Payment Proof"
                            className="max-w-full max-h-full rounded-lg shadow-lg"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="mt-4 text-red-500 font-semibold">
                      No payment proof image available.
                    </p>
                  )}
                </div>

                {/* Action Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleVerifyPayment}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition duration-200"
                  >
                    Verify Payment
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

export default OrderVerification;
