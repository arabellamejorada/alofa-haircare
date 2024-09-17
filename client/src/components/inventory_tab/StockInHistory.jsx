import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import DataTable from "../shared/DataTable";
import { IoIosArrowBack } from "react-icons/io";

const StockInHistory = () => {
  const navigate = useNavigate();

  const sampleColumns = [
    { key: "id", header: "ID" },
    { key: "productName", header: "Product Name" },
    { key: "quantity", header: "Quantity" },
    { key: "stockInDate", header: "Stock-In Date" },
    { key: "supplier", header: "Supplier" },
  ];

  const sampleData = [
    {
      id: 1,
      productName: "Shampoo",
      quantity: 50,
      stockInDate: "2023-10-01",
      supplier: "Supplier A",
    },
    {
      id: 2,
      productName: "Conditioner",
      quantity: 30,
      stockInDate: "2023-10-02",
      supplier: "Supplier B",
    },
    {
      id: 3,
      productName: "Hair Oil",
      quantity: 20,
      stockInDate: "2023-10-03",
      supplier: "Supplier C",
    },
    {
      id: 4,
      productName: "Hair Gel",
      quantity: 40,
      stockInDate: "2023-10-04",
      supplier: "Supplier D",
    },
    {
      id: 5,
      productName: "Hair Spray",
      quantity: 25,
      stockInDate: "2023-10-05",
      supplier: "Supplier E",
    },
    {
      id: 5,
      productName: "Hair Spray",
      quantity: 25,
      stockInDate: "2023-10-05",
      supplier: "Supplier E",
    },
    {
      id: 5,
      productName: "Hair Spray",
      quantity: 25,
      stockInDate: "2023-10-05",
      supplier: "Supplier E",
    },
    {
      id: 5,
      productName: "Hair Spray",
      quantity: 25,
      stockInDate: "2023-10-05",
      supplier: "Supplier E",
    },
    {
      id: 5,
      productName: "Hair Spray",
      quantity: 25,
      stockInDate: "2023-10-05",
      supplier: "Supplier E",
    },
    {
      id: 5,
      productName: "Hair Spray",
      quantity: 25,
      stockInDate: "2023-10-05",
      supplier: "Supplier E",
    },
    {
      id: 5,
      productName: "Hair Spray",
      quantity: 25,
      stockInDate: "2023-10-05",
      supplier: "Supplier E",
    },
    {
      id: 5,
      productName: "Hair Spray",
      quantity: 25,
      stockInDate: "2023-10-05",
      supplier: "Supplier E",
    },
    {
      id: 5,
      productName: "Hair Spray",
      quantity: 25,
      stockInDate: "2023-10-05",
      supplier: "Supplier E",
    },
    {
      id: 5,
      productName: "Hair Spray",
      quantity: 25,
      stockInDate: "2023-10-05",
      supplier: "Supplier E",
    },
    // Add more sample data as needed
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row items-center gap-2">
        <button>
          <IoIosArrowBack
            className=" text-pink-500 hover:text-pink-600"
            fontSize={40}
            onClick={() => navigate(-1)}
          />
        </button>
        <strong className="text-3xl font-bold text-gray-500">
          Stock In History
        </strong>
      </div>
      <div className="h-[48rem] overflow-y-scroll mt-2">
        <DataTable columns={sampleColumns} data={sampleData} />
      </div>
    </div>
  );
};

export default StockInHistory;
