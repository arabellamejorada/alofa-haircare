import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StockHistoryTable from "../StockHistoryTable";
import { IoIosArrowBack } from "react-icons/io";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import {
  IoMdArrowDropdown,
  IoMdArrowDropdownCircle,
  IoMdArrowDroprightCircle,
} from "react-icons/io";
import { getAllStockOut } from "../../../api/stockOut";

const StockOutHistory = () => {
  const navigate = useNavigate();
  const [stockOutData, setStockOutData] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for sorting
  const [sortField, setSortField] = useState("reference_number");
  const [sortOrder, setSortOrder] = useState("asc");

  // State for filtering
  const [selectedDate, setSelectedDate] = useState("");

  // State to track which rows are expanded
  const [expandedRows, setExpandedRows] = useState([]);

  useEffect(() => {
    const fetchStockOutData = async () => {
      try {
        const response = await getAllStockOut();
        const dataWithFormattedDate = response.data.map((item) => ({
          ...item,
          stock_out_date: item.stock_out_date.split("T")[0], // Format date to YYYY-MM-DD
        }));
        setStockOutData(dataWithFormattedDate);
      } catch (error) {
        console.error("Error fetching stock-out data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockOutData();
  }, []);

  // Group stock-out data by reference number
  const groupedData = stockOutData.reduce((acc, item) => {
    const refNumber = item.reference_number;
    if (!acc[refNumber]) {
      acc[refNumber] = {
        reference_number: refNumber,
        stock_out_date: item.stock_out_date,
        employee_name: item.employee_name,
        reason: item.reason,
        products: [],
      };
    }
    acc[refNumber].products.push(item);
    return acc;
  }, {});

  const groupedDataArray = Object.values(groupedData);

  const toggleRow = (refNumber) => {
    if (expandedRows.includes(refNumber)) {
      setExpandedRows(expandedRows.filter((id) => id !== refNumber));
    } else {
      setExpandedRows([...expandedRows, refNumber]);
    }
  };

  const columns = [
    { key: "reference_number", header: "Ref #" },
    { key: "employee_name", header: "Authorized by" },
    { key: "reason", header: "Reason" },
    { key: "stock_out_date", header: "Stock-Out Date" },
  ];

  // Apply filtering to the grouped data
  const filteredData = groupedDataArray.filter((group) => {
    const itemDate = new Date(group.stock_out_date).toLocaleDateString("en-CA");

    const matchesDate =
      selectedDate === "" ||
      new Date(selectedDate).toISOString().split("T")[0] === itemDate;

    return matchesDate;
  });

  // Apply sorting to the filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    let fieldA = a[sortField];
    let fieldB = b[sortField];

    // Handle null or undefined values
    if (fieldA === null || fieldA === undefined) fieldA = "";
    if (fieldB === null || fieldB === undefined) fieldB = "";

    // Convert dates to comparable values
    if (sortField === "stock_out_date") {
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
          Stock Out History
        </strong>
      </div>

      {/* Filtering Controls */}
      <div className="flex flex-wrap items-center mt-4 gap-4">
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
              <option value="stock_out_date">Date</option>
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
      <div className="mt-4">
        {loading ? (
          <p>Loading...</p>
        ) : sortedData.length === 0 ? (
          <p>No stock-out records found.</p>
        ) : (
          <StockHistoryTable
            data={sortedData}
            columns={columns}
            isInventory={true}
            onExpand={toggleRow}
            expandedRows={expandedRows}
          />
        )}
      </div>
    </div>
  );
};

export default StockOutHistory;
