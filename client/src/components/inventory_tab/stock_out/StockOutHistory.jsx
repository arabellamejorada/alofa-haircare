// StockOutHistory.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../shared/DataTable";
import { IoIosArrowBack } from "react-icons/io";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";

const StockOutHistory = () => {
  const navigate = useNavigate();

  // Dummy data for stock-out records and items
  const stockOutRecords = [
    {
      stock_out_id: 1,
      reference_number: "SO-001",
      stock_out_date: "2023-09-15",
      order_transaction_id: 1001,
      employee_id: 10,
    },
    {
      stock_out_id: 2,
      reference_number: "SO-002",
      stock_out_date: "2023-09-16",
      order_transaction_id: 1002,
      employee_id: 11,
    },
    {
      stock_out_id: 3,
      reference_number: "SO-003",
      stock_out_date: "2023-09-17",
      order_transaction_id: 1003,
      employee_id: 10,
    },
    // Add more records as needed
  ];

  const stockOutItems = [
    {
      stock_out_item_id: 1,
      stock_out_id: 1,
      variation_id: 2001,
      quantity: 5,
      reason: "Sold",
    },
    {
      stock_out_item_id: 2,
      stock_out_id: 1,
      variation_id: 2002,
      quantity: 3,
      reason: "Damaged",
    },
    {
      stock_out_item_id: 3,
      stock_out_id: 2,
      variation_id: 2003,
      quantity: 2,
      reason: "Expired",
    },
    {
      stock_out_item_id: 4,
      stock_out_id: 3,
      variation_id: 2004,
      quantity: 4,
      reason: "Sold",
    },
    // Add more items as needed
  ];

  const employees = [
    { employee_id: 10, employee_name: "John Doe" },
    { employee_id: 11, employee_name: "Jane Smith" },
    // Add more employees as needed
  ];

  // Merge the stock-out records and items based on stock_out_id
  const mergedData = stockOutItems.map((item, index) => {
    const stockOutRecord = stockOutRecords.find(
      (record) => record.stock_out_id === item.stock_out_id,
    );
    const employee = employees.find(
      (emp) => emp.employee_id === stockOutRecord?.employee_id,
    );
    return {
      ...item,
      index: index + 1, // Add index field
      reference_number: stockOutRecord ? stockOutRecord.reference_number : "",
      stock_out_date: stockOutRecord ? stockOutRecord.stock_out_date : "",
      order_transaction_id: stockOutRecord
        ? stockOutRecord.order_transaction_id
        : "",
      employee_name: employee ? employee.employee_name : "",
    };
  });

  // Define columns for the DataTable
  const columns = [
    { key: "index", header: "#" }, // Added index column
    { key: "stock_out_id", header: "Stock Out ID" },
    { key: "reference_number", header: "Ref #" },
    { key: "stock_out_date", header: "Date" },
    { key: "variation_id", header: "Variation ID" },
    { key: "quantity", header: "Quantity" },
    { key: "reason", header: "Reason" },
    { key: "employee_name", header: "Employee" },
    { key: "order_transaction_id", header: "Order Transaction ID" },
  ];

  // State for sorting
  const [sortField, setSortField] = useState("index"); // Default to index
  const [sortOrder, setSortOrder] = useState("asc");

  // State for filtering
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Apply filtering to the data
  const filteredData = mergedData.filter((item) => {
    const matchesEmployee =
      selectedEmployee === "" || item.employee_name === selectedEmployee;
    const matchesDate =
      selectedDate === "" || item.stock_out_date === selectedDate;
    return matchesEmployee && matchesDate;
  });

  // Apply sorting to the filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    let fieldA = a[sortField];
    let fieldB = b[sortField];

    // Convert dates to comparable values
    if (sortField === "stock_out_date") {
      fieldA = new Date(fieldA);
      fieldB = new Date(fieldB);
    }

    // Convert to numbers if sorting by index
    if (sortField === "index") {
      fieldA = Number(fieldA);
      fieldB = Number(fieldB);
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
          <label className="mr-2 font-semibold text-gray-700">Date:</label>
          <input
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

        {/* Employee Filter */}
        <div className="flex items-center">
          <label className="mr-2 font-semibold text-gray-700">Employee:</label>
          <div className="relative">
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-[10rem] h-8 px-2 appearance-none border rounded-md bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700 focus:outline-none focus:ring-4 focus:ring-pink-50"
            >
              <option value="">All Employees</option>
              {employees.map((employee) => (
                <option
                  key={employee.employee_id}
                  value={employee.employee_name}
                >
                  {employee.employee_name}
                </option>
              ))}
            </select>
            <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
          {selectedEmployee && (
            <button
              onClick={() => setSelectedEmployee("")}
              className="text-sm ml-2 text-pink-500 hover:text-pink-700 focus:outline-none"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sorting Controls */}
        <div className="flex items-center gap-4">
          <label className="mr-2 font-semibold text-gray-700">Sort By:</label>
          <div className="relative">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="w-[9rem] h-8 px-2 appearance-none border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="index">Index</option>
              <option value="reference_number">Reference No.</option>
              <option value="employee_name">Employee</option>
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
      <div className="h-[48rem] overflow-y-scroll mt-2">
        {sortedData.length === 0 ? (
          <p>No stock-out records found.</p>
        ) : (
          <DataTable columns={columns} data={sortedData} isInventory={true} />
        )}
      </div>
    </div>
  );
};

export default StockOutHistory;
