import React, { useState } from "react";
import { IoMdArchive } from "react-icons/io";
import { MdEditDocument, MdDelete } from "react-icons/md";
import { ClipLoader } from "react-spinners";

const formatColumnName = (columnName) => {
  if (columnName.toLowerCase() === "id") {
    return columnName.toUpperCase();
  }
  return columnName
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const DataTable = ({
  data,
  columns,
  onEdit,
  onArchive,
  onDelete,
  isInventory,
  isProductCategory,
  isEmployee,
  loading, // New prop to indicate loading state
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil((data || []).length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = (data || []).slice(indexOfFirstRow, indexOfLastRow);

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

  // Render loading spinner if loading is true
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <ClipLoader size={50} color="#E53E3E" loading={true} />
      </div>
    );
  }

  // Render "No Data Available" if no data and not loading
  if (!data || data.length === 0) {
    return (
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
    );
  }

  // Render the table and data
  return (
    <div className="overflow-x-auto pt-4 relative">
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
              {!isInventory && (
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-alofa-pink text-gray-100 text-center text-md font-semibold uppercase w-[8%]">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {currentData.map((item, index) => (
              <tr
                key={index}
                className={
                  item.status === "Archived" ||
                  item.status_description === "Archived" ||
                  item.product_status === "Archived"
                    ? "bg-gray-200"
                    : ""
                }
              >
                {columns.map((column) => (
                  <td
                    className={`px-5 py-3 border-b border-gray-200 text-sm min-h-[3rem] ${
                      column.isNumeric ? "text-right" : "text-left"
                    }`}
                    key={column.key}
                  >
                    {column.render
                      ? column.render(item[column.key])
                      : item[column.key]}
                  </td>
                ))}

                {!isInventory && (
                  <td className="text-center px-2 py-3 h-12 w-[8%]">
                    <div className="flex justify-center items-center gap-2 h-full">
                      {/* Edit Button */}
                      <div
                        className="text-alofa-pink hover:text-alofa-dark"
                        onClick={() => onEdit(item)}
                        role="button"
                        tabIndex={0}
                        aria-label="Edit"
                      >
                        <MdEditDocument fontSize={24} />
                      </div>

                      {/* Show Delete or Archive button based on role and isProductCategory */}
                      {isProductCategory &&
                        !isEmployee && ( // Hide Delete button for employees
                          <div
                            className="text-alofa-pink hover:text-alofa-dark"
                            onClick={() => onDelete(item)} // Trigger delete action
                            role="button"
                            tabIndex={0}
                            aria-label="Delete"
                          >
                            <MdDelete fontSize={24} />
                          </div>
                        )}
                      {!isProductCategory &&
                        !isEmployee && ( // Hide Archive button for employees
                          <div
                            className="text-alofa-pink hover:text-alofa-dark"
                            onClick={() => onArchive(item)}
                            role="button"
                            tabIndex={0}
                            aria-label="Archive"
                          >
                            <IoMdArchive fontSize={24} />
                          </div>
                        )}
                    </div>
                  </td>
                )}
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

export default DataTable;
