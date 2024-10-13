import React, { useState } from "react";
import { IoMdArchive } from "react-icons/io";
import { MdEditDocument } from "react-icons/md";

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
  isInventory,
  isProductCategory,
}) => {
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
            There are currently no records to display.
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
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gradient-to-b from-pink-400 to-pink-500 text-gray-100 text-left text-md font-semibold uppercase tracking-wider"
                  key={column.key}
                >
                  {column.header || formatColumnName(column.key)}
                </th>
              ))}
              {!isInventory && (
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gradient-to-b from-pink-400 to-pink-500 text-gray-100 text-center text-md font-semibold uppercase w-[8%]">
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
                    className="px-5 py-3 border-b border-gray-200 text-sm text-left min-h-[3rem]"
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
                      <div
                        className="text-pink-500 hover:text-pink-600"
                        onClick={() => onEdit(item)}
                        role="button"
                        tabIndex={0}
                        aria-label="Edit"
                      >
                        <MdEditDocument fontSize={24} />
                      </div>
                      {!isProductCategory && (
                        <div
                          className="text-pink-500 hover:text-pink-600"
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
    </div>
  );
};

export default DataTable;
