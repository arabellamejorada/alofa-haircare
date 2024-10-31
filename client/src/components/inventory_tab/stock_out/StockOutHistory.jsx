import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StockHistoryTable from "../StockHistoryTable";
import { IoIosArrowBack } from "react-icons/io";
import { getAllStockOut } from "../../../api/stockOut";

const StockOutHistory = () => {
  const navigate = useNavigate();
  const [stockOutData, setStockOutData] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for sorting
  const [sortField, setSortField] = useState("stock_out_date");
  const [sortOrder, setSortOrder] = useState("desc");

  // State for filtering
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
    { key: "stock_out_date", header: "Stock-Out Date" },
  ];

  // Handle sorting
  const handleSort = (field) => {
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
  };

  // Apply filtering, searching, and sorting to the data
  const filteredData = groupedDataArray
    .filter((group) => {
      const itemDate = new Date(group.stock_out_date).toLocaleDateString(
        "en-CA",
      );
      const matchesDate =
        selectedDate === "" ||
        new Date(selectedDate).toISOString().split("T")[0] === itemDate;

      const matchesSearch =
        searchTerm === "" ||
        (group.reference_number &&
          group.reference_number
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (group.employee_name &&
          group.employee_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (group.reason &&
          group.reason.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesDate && matchesSearch;
    })
    .sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];

      if (fieldA === null || fieldA === undefined) fieldA = "";
      if (fieldB === null || fieldB === undefined) fieldB = "";

      if (sortField === "stock_out_date") {
        fieldA = new Date(fieldA);
        fieldB = new Date(fieldB);
      }

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
            className="text-alofa-pink hover:text-alofa-dark"
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
            className="w-full max-w-md h-10 px-4 border rounded-xl bg-gray-50 border-slate-300 focus:outline-none focus:border-alofa-highlight focus:bg-white"
          />
          {selectedDate && (
            <button
              onClick={() => setSelectedDate("")}
              className="text-sm ml-2 text-alofa-pink hover:text-alofa-dark focus:outline-none"
            >
              Clear
            </button>
          )}
        </div>

        {/* Search Filter */}
        <div className="flex items-center">
          <label
            htmlFor="search-filter"
            className="mr-2 font-semibold text-gray-700"
          >
            Search:
          </label>
          <input
            id="search-filter"
            type="text"
            placeholder="Search here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md h-10 px-4 border rounded-xl bg-gray-50 border-slate-300 focus:outline-none focus:border-alofa-highlight focus:bg-white"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-sm ml-2 text-alofa-pink hover:text-alofa-dark focus:outline-none"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="mt-4">
        {loading ? (
          <p>Loading...</p>
        ) : filteredData.length === 0 ? (
          <p>No stock-out records found.</p>
        ) : (
          <StockHistoryTable
            data={filteredData}
            columns={columns}
            isInventory={true}
            onExpand={toggleRow}
            expandedRows={expandedRows}
            handleSort={handleSort}
            sortField={sortField}
            sortOrder={sortOrder}
          />
        )}
      </div>
    </div>
  );
};

export default StockOutHistory;
