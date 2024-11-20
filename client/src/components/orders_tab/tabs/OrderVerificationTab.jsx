import React, { useState, useEffect, Fragment } from "react";
import {
  getAllOrdersWithItems,
  updateOrderPaymentStatus,
  updateOrderStatus,
} from "../../../api/orders";
import { ClipLoader } from "react-spinners";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Modal from "../../modal/Modal";
import PaymentStatusBadge from "../../shared/StatusBadge";
import { toast } from "sonner";
import SendEmail from "../../shared/SendEmail";
import ConfirmModal from "../../shared/ConfirmModal";
import ReasonModal from "../../modal/ReasonModal";

const OrderVerificationTab = ({ statusFilter }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Filter states
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");

  // Sorting states
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  // Confirmation Modal States
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => {});
  const [confirmMessage, setConfirmMessage] = useState("");

  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);

  const openConfirmModal = (action, message) => {
    setConfirmAction(() => action);
    setConfirmMessage(message);
    setIsConfirmModalOpen(true);
  };

  const handleImageClick = (imageSrc) => {
    setFullScreenImage(imageSrc);
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
    setFullScreenImage(null);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrdersWithItems();
      if (response && response.orders) {
        let filteredOrders;
        if (statusFilter === "All") {
          filteredOrders = response.orders;
        } else {
          filteredOrders = response.orders.filter(
            (order) => order.payment_status_name === statusFilter,
          );
        }

        // Sort orders by 'order_date' in descending order
        const sortedOrders = filteredOrders.sort((a, b) => {
          const dateA = new Date(a.order_date);
          const dateB = new Date(b.order_date);
          return dateB - dateA; // Most recent first
        });

        setOrders(sortedOrders);
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
    setCurrentPage(1); // Reset to first page when statusFilter changes
  }, [statusFilter]);

  // Handle sorting
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

  // Calculate filtered and paginated data
  const filteredOrders = orders.filter((order) => {
    const orderId = order.order_id.toString();
    const customerName = order.customer_name?.toLowerCase() || "";
    const paymentStatus = order.payment_status_name || "";
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
      render: (amount) =>
        `₱${Number(amount).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    },
    {
      key: "payment_status_name",
      header: "Payment Status",
      render: (status) => <PaymentStatusBadge status={status} />,
    },
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

    console.log("Selected Order:", selectedOrder);

    if (!selectedOrder.customer_email || !selectedOrder.customer_name) {
      toast.error("Customer email or name is missing. Cannot send email.");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Send an email notification to the customer
      const subject = `Payment Verified for Order #${selectedOrder.order_id}`;
      const textContent = `Hi ${selectedOrder.customer_name},\n\nYour payment for Order #${selectedOrder.order_id} has been successfully verified. Thank you for shopping with us!`;
      const htmlContent = `
        <h1>Payment Verified</h1>
        <p>Hi ${selectedOrder.customer_name},</p>
        <p>Your payment for <strong>Order #${selectedOrder.order_id}</strong> has been successfully verified.</p>
        <p>Log in to view your purchases shipping update: <a href="http://localhost:5173/profile/purchases">My Purchases</a></p>
        <p>Thank you for shopping with us!</p>
      `;

      console.log("Sending email with data:", {
        to: selectedOrder.customer_email,
        from: "Alofa Haircare <mailgun@sandbox1463264fb2744256b74af8ebe920ea0c.mailgun.org>", // Replace with verified sender email
        subject,
        text: textContent,
        html: htmlContent,
      });

      await SendEmail(
        selectedOrder.customer_email,
        "Alofa Haircare <mailgun@sandbox1463264fb2744256b74af8ebe920ea0c.mailgun.org>", // Replace with your sender email
        subject,
        textContent,
        htmlContent,
      );

      // Step 2: Update payment status to "Verified" (ID: 2)
      await updateOrderPaymentStatus(selectedOrder.order_id, 2);

      // Step 3: Update order status to "Preparing" (ID: 2)
      await updateOrderStatus(selectedOrder.order_id, 2);

      toast.success("Payment verified and notification sent to customer.");

      await fetchOrders();
      closeModal();
    } catch (error) {
      console.error("Error verifying payment or sending email:", error);
      toast.error("Failed to verify payment. Email was not sent.");
      setError("Failed to verify payment and update order status.");
    } finally {
      setLoading(false);
    }
  };

  const handleInvalidPayment = async (reason) => {
    if (!selectedOrder) return;

    // Validate customer email
    if (!selectedOrder.customer_email || !selectedOrder.customer_name) {
      toast.error("Customer email or name is missing. Cannot send email.");
      return;
    }
    setLoading(true);
    try {
      // Send an email with a link to the refunds page

      const subject = `Refund for Order #${selectedOrder.order_id} due to Invalid Payment`;
      const textContent = `Hi ${selectedOrder.customer_name},\n\nWe have processed a refund for Order #${selectedOrder.order_id} due to the following reason: "${reason}". Please view your account to verify the refunded amount. If there are any issues, you can send us an email. Thank you.`;
      const htmlContent = `
        <h1>Order Refunded</h1>
        <p>Hi ${selectedOrder.customer_name},</p>
        <p>We have processed a refund for <strong>Order #${selectedOrder.order_id}</strong> due to the following reason: "<em>${reason}</em>".</p>
        <p>Please view your account to verify the refunded amount. If there are any issues, you can send us an email.</p>
        <p>Thank you.</p>
      `;

      console.log("Sending email with data:", {
        to: selectedOrder.customer_email,
        from: "Alofa Haircare <mailgun@sandbox1463264fb2744256b74af8ebe920ea0c.mailgun.org>", // Replace with your verified sender email
        subject,
        text: textContent,
        html: htmlContent,
      });

      await SendEmail(
        selectedOrder.customer_email,
        "Alofa Haircare <mailgun@sandbox1463264fb2744256b74af8ebe920ea0c.mailgun.org>", // Replace with your verified sender email
        subject,
        textContent,
        htmlContent,
      );

      // Update payment status to "Refunded" (ID: 3)
      await updateOrderPaymentStatus(selectedOrder.order_id, 3);

      toast.success("Payment status updated to 'Refunded' and email sent.");
      await fetchOrders();
      closeModal();
    } catch (error) {
      console.error("Error processing refund:", error);
      toast.error("Failed to process refund.");
    } finally {
      setLoading(false);
    }
  };

  const handleInsufficientPayment = async () => {
    if (!selectedOrder) return;

    // Validate customer email
    if (!selectedOrder.customer_email || !selectedOrder.customer_name) {
      toast.error("Customer email or name is missing. Cannot send email.");
      return;
    }
    setLoading(true);
    try {
      // Send an email with a link to the refunds page

      const subject = `Insufficient Payment for Order #${selectedOrder.order_id}`;
      const textContent = `Hi ${selectedOrder.customer_name},\n\nYour payment for your Order #${selectedOrder.order_id} is insufficient. Please settle the remaining balance within 24 hours after this email is sent and send the receipt by replying to this thread. Thank you.`;
      const htmlContent = `
        <h1>Insufficient Payment</h1>
        <p>Hi ${selectedOrder.customer_name},</p>
        <p>Your payment for your Order #${selectedOrder.order_id}.</p>
        <p>Please settle the remaining balance within 24 hours after this email is sent and send proof by replying to this thread.</p>
        <p>Thank you.</p>
      `;

      console.log("Sending email with data:", {
        to: selectedOrder.customer_email,
        from: "Alofa Haircare <mailgun@sandbox1463264fb2744256b74af8ebe920ea0c.mailgun.org>", // Replace with your verified sender email
        subject,
        text: textContent,
        html: htmlContent,
      });

      await SendEmail(
        selectedOrder.customer_email,
        "Alofa Haircare <mailgun@sandbox1463264fb2744256b74af8ebe920ea0c.mailgun.org>", // Replace with your verified sender email
        subject,
        textContent,
        htmlContent,
      );

      toast.success("Email sent to customer regarding insufficient payment.");
      await fetchOrders();
      closeModal();
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email.");
    } finally {
      setLoading(false);
    }
  };

  const handleReasonSubmit = (reason) => {
    // Open the ConfirmModal with the handleInvalidPayment action and a dynamic message including the reason
    openConfirmModal(
      () => handleInvalidPayment(reason),
      `Are you sure you want to mark this payment as invalid for the following reason?\n\n"${reason}"`,
    );
    // Close the ReasonModal
    setIsReasonModalOpen(false);
  };

  if (error) return <div className="text-red-500">{error}</div>;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full mt-[5%]">
        <ClipLoader size={50} color={"#E53E3E"} loading={true} />
      </div>
    );
  }

  return (
    <Fragment>
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
                    <td className="text-left border-b">
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
          </>
        )}

        {/* Order Details Modal */}
        {isModalOpen && selectedOrder && (
          <Modal isVisible={isModalOpen} onClose={closeModal} size="large">
            <div className="p-6 max-h-[80vh] overflow-y-auto flex flex-col bg-white rounded-lg ">
              <h2 className="text-4xl font-bold mb-6 text-alofa-pink">
                Order Details
              </h2>

              <div className="flex flex-row">
                <div className="flex-1">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dl className="divide-y divide-gray-200">
                      <div className="py-3">
                        <dt className="text-sm font-medium text-gray-500">
                          Customer Name
                        </dt>
                        <dd className="mt-1 text-base text-gray-900">
                          {selectedOrder.customer_name}
                        </dd>
                      </div>
                      <div className="py-3">
                        <dt className="text-sm font-medium text-gray-500">
                          Total Amount
                        </dt>
                        <dd className="mt-1 text-base text-gray-900">
                          ₱
                          {Number(selectedOrder.total_amount).toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}
                        </dd>
                      </div>
                      <div className="py-3">
                        <dt className="text-sm font-medium text-gray-500">
                          Payment Status
                        </dt>
                        <dd className="mt-1 text-base text-gray-900">
                          <PaymentStatusBadge
                            status={selectedOrder.payment_status_name}
                          />
                        </dd>
                      </div>
                      <div className="py-3">
                        <dt className="text-sm font-medium text-gray-500">
                          Order Status
                        </dt>
                        <dd className="mt-1 text-base text-gray-900">
                          {selectedOrder.order_status_name}
                        </dd>
                      </div>
                      <div className="py-3">
                        <dt className="text-sm font-medium text-gray-500">
                          Date Ordered
                        </dt>
                        <dd className="mt-1 text-base text-gray-900">
                          {(() => {
                            const dateValue = selectedOrder.order_date;
                            if (!dateValue) return "Date not available";
                            const date = new Date(dateValue);
                            return !isNaN(date.getTime())
                              ? date.toLocaleString()
                              : "Date not available";
                          })()}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                <div>
                  {/* Proof Image Section */}
                  {selectedOrder.proof_image ? (
                    <div>
                      <strong className="text-sm font-bold text-gray-500">
                        Proof of Payment:
                      </strong>
                      <img
                        src={`http://localhost:3001/${selectedOrder.proof_image.substring(7)}`}
                        alt="Payment Proof"
                        className="mt-2 max-w-xs h-[30rem] mx-auto border rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:border-alofa-pink cursor-pointer"
                        onClick={() =>
                          handleImageClick(
                            `http://localhost:3001/${selectedOrder.proof_image.substring(7)}`,
                          )
                        }
                      />
                      {/* Full-Screen Image Modal */}
                      {isFullScreen && fullScreenImage && (
                        <div
                          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
                          onClick={closeFullScreen}
                        >
                          <img
                            src={fullScreenImage}
                            alt="Full-Sized Payment Proof"
                            className="max-w-full max-h-full rounded-lg shadow-lg"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 text-red-500 font-semibold">
                      No payment proof image available.
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {selectedOrder.payment_status_name !== "Verified" &&
                  selectedOrder.payment_status_name !== "Refunded" && (
                    <>
                      <button
                        onClick={() =>
                          openConfirmModal(
                            handleVerifyPayment,
                            "Are you sure you want to verify this payment?",
                          )
                        }
                        className="px-6 py-2 bg-alofa-pink text-white font-semibold rounded-lg hover:bg-alofa-dark transition"
                      >
                        Verify Payment
                      </button>
                      <button
                        onClick={() => setIsReasonModalOpen(true)}
                        className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition"
                      >
                        Invalid Payment
                      </button>
                      <button
                        onClick={() =>
                          openConfirmModal(
                            handleInsufficientPayment,
                            "Are you sure you want to mark this payment as insufficient?",
                          )
                        }
                        className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition"
                      >
                        Insufficient Payment
                      </button>
                    </>
                  )}
              </div>
            </div>
            <ConfirmModal
              isOpen={isConfirmModalOpen}
              onClose={() => setIsConfirmModalOpen(false)}
              onConfirm={() => {
                confirmAction();
                setIsConfirmModalOpen(false);
              }}
              message={confirmMessage}
            />
            <ReasonModal
              isOpen={isReasonModalOpen}
              onClose={() => setIsReasonModalOpen(false)}
              onSubmit={handleReasonSubmit}
            />
          </Modal>
        )}
      </div>
    </Fragment>
  );
};

export default OrderVerificationTab;
