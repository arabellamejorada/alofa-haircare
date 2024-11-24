import React, { useState, useEffect, Fragment } from "react";
import { getAllOrdersWithItems, getAllOrderStatuses } from "../../api/orders";
import { ClipLoader } from "react-spinners";
import { FaArrowUp, FaArrowDown, FaEye } from "react-icons/fa";
import Modal from "../../components/modal/Modal";
import PaymentStatusBadge from "../../components/shared/StatusBadge";
import RefreshIcon from "../../components/shared/RefreshButton";
import SalesReport from "./SalesReport";
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Filter states
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDateCleared, setIsDateCleared] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(""); // New filter state for status

  // Sorting states
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrdersWithItems();
      if (response && response.orders) {
        const sortedOrders = response.orders.sort((a, b) => {
          const dateA = new Date(a.date_ordered);
          const dateB = new Date(b.date_ordered);
          return dateB - dateA; // Most recent first
        });

        setOrders(sortedOrders);

        // Set default start and end dates
        if (sortedOrders.length > 0) {
          const earliestDate =
            sortedOrders[sortedOrders.length - 1]?.date_ordered; // Earliest order
          const latestDate = sortedOrders[0]?.date_ordered; // Latest order

          // Ensure that startDate is always earlier than endDate
          setStartDate(earliestDate);
          setEndDate(latestDate);
        }
      } else {
        console.error("No orders data found.");
      }

      const orderStatusesResponse = await getAllOrderStatuses();
      setOrderStatuses(orderStatusesResponse || []);
    } catch (err) {
      setError("Failed to fetch orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [isDateCleared]);

  // Handle sorting
  const handleSort = (field) => {
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);

    const sortedData = [...orders].sort((a, b) => {
      if (field === "date_ordered") {
        // Handle date sorting
        const dateA = new Date(a[field]);
        const dateB = new Date(b[field]);

        if (dateA < dateB) return newSortOrder === "asc" ? -1 : 1;
        if (dateA > dateB) return newSortOrder === "asc" ? 1 : -1;
        return 0;
      } else {
        // Handle non-date fields
        const aField = isNaN(a[field]) ? a[field] : parseFloat(a[field]);
        const bField = isNaN(b[field]) ? b[field] : parseFloat(b[field]);

        if (aField < bField) return newSortOrder === "asc" ? -1 : 1;
        if (aField > bField) return newSortOrder === "asc" ? 1 : -1;
        return 0;
      }
    });

    setOrders(sortedData);
  };

  const handleRefresh = async () => {
    setLoading(true);
    await fetchOrders();
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    // Ensure Start Date is less than or equal to End Date
    if (endDate && new Date(newStartDate) > new Date(endDate)) {
      setEndDate(newStartDate);
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);

    // Ensure End Date is greater than or equal to Start Date
    if (startDate && new Date(newEndDate) < new Date(startDate)) {
      setStartDate(newEndDate);
    }
  };

  const clearDates = () => {
    setStartDate(""); // Clear Start Date
    setEndDate(""); // Clear End Date
    setIsDateCleared((prevState) => !prevState); // Toggle isDateCleared to refetch the orders with new filters
  };

  // Calculate filtered and paginated data
  const filteredOrders = orders.filter((order) => {
    const orderId = order.order_id.toString();
    const customerName = order.customer_name?.toLowerCase() || "";
    const searchLower = search.toLowerCase();

    // Filter by search terms
    const matchesSearch =
      orderId.includes(searchLower) || customerName.includes(searchLower);

    // Filter by status
    const matchesStatus =
      selectedStatus === "" || order.order_status_name === selectedStatus;

    // Filter by date
    let withinDateRange = true;

    if (startDate || endDate) {
      const orderDateStr = order.date_ordered;
      if (!orderDateStr) {
        withinDateRange = false;
      } else {
        const orderDate = new Date(orderDateStr);
        const orderDateTime = orderDate.getTime();

        const startDateTime = startDate
          ? new Date(startDate).setHours(0, 0, 0, 0)
          : null;
        const endDateTime = endDate
          ? new Date(endDate).setHours(23, 59, 59, 999)
          : null;

        // Check only startDate if endDate is not selected
        if (startDateTime && orderDateTime < startDateTime) {
          withinDateRange = false;
        }

        // Check only endDate if startDate is not selected
        if (endDateTime && orderDateTime > endDateTime) {
          withinDateRange = false;
        }
      }
    }

    return matchesSearch && matchesStatus && withinDateRange;
  });

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredOrders.slice(indexOfFirstRow, indexOfLastRow);
  const [showFullRemarks, setShowFullRemarks] = useState(false);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Define columns for orders table
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
      key: "order_status_name",
      header: "Order Status",
      align: "center",
      render: (status) => <PaymentStatusBadge status={status} />,
    },
    { key: "date_ordered", header: "Date Ordered" },
    { key: "view", header: "View" },
  ];

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
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
      <div className="flex flex-col gap-2">
        <strong className="text-3xl font-bold text-gray-500">All Orders</strong>
        <div className="relative mt-2">
          {/* Filters Section */}
          <div className="flex justify-between">
            <div className="flex flex-row flex-wrap items-center gap-4">
              <input
                type="text"
                className="w-[20rem] max-w-md h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
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
              {/* Dropdown for order status filter */}
              <select
                className="h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                {orderStatuses.map((status) => (
                  <option key={status.status_id} value={status.status_name}>
                    {status.status_name}
                  </option>
                ))}
              </select>
              {/* Date Filters */}
              <div className="flex items-center">
                <label className="mr-2 text-sm font-medium text-gray-700">
                  Start Date:
                </label>
                <input
                  type="date"
                  className="h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
                  value={startDate}
                  onChange={handleStartDateChange}
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
                  onChange={handleEndDateChange}
                />
              </div>
              {(startDate || endDate) && (
                <button
                  onClick={clearDates}
                  className="text-sm ml-2 text-alofa-pink hover:text-alofa-dark"
                >
                  Reset Dates
                </button>
              )}
            </div>
            <RefreshIcon
              onClick={handleRefresh}
              size={22}
              colorClass="text-gray-500 hover:text-gray-700"
            />
          </div>
          {/* Sales Report */}
          <SalesReport
            orders={filteredOrders}
            startDate={startDate}
            endDate={endDate}
          />
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
                          className="px-3 py-1 text-gray-500 hover:text-alofa-pink"
                        >
                          <FaEye size={20} className="mx-2" />
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
            <Modal isVisible={isModalOpen} onClose={closeModal} size="xlarge">
              <div className="p-6 max-h-[80vh] overflow-y-auto flex flex-col bg-white rounded-lg">
                <h2 className="text-4xl font-bold mb-6 text-alofa-pink">
                  Order Details
                </h2>
                <div className="flex flex-row gap-4">
                  {/* Left Section */}
                  <div className="flex-1">
                    <div className="bg-gray-50 p-4 rounded-lg h-full">
                      <dl className="divide-y divide-gray-200">
                        {/* Customer Name */}
                        <div className="py-3">
                          <dt className="text-sm font-medium text-gray-500">
                            Customer Name
                          </dt>
                          <dd className="mt-1 text-base text-gray-900">
                            {selectedOrder.customer_name}
                          </dd>
                        </div>

                        {/* Date Ordered */}
                        <div className="py-3">
                          <dt className="text-sm font-medium text-gray-500">
                            Date Ordered
                          </dt>
                          <dd className="mt-1 text-base text-gray-900">
                            {(() => {
                              const dateValue = selectedOrder.date_ordered;
                              if (!dateValue) return "Date not available";
                              const date = new Date(dateValue);
                              return !isNaN(date.getTime())
                                ? date.toLocaleString()
                                : "Date not available";
                            })()}
                          </dd>
                        </div>

                        {/* Payment Status */}
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

                        {/* Order Status */}
                        <div className="py-3">
                          <dt className="text-sm font-medium text-gray-500">
                            Order Status
                          </dt>
                          <dd className="mt-1 text-base text-gray-900">
                            <PaymentStatusBadge
                              status={selectedOrder.order_status_name}
                            />
                          </dd>
                        </div>

                        {/* Total Amount */}
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

                        {/* Shipping Fee */}
                        <div className="py-3">
                          <dt className="text-sm font-medium text-gray-500">
                            Shipping Fee
                          </dt>
                          <dd className="mt-1 text-base text-gray-900">
                            ₱
                            {Number(selectedOrder.shipping_fee).toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )}
                          </dd>
                        </div>
                        {/* Shipping Address */}
                        <div className="py-3">
                          <dt className="text-sm font-medium text-gray-500">
                            Shipping Details
                          </dt>
                          <dd className="mt-1 text-base text-gray-900">
                            <p>
                              <strong className="text-gray-600 text-sm font-semibold">
                                Contact #:
                              </strong>{" "}
                              {selectedOrder.shipping_address.phone_number}
                            </p>
                            <p>
                              <strong className="text-gray-600 text-sm font-semibold">
                                Address:
                              </strong>{" "}
                              {selectedOrder.shipping_address.address_line}
                              {selectedOrder.shipping_address.barangay
                                ? `, ${selectedOrder.shipping_address.barangay}`
                                : ""}
                              {selectedOrder.shipping_address.city
                                ? `, ${selectedOrder.shipping_address.city}`
                                : ""}
                              {selectedOrder.shipping_address.province
                                ? `, ${selectedOrder.shipping_address.province}`
                                : ""}
                              {selectedOrder.shipping_address.region
                                ? `, ${selectedOrder.shipping_address.region}`
                                : ""}
                              {selectedOrder.shipping_address.zip_code
                                ? `, ${selectedOrder.shipping_address.zip_code}`
                                : ""}
                            </p>
                          </dd>
                        </div>

                        {/* Voucher Details */}
                        {selectedOrder.voucher && (
                          <div className="py-3">
                            <dt className="text-sm font-medium text-gray-500">
                              Voucher Used
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              Code: <span>{selectedOrder.voucher.code}</span>
                            </dd>
                            <dd className="mt-1 text-sm text-gray-900 ">
                              Discount: ₱
                              <span className="font-semibold">
                                {Number(
                                  selectedOrder.voucher.total_discount,
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </dd>
                          </div>
                        )}

                        {/* Remarks Section */}
                        <div className="py-3">
                          <dt className="text-sm font-medium text-gray-500">
                            Remarks
                          </dt>
                          <dd className="mt-1 text-base text-gray-900">
                            {selectedOrder.remarks?.length > 100 ? (
                              <div>
                                {showFullRemarks ? (
                                  <>
                                    {selectedOrder.remarks}
                                    <button
                                      onClick={() => setShowFullRemarks(false)}
                                      className="ml-2 text-sm text-blue-500 hover:underline"
                                    >
                                      Show Less
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    {selectedOrder.remarks.slice(0, 100)}...
                                    <button
                                      onClick={() => setShowFullRemarks(true)}
                                      className="ml-2 text-sm text-blue-500 hover:underline"
                                    >
                                      Show More
                                    </button>
                                  </>
                                )}
                              </div>
                            ) : (
                              selectedOrder.remarks || "No remarks available."
                            )}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  {/* Right Section - Items */}
                  <div className="w-1/2">
                    <div className="bg-gray-50 p-4 rounded-lg h-full">
                      <h3 className="text-lg font-bold text-gray-700 mb-3">
                        Items
                      </h3>
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        <div className="max-h-[30rem] overflow-y-auto border rounded-md bg-gray-50 shadow-sm">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr>
                                <th className="px-4 py-2 text-left text-gray-600">
                                  Product
                                </th>
                                <th className="px-4 py-2 text-center text-gray-600">
                                  Variation
                                </th>
                                <th className="px-4 py-2 text-center text-gray-600">
                                  Qty
                                </th>
                                <th className="px-4 py-2 text-right text-gray-600">
                                  Price
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedOrder.items.map((item, index) => (
                                <tr key={index} className="border-b">
                                  <td className="px-4 py-2 text-gray-800">
                                    {item.product_name}
                                  </td>
                                  <td className="px-4 py-2 text-center text-gray-800">
                                    {item.variation_type}:{" "}
                                    {item.variation_value || "-"}
                                  </td>
                                  <td className="px-4 py-2 text-center text-gray-800">
                                    {item.quantity}
                                  </td>
                                  <td className="px-4 py-2 text-right text-gray-800">
                                    ₱
                                    {Number(item.price).toLocaleString(
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
                      ) : (
                        <div className="text-sm text-gray-500">
                          No items in this order.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Orders;
