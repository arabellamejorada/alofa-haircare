import React, { useState } from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";
import PaymentStatusBadge from "../shared/PaymentStatusBadge"; // Ensure this component is imported

const formatColumnName = (columnName) => {
  if (columnName.toLowerCase() === "id") return columnName.toUpperCase();
  return columnName
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const OrderVerificationTable = ({ data, columns, onVerify }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-600">
            No data available
          </p>
          <p className="text-sm text-gray-500 mt-2">
            There are currently no orders to display.
          </p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = data.slice(indexOfFirstRow, indexOfLastRow);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="overflow-x-auto pt-4">
      <div className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  className={`px-5 py-3 border-b-2 border-gray-200 bg-alofa-pink text-gray-100 text-md font-semibold uppercase tracking-wider ${
                    column.isNumeric ? "text-right" : "text-left"
                  }`}
                  key={column.key}
                >
                  {column.header || formatColumnName(column.key)}
                </th>
              ))}
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-alofa-pink text-gray-100 text-center text-md font-semibold uppercase w-[8%]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((item, index) => (
              <tr
                key={index}
                className={
                  item.order_status === "Verified" ? "bg-gray-200" : ""
                }
              >
                {columns.map((column) => (
                  <td
                    className={`px-5 py-3 border-b border-gray-200 text-sm min-h-[3rem] ${
                      column.isNumeric ? "text-right" : "text-left"
                    }`}
                    key={column.key}
                  >
                    {column.key === "payment_status_name" ? (
                      <PaymentStatusBadge status={item[column.key]} />
                    ) : column.key === "total_amount" ? (
                      `₱${Number(item[column.key]).toLocaleString()}`
                    ) : column.render ? (
                      column.render(item[column.key])
                    ) : (
                      item[column.key]
                    )}
                  </td>
                ))}

                <td className="text-center px-2 py-3 h-12 w-[8%]">
                  <div className="flex justify-center items-center gap-2 h-full">
                    <div
                      className="text-alofa-pink hover:text-alofa-dark"
                      onClick={() => onVerify(item)}
                      role="button"
                      tabIndex={0}
                      aria-label="Verify Order"
                    >
                      <IoMdCheckmarkCircle fontSize={24} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination controls */}
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
    </div>
  );
};

export default OrderVerificationTable;
