import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../shared/DataTable";
import { IoIosArrowBack } from "react-icons/io";
import { getAllStockIn } from "../../api/stockIn";

const StockInHistory = () => {
  const navigate = useNavigate();
  const [stockInData, setStockInData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: "index", header: "Index" },
    { key: "reference_number", header: "Reference Number" },
    { key: "sku", header: "SKU" },
    { key: "name", header: "Product Name" },
    { key: "type", header: "Type" },
    { key: "value", header: "Value" },
    { key: "quantity", header: "Quantity" },
    { key: "supplier_name", header: "Supplier" },
    { key: "stock_in_date", header: "Stock-In Date" },
  ];

  useEffect(() => {
    // Fetch the stock-in data from the API
    const fetchStockInData = async () => {
      try {
        const response = await getAllStockIn();
        // Add index to each row
        const dataWithIndex = response.data.map((item, index) => ({
          ...item,
          index: index + 1, // Starting the index at 1 instead of 0
        }));
        setStockInData(dataWithIndex);
      } catch (error) {
        console.error("Error fetching stock-in data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockInData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row items-center gap-2">
        <button onClick={() => navigate(-1)}>
          <IoIosArrowBack
            className="text-pink-500 hover:text-pink-600"
            fontSize={40}
          />
        </button>
        <strong className="text-3xl font-bold text-gray-500">
          Stock In History
        </strong>
      </div>
      <div className="h-[48rem] overflow-y-scroll mt-2">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataTable columns={columns} data={stockInData} isInventory={true} />
        )}
      </div>
    </div>
  );
};

export default StockInHistory;
