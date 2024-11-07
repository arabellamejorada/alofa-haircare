import React, { useState, useEffect, Fragment } from "react";
import { getInventory, getAllInventoryHistory } from "../../api/inventory";
import { ClipLoader } from "react-spinners";
import {
  IoMdArrowDropdownCircle,
  IoMdArrowDroprightCircle,
} from "react-icons/io";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [inventoryHistory, setInventoryHistory] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedProduct] = useState("");
  const [selectedStatus] = useState("");
  const [showArchived] = useState(false);

  // Sorting states
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [inventoryData, inventoryHistoryResponse] = await Promise.all([
          getInventory(),
          getAllInventoryHistory(),
        ]);

        setInventory(inventoryData);
        if (
          inventoryHistoryResponse &&
          Array.isArray(inventoryHistoryResponse.data)
        ) {
          setInventoryHistory(inventoryHistoryResponse.data);
        } else {
          console.error("No data in inventory history.");
        }
      } catch (err) {
        setError("Failed to fetch data");
        console.error("Error fetching inventory history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Toggle row expansion to ensure only one row is expanded at a time
  const toggleRow = (variationId) => {
    if (expandedRows.includes(variationId)) {
      setExpandedRows([]); // Close the currently expanded row
    } else {
      setExpandedRows([variationId]); // Expand the new row and close others
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
    setInventory((prevData) =>
      [...prevData].sort((a, b) => {
        if (a[field] < b[field]) return newSortOrder === "asc" ? -1 : 1;
        if (a[field] > b[field]) return newSortOrder === "asc" ? 1 : -1;
        return 0;
      }),
    );
  };

  // Calculate filtered and paginated data
  const filteredInventory = inventory.filter((item) => {
    const productName = item.product_name?.toLowerCase() || "";
    const variation = `${item.type || ""} - ${item.value || ""}`.toLowerCase();
    const sku = item.sku?.toLowerCase() || "";

    const matchesSearch =
      productName.includes(search.toLowerCase()) ||
      variation.includes(search.toLowerCase()) ||
      sku.includes(search.toLowerCase());

    const matchesProductFilter =
      selectedProduct === "" || productName === selectedProduct.toLowerCase();

    const matchesStatusFilter =
      selectedStatus === "" || item.product_status === selectedStatus;

    return (
      matchesSearch &&
      matchesProductFilter &&
      matchesStatusFilter &&
      (showArchived || item.product_status?.toLowerCase() !== "archived")
    );
  });

  const totalPages = Math.ceil(filteredInventory.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredInventory.slice(indexOfFirstRow, indexOfLastRow);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Define columns for inventory table
  const columns = [
    { key: "inventory_id", header: "ID" },
    { key: "sku", header: "SKU" },
    { key: "product_name", header: "Product Name" },
    { key: "variation", header: "Variation" },
    { key: "stock_quantity", header: "Stock Quantity", align: "right" },
    { key: "product_status", header: "Status" },
    { key: "last_updated_date", header: "Last Update" },
    { key: "action", header: "Action" },
  ];

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Fragment>
      <div className="relative">
        {loading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
            <ClipLoader size={50} color="#E53E3E" loading={loading} />
          </div>
        )}

        <div className="container mx-auto p-4">
          <strong className="text-3xl font-bold text-gray-500">
            Inventory
          </strong>

          {/* Filters Section */}
          <div className="flex flex-row flex-wrap items-center gap-4 mt-4">
            <input
              type="text"
              className="w-full max-w-md h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
              placeholder="Search by SKU, Product, or Variation..."
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

          {/* Inventory Table */}
          <table className="min-w-full bg-white mt-4 shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-5 py-3 border-b-2 border-gray-200 bg-alofa-pink text-white text-left text-sm font-semibold ${column.align === "right" ? "text-right" : ""}`}
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
              {currentData.map((item) => (
                <Fragment key={item.inventory_id}>
                  <tr>
                    {columns.slice(0, -1).map((column) => (
                      <td
                        key={column.key}
                        className={`px-5 py-2 border-b ${column.align === "right" ? "text-right" : ""}`}
                      >
                        {item[column.key]}
                      </td>
                    ))}
                    <td className="text-center border-b">
                      <button
                        onClick={() => toggleRow(item.variation_id)}
                        className="focus:outline-none"
                      >
                        {expandedRows.includes(item.variation_id) ? (
                          <IoMdArrowDropdownCircle
                            fontSize={24}
                            className="text-alofa-pink hover:text-alofa-dark"
                          />
                        ) : (
                          <IoMdArrowDroprightCircle
                            fontSize={24}
                            className="text-alofa-pink hover:text-alofa-dark"
                          />
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Content */}
                  {expandedRows.includes(item.variation_id) && (
                    <tr>
                      <td colSpan={columns.length} className="bg-gray-100">
                        <div className="p-4">
                          <strong>
                            Inventory History for {item.variation}
                          </strong>
                          <table className="min-w-full mt-2 bg-white border">
                            <thead>
                              <tr>
                                <th className="px-3 py-2 border-b">Index</th>
                                <th className="px-3 py-2 border-b">Ref #</th>
                                <th className="px-3 py-2 border-b text-right">
                                  Quantity
                                </th>
                                <th className="px-3 py-2 border-b">Reason</th>
                                <th className="px-3 py-2 border-b">
                                  Authorized By
                                </th>
                                <th className="px-3 py-2 border-b">Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {inventoryHistory
                                .filter(
                                  (history) =>
                                    Number(history.variation_id) ===
                                    Number(item.variation_id),
                                )
                                .map((history, index) => (
                                  <tr key={index}>
                                    <td className="px-3 py-2 border-b">
                                      {index + 1}
                                    </td>
                                    <td className="px-3 py-2 border-b">
                                      {history.reference_number}
                                    </td>
                                    <td className="px-3 py-2 border-b text-right">
                                      {history.quantity}
                                    </td>
                                    <td className="px-3 py-2 border-b">
                                      {history.reason || "-"}
                                    </td>
                                    <td className="px-3 py-2 border-b">
                                      {history.employee_name || "-"}
                                    </td>
                                    <td className="px-3 py-2 border-b">
                                      {new Date(history.date).toLocaleString()}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
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
        </div>
      </div>
    </Fragment>
  );
};

export default Inventory;
