import React, { useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

import {
  IoMdArrowDropdownCircle,
  IoMdArrowDroprightCircle,
} from "react-icons/io";

const formatColumnName = (columnName) => {
  return columnName
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const StockHistoryTable = ({
  data,
  columns,
  onExpand,
  expandedRows,
  handleSort,
  sortField,
  sortOrder,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  if (!data || data.length === 0) {
    return <div>No data available</div>;
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
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gradient-to-b from-pink-400 to-pink-500 text-gray-100 text-left text-md font-semibold uppercase tracking-wider"
                >
                  {column.header || formatColumnName(column.key)}
                  {sortField === column.key &&
                    (sortOrder === "asc" ? (
                      <FaArrowUp className="inline ml-2" />
                    ) : (
                      <FaArrowDown className="inline ml-2" />
                    ))}
                </th>
              ))}
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gradient-to-b from-pink-400 to-pink-500 text-gray-100 text-center text-md font-semibold uppercase">
                View Details
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((group, index) => (
              <React.Fragment key={index}>
                <tr
                  className={
                    expandedRows.includes(group.reference_number)
                      ? "bg-gray-100"
                      : ""
                  }
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-5 py-5 border-b border-gray-200 text-sm"
                    >
                      {group[column.key]}
                    </td>
                  ))}
                  <td className="text-center h-12">
                    <button
                      onClick={() => onExpand(group.reference_number)}
                      className="focus:outline-none"
                    >
                      {expandedRows.includes(group.reference_number) ? (
                        <IoMdArrowDropdownCircle
                          fontSize={24}
                          className="text-pink-500 hover:text-pink-600"
                        />
                      ) : (
                        <IoMdArrowDroprightCircle
                          fontSize={24}
                          className="text-pink-500 hover:text-pink-600"
                        />
                      )}
                    </button>
                  </td>
                </tr>

                {/* Compact Expanded Content */}
                {expandedRows.includes(group.reference_number) && (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="bg-gray-100 px-5 py-5"
                    >
                      <div className="max-h-60 overflow-y-auto">
                        <table className="min-w-full leading-normal">
                          <thead>
                            <tr>
                              <th className="px-3 py-2  bg-gray-50 text-gray-700 text-left text-sm font-semibold">
                                SKU
                              </th>
                              <th className="px-3 py-2  bg-gray-50 text-gray-700 text-left text-sm font-semibold">
                                Product Name
                              </th>
                              <th className="px-3 py-2  bg-gray-50 text-gray-700 text-left text-sm font-semibold">
                                Variation
                              </th>
                              <th className="px-3 py-2  bg-gray-50 text-gray-700 text-right text-sm font-semibold">
                                Value
                              </th>
                              <th className="px-3 py-2  bg-gray-50 text-gray-700 text-right text-sm font-semibold">
                                Quantity
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.products.map((product, idx) => (
                              <tr key={idx}>
                                <td className="px-3 bg-white py-2  text-sm">
                                  {product.sku}
                                </td>
                                <td className="px-3 bg-white py-2  text-sm">
                                  {product.name}
                                </td>
                                <td className="px-3 bg-white py-2  text-sm">
                                  {product.type}
                                </td>
                                <td className="px-3 bg-white py-2  text-sm text-right">
                                  {product.value}
                                </td>
                                <td className="px-3 bg-white py-2  text-sm text-right">
                                  {product.quantity}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
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

export default StockHistoryTable;
