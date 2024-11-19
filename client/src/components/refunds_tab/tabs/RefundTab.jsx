// src/components/tabs/RefundTab.jsx

import React, { useState, useEffect, Fragment } from "react";
import { getAllRefundRequests, updateRefundStatus } from "../../../api/orders";
import { ClipLoader } from "react-spinners";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Modal from "../../modal/Modal";
import StatusBadge from "../../shared/StatusBadge";
import { toast } from "sonner";
import ConfirmModal from "../../shared/ConfirmModal";
import SendEmail from "../../shared/SendEmail";

const RefundTab = ({ statusFilter }) => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Filter states
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Sorting states
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => {});

  const [confirmMessage, setConfirmMessage] = useState("");

  const openConfirmModal = (action, message) => {
    setConfirmAction(() => action);
    setConfirmMessage(message); // Set the dynamic message
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

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const data = await getAllRefundRequests();
      setRefunds(data); // Ensure email is included in `data`
      console.log(data);
    } catch (err) {
      setError("Failed to fetch refund requests");
      console.error("Error fetching refunds:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Current status filter:", statusFilter);
    fetchRefunds();
    setCurrentPage(1);
  }, [statusFilter]);

  // Handle sorting
  const handleSort = (field) => {
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
    setRefunds((prevData) =>
      [...prevData].sort((a, b) => {
        const aField =
          field === "total_refund_amount" ? parseFloat(a[field]) : a[field];
        const bField =
          field === "total_refund_amount" ? parseFloat(b[field]) : b[field];

        if (aField < bField) return newSortOrder === "asc" ? -1 : 1;
        if (aField > bField) return newSortOrder === "asc" ? 1 : -1;
        return 0;
      }),
    );
  };

  // Calculate filtered and paginated data
  const normalizeStatusFilter = (statusFilter) => {
    switch (statusFilter) {
      case "Pending":
      case "Pending Refunds":
        return "Processing";
      case "Processed":
      case "Processed Refunds":
        return "Completed";
      case "Cancelled":
      case "Cancelled Refunds":
        return "Cancelled";
      default:
        return "All";
    }
  };

  const normalizedStatusFilter = normalizeStatusFilter(statusFilter);

  const filteredRefunds = refunds.filter((refund) => {
    const refundId = refund.refund_request_id.toString();
    const customerName = refund.customer_name?.toLowerCase() || "";
    const searchLower = search.toLowerCase();

    // Match refund status
    const matchesStatus =
      normalizedStatusFilter === "All" ||
      refund.refund_status_name === normalizedStatusFilter;

    // Match search term
    const matchesSearch =
      refundId.includes(searchLower) || customerName.includes(searchLower);

    // Filter by date range
    let withinDateRange = true;
    if (startDate || endDate) {
      const requestedAtStr = refund.requested_at;
      if (!requestedAtStr) {
        withinDateRange = false; // Exclude if no date
      } else {
        const requestedAt = new Date(requestedAtStr);
        const requestedAtTime = requestedAt.getTime();

        const startDateTime = startDate
          ? new Date(startDate).setHours(0, 0, 0, 0)
          : null;
        const endDateTime = endDate
          ? new Date(endDate).setHours(23, 59, 59, 999)
          : null;

        if (startDateTime && requestedAtTime < startDateTime) {
          withinDateRange = false;
        }
        if (endDateTime && requestedAtTime > endDateTime) {
          withinDateRange = false;
        }
      }
    }

    return matchesStatus && matchesSearch && withinDateRange;
  });

  const totalPages = Math.ceil(filteredRefunds.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredRefunds.slice(indexOfFirstRow, indexOfLastRow);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Define columns for refunds table
  const columns = [
    { key: "order_id", header: "Order ID" },
    { key: "customer_name", header: "Customer Name" },
    {
      key: "total_refund_amount",
      header: "Total Refund Amount",
      align: "right",
      render: (amount) =>
        `₱${Number(amount).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    },
    {
      key: "refund_status_name",
      header: "Refund Status",
      render: (status) => <StatusBadge status={status} />,
    },
    { key: "requested_at", header: "Requested At" },
    { key: "action", header: "Action" },
  ];

  const openModal = (refund) => {
    setSelectedRefund(refund);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRefund(null);
    setIsModalOpen(false);
  };

  const handleRefundStatusChange = async (refundRequestId, newStatusId) => {
    try {
      const refund = refunds.find(
        (r) => r.refund_request_id === refundRequestId,
      );

      if (!refund) {
        toast.error("Refund request not found.");
        return;
      }

      if (!refund.customer_email || !refund.customer_name) {
        toast.error("Customer email or name is missing. Cannot send email.");
        return;
      }

      let subject, textContent, htmlContent;

      if (newStatusId === 2) {
        // Refund marked as complete
        subject = `Refund Processed for Request #${refundRequestId}`;
        textContent = `Hi ${refund.customer_name},\n\nYour refund request #${refundRequestId} has been successfully processed. The refund amount has been credited back to your payment method. Thank you.`;
        htmlContent = `
          <h1>Refund Processed</h1>
          <p>Hi ${refund.customer_name},</p>
          <p>Your refund request <strong>#${refundRequestId}</strong> has been successfully processed.</p>
          <p>The refund amount has been credited back to your payment method.</p>
          <p>Thank you for shopping with us.</p>
        `;
      } else if (newStatusId === 3) {
        // Refund cancelled
        subject = `Refund Request #${refundRequestId} Has Been Cancelled`;
        textContent = `Hi ${refund.customer_name},\n\nWe regret to inform you that your refund request #${refundRequestId} has been cancelled. Please contact us for further details.`;
        htmlContent = `
          <h1>Refund Request Cancelled</h1>
          <p>Hi ${refund.customer_name},</p>
          <p>Your refund request <strong>#${refundRequestId}</strong> has been cancelled.</p>
          <p>Please contact us for further details.</p>
          <p>Thank you for your understanding.</p>
        `;
      } else {
        toast.error("Invalid status change.");
        return;
      }

      // Send email notification
      try {
        await SendEmail(
          refund.customer_email,
          "Alofa Haircare <mailgun@sandbox1463264fb2744256b74af8ebe920ea0c.mailgun.org>", // Replace with your sender email
          subject,
          textContent,
          htmlContent,
        );

        toast.success(`Email sent to ${refund.customer_email}.`);
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        toast.error("Failed to send email. Refund status will not be updated.");
        return; // Exit if email fails
      }

      // Update refund status if email is successful
      const response = await updateRefundStatus(refundRequestId, newStatusId);

      if (response.success) {
        const statusMessage =
          newStatusId === 2
            ? "Refund marked as Complete!"
            : "Refund Cancelled!";
        toast.success(statusMessage);
        closeModal();
        fetchRefunds(); // Refresh refund list
      } else {
        toast.error("Failed to update refund status");
      }
    } catch (error) {
      console.error("Error updating refund status:", error);
      toast.error("An error occurred while updating refund status");
    }
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
            placeholder="Search by Refund ID or Customer Name..."
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
        {filteredRefunds.length === 0 ? (
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
            {/* Refunds Table */}
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
                {currentData.map((refund) => (
                  <tr key={refund.refund_request_id}>
                    {columns.slice(0, -1).map((column) => (
                      <td
                        key={column.key}
                        className={`px-5 py-2 border-b ${
                          column.align === "right" ? "text-right" : ""
                        }`}
                      >
                        {column.render
                          ? column.render(refund[column.key])
                          : refund[column.key]}
                      </td>
                    ))}
                    <td className="text-left border-b">
                      <button
                        onClick={() => openModal(refund)}
                        className="px-3 py-1 bg-alofa-pink text-white rounded hover:bg-alofa-dark w-fit"
                      >
                        View Details
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
        {/* Refund Details Modal */}
        {isModalOpen && selectedRefund && (
          <Modal isVisible={isModalOpen} onClose={closeModal} size="large">
            <div className="p-6 max-h-[80vh] overflow-y-auto flex flex-col bg-white rounded-lg">
              <h2 className="text-4xl font-bold mb-6 text-alofa-pink">
                Refund Details
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
                          {selectedRefund.customer_name}
                        </dd>
                      </div>
                      <div className="py-3">
                        <dt className="text-sm font-medium text-gray-500">
                          Total Refund Amount
                        </dt>
                        <dd className="mt-1 text-base text-gray-900">
                          ₱
                          {Number(
                            selectedRefund.total_refund_amount,
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </dd>
                      </div>
                      <div className="py-3">
                        <dt className="text-sm font-medium text-gray-500">
                          Refund Status
                        </dt>
                        <dd className="mt-1 text-base text-gray-900">
                          {selectedRefund.refund_status_name}
                        </dd>
                      </div>
                      <div className="py-3">
                        <dt className="text-sm font-medium text-gray-500">
                          Requested At
                        </dt>
                        <dd className="mt-1 text-base text-gray-900">
                          {selectedRefund.requested_at}
                        </dd>
                      </div>
                      <div className="py-3">
                        <dt className="text-sm font-medium text-gray-500">
                          Reason
                        </dt>
                        <dd className="mt-1 text-base text-gray-900">
                          {selectedRefund.reason}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                <div>
                  {selectedRefund.proofs && selectedRefund.proofs.length > 0 ? (
                    <div>
                      <strong className="text-sm font-bold text-gray-500">
                        Proofs:
                      </strong>
                      <div className="flex flex-wrap mt-2 gap-2">
                        {selectedRefund.proofs.map((proof, index) => (
                          <img
                            key={index}
                            src={`http://localhost:3001/${proof.substring(1)}`}
                            alt={`Proof ${index + 1}`}
                            className="w-40 h-40 object-cover border rounded-lg shadow-md cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:border-alofa-pink"
                            onClick={() =>
                              handleImageClick(
                                `http://localhost:3001/${proof.substring(1)}`,
                              )
                            }
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 text-red-500 font-semibold">
                      No proof images available.
                    </div>
                  )}

                  {isFullScreen && fullScreenImage && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
                      onClick={closeFullScreen}
                    >
                      <img
                        src={fullScreenImage}
                        alt="Full-Sized Proof"
                        className="max-w-full max-h-full rounded-lg shadow-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Refund Items Table */}
              <div className="mt-6">
                <h3 className="text-2xl font-semibold mb-4">Refund Items</h3>
                <div className="max-h-40 overflow-y-auto">
                  <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                      <tr>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold">
                          Product Name
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold">
                          Variation
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold">
                          Quantity
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-sm font-semibold">
                          Item Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRefund.refund_items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-5 py-2 border-b">
                            {item.product_name}
                          </td>
                          <td className="px-5 py-2 border-b">{item.value}</td>
                          <td className="px-5 py-2 border-b">
                            {item.quantity}
                          </td>
                          <td className="px-5 py-2 border-b text-right">
                            ₱
                            {Number(item.item_subtotal).toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-4">
                {selectedRefund.refund_status_id === 2 ? (
                  // If refund is Complete, show only Cancel Refund button
                  <button
                    onClick={() =>
                      openConfirmModal(
                        () =>
                          handleRefundStatusChange(
                            selectedRefund.refund_request_id,
                            3,
                          ),
                        "Are you sure you want to cancel this refund?",
                      )
                    }
                    className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel Refund
                  </button>
                ) : selectedRefund.refund_status_id === 3 ? (
                  // If refund is Cancelled, show only Mark as Complete button
                  <button
                    onClick={() =>
                      openConfirmModal(
                        () =>
                          handleRefundStatusChange(
                            selectedRefund.refund_request_id,
                            2,
                          ),
                        "Are you sure you want to mark this refund as complete?",
                      )
                    }
                    className="px-6 py-2 bg-alofa-pink text-white font-semibold rounded-lg hover:bg-alofa-dark transition"
                  >
                    Mark as Complete
                  </button>
                ) : (
                  // Default case, show both Mark as Complete and Cancel Refund buttons
                  <>
                    <button
                      onClick={() =>
                        openConfirmModal(
                          () =>
                            handleRefundStatusChange(
                              selectedRefund.refund_request_id,
                              2,
                            ),
                          "Are you sure you want to mark this refund as complete?",
                        )
                      }
                      className="px-6 py-2 bg-alofa-pink text-white font-semibold rounded-lg hover:bg-alofa-dark transition"
                    >
                      Mark as Complete
                    </button>
                    <button
                      onClick={() =>
                        openConfirmModal(
                          () =>
                            handleRefundStatusChange(
                              selectedRefund.refund_request_id,
                              3,
                            ),
                          "Are you sure you want to cancel this refund?",
                        )
                      }
                      className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel Refund
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
              message={confirmMessage} // Use the dynamic message here
            />
          </Modal>
        )}
      </div>
    </Fragment>
  );
};

export default RefundTab;
