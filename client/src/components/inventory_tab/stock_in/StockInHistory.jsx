import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StockHistoryTable from "../StockHistoryTable";
import { IoIosArrowBack } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { getAllStockIn } from "../../../api/stockIn";
import { ClipLoader } from "react-spinners";
const StockInHistory = () => {
  const navigate = useNavigate();
  const [stockInData, setStockInData] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for sorting
  const [sortField, setSortField] = useState("index");
  const [sortOrder, setSortOrder] = useState("asc");

  // State for searching
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtering
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [supplierList, setSupplierList] = useState([]);

  // State to track which rows are expanded
  const [expandedRows, setExpandedRows] = useState([]);

  useEffect(() => {
    const fetchStockInData = async () => {
      try {
        setLoading(true);
        const response = await getAllStockIn();
        const dataWithIndex = response.data.map((item, index) => ({
          ...item,
          index: index + 1,
          stock_in_date: item.stock_in_date.split("T")[0], // Format the date to YYYY-MM-DD
        }));
        setStockInData(dataWithIndex);

        // Extract unique suppliers for the filter dropdown
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

  // Group stock-in data by reference number
  const groupedData = stockInData.reduce((acc, item) => {
    const refNumber = item.reference_number;
    if (!acc[refNumber]) {
      acc[refNumber] = {
        reference_number: refNumber,
        stock_in_date: item.stock_in_date,
        supplier_name: item.supplier_name,
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
    { key: "supplier_name", header: "Supplier" },
    { key: "employee_name", header: "Authorized by" },
    { key: "stock_in_date", header: "Stock-In Date" },
  ];

  const handleSort = (field) => {
    // Toggle sort order when the same field is clicked
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);

    // Sort the grouped data array based on the selected field and order
    const sortedData = [...groupedDataArray].sort((a, b) => {
      if (a[field] < b[field]) return newSortOrder === "asc" ? -1 : 1;
      if (a[field] > b[field]) return newSortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setStockInData(sortedData);
  };

  const filteredData = groupedDataArray.filter((group) => {
    const itemDate = new Date(group.stock_in_date).toLocaleDateString("en-CA");

    const matchesDate =
      selectedDate === "" ||
      new Date(selectedDate).toISOString().split("T")[0] === itemDate;

    const matchesSupplier =
      selectedSupplier === "" || group.supplier_name === selectedSupplier;

    const matchesSearchTerm =
      searchTerm === "" ||
      group.reference_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.employee_name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDate && matchesSupplier && matchesSearchTerm;
  });

  return (
    <div className="relative">
      {loading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
          <ClipLoader size={50} color="#E53E3E" loading={loading} />
        </div>
      )}

      <div className="container mx-auto p-4">
        <div className="flex flex-row items-center gap-2">
          <button onClick={() => navigate(-1)} aria-label="Go Back">
            <IoIosArrowBack
              className="text-alofa-pink hover:text-alofa-dark"
              fontSize={40}
            />
          </button>
          <strong className="text-3xl font-bold text-gray-500">
            Stock In History
          </strong>
        </div>

        {/* Filters */}
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
              className="border border-gray-300 rounded-md h-8 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-alofa-pink"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate("")}
                className="text-sm ml-2 text-alofa-pink hover:text-alofa-dark"
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
                className="w-[10rem] h-8 px-2 appearance-none border rounded-md bg-gray-50 hover:border-alofa-pink hover:bg-white border-slate-300"
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
                className="text-sm ml-2 text-alofa-pink hover:text-alofa-dark"
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

        <StockHistoryTable
          data={filteredData}
          columns={columns}
          isInventory={true}
          onExpand={toggleRow}
          expandedRows={expandedRows}
          handleSort={handleSort}
          sortField={sortField}
          sortOrder={sortOrder}
          isStockIn={true}
        />
      </div>
    </div>
  );
};

export default StockInHistory;
