import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../shared/DataTable";
import { IoIosArrowBack } from "react-icons/io";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { getAllStockIn } from "../../../api/stockIn";

const StockInHistory = () => {
  const navigate = useNavigate();
  const [stockInData, setStockInData] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for sorting
  const [sortField, setSortField] = useState("reference_number");
  const [sortOrder, setSortOrder] = useState("asc");

  // State for filtering
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(""); // New state for supplier filter
  const [supplierList, setSupplierList] = useState([]); // State to hold list of suppliers

  useEffect(() => {
    const fetchStockInData = async () => {
      try {
        const response = await getAllStockIn();
        console.log("API response:", response.data);
        const dataWithIndex = response.data.map((item, index) => ({
          ...item,
          index: index + 1,
          stock_in_date: item.stock_in_date.split("T")[0], // Ensure date format is YYYY-MM-DD
        }));
        setStockInData(dataWithIndex);

        // Extract unique suppliers
        const suppliers = [
          ...new Set(dataWithIndex.map((item) => item.supplier_name)),
        ];
        setSupplierList(suppliers);
      } catch (error) {
        console.error("Error fetching stock-in data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockInData();
  }, []);

  const columns = [
    { key: "index", header: "#" },
    { key: "reference_number", header: "Ref #" },
    { key: "sku", header: "SKU" },
    { key: "name", header: "Product Name" },
    { key: "type", header: "Variation" },
    { key: "value", header: "Value" },
    { key: "quantity", header: "Qty" },
    { key: "supplier_name", header: "Supplier" },
    { key: "stock_in_date", header: "Stock-In Date" },
  ];

  // Apply filtering to the data
  const filteredData = stockInData.filter((item) => {
    const matchesDate =
      selectedDate === "" || item.stock_in_date === selectedDate;
    const matchesSupplier =
      selectedSupplier === "" || item.supplier_name === selectedSupplier;
    return matchesDate && matchesSupplier;
  });

  // Apply sorting to the filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    let fieldA = a[sortField];
    let fieldB = b[sortField];

    // Handle null or undefined values
    if (fieldA === null || fieldA === undefined) fieldA = "";
    if (fieldB === null || fieldB === undefined) fieldB = "";

    // Convert dates to comparable values
    if (sortField === "stock_in_date") {
      fieldA = new Date(fieldA);
      fieldB = new Date(fieldB);
    }

    // Case-insensitive comparison for strings
    if (typeof fieldA === "string") fieldA = fieldA.toLowerCase();
    if (typeof fieldB === "string") fieldB = fieldB.toLowerCase();

    if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex flex-row items-center gap-2">
        <button onClick={() => navigate(-1)} aria-label="Go Back">
          <IoIosArrowBack
            className="text-pink-500 hover:text-pink-600"
            fontSize={40}
          />
        </button>
        <strong className="text-3xl font-bold text-gray-500">
          Stock In History
        </strong>
      </div>

      {/* Filtering Controls */}
      <div className="flex flex-wrap items-center mt-4 gap-4">
        {/* Supplier Filter */}
        <div className="flex items-center">
          <label
            htmlFor="supplier-filter"
            className="mr-2 font-semibold text-gray-700"
          >
            Supplier:
          </label>
          <div className="relative">
            <select
              id="supplier-filter"
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="w-[10rem] h-8 px-2 appearance-none border rounded-md bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700 focus:outline-none focus:ring-4 focus:ring-pink-50"
            >
              <option value="">All Suppliers</option>
              {supplierList.map((supplier, index) => (
                <option key={index} value={supplier}>
                  {supplier}
                </option>
              ))}
            </select>
            <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
          {selectedSupplier && (
            <button
              onClick={() => setSelectedSupplier("")}
              className="text-sm ml-2 text-pink-500 hover:text-pink-700 focus:outline-none"
            >
              Clear
            </button>
          )}
        </div>
        {/* Supplier Filter */}
        <div className="flex items-center">
          <label
            htmlFor="supplier-filter"
            className="mr-2 font-semibold text-gray-700"
          >
            Supplier:
          </label>
          <div className="relative">
            <select
              id="supplier-filter"
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="w-[10rem] h-8 px-2 appearance-none border rounded-md bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700 focus:outline-none focus:ring-4 focus:ring-pink-50"
            >
              <option value="">All Suppliers</option>
              {supplierList.map((supplier, index) => (
                <option key={index} value={supplier}>
                  {supplier}
                </option>
              ))}
            </select>
            <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
          {selectedSupplier && (
            <button
              onClick={() => setSelectedSupplier("")}
              className="text-sm ml-2 text-pink-500 hover:text-pink-700 focus:outline-none"
            >
              Clear
            </button>
          )}
        </div>

        {/* Date Filter */}
        <div className="flex items-center">
          <label
            htmlFor="date-filter"
            className="mr-2 font-semibold text-gray-700"
          >
            Date:
          </label>
          <input
            id="date-filter"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-md h-8 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          {selectedDate && (
            <button
              onClick={() => setSelectedDate("")}
              className="text-sm ml-2 text-pink-500 hover:text-pink-700 focus:outline-none"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sorting Controls */}
        <div className="flex items-center gap-4">
          <label
            htmlFor="sort-field"
            className="mr-2 font-semibold text-gray-700"
          >
            Sort By:
          </label>
          <div className="relative">
            <select
              id="sort-field"
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="w-[10rem] h-8 px-2 appearance-none border rounded-md bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700 focus:outline-none focus:ring-4 focus:ring-pink-50"
            >
              <option value="reference_number">Reference No.</option>
              <option value="supplier_name">Supplier</option>
              <option value="stock_in_date">Date</option>
            </select>
            <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
          <button
            onClick={() =>
              setSortOrder((prevOrder) =>
                prevOrder === "asc" ? "desc" : "asc",
              )
            }
            className="flex items-center border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            {sortOrder === "asc" ? (
              <FaArrowUp className="text-gray-700" />
            ) : (
              <FaArrowDown className="text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="h-[48rem] overflow-y-scroll mt-2">
        {loading ? (
          <p>Loading...</p>
        ) : sortedData.length === 0 ? (
          <p>No stock-in records found.</p>
        ) : (
          <DataTable columns={columns} data={sortedData} isInventory={true} />
        )}
      </div>
    </div>
  );
};

export default StockInHistory;