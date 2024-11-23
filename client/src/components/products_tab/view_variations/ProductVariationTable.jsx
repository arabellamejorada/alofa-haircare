import React from "react";
import DataTable from "../../shared/DataTable";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const ProductVariationTable = ({
  filteredVariations,
  onEdit,
  onArchive,
  sortField,
  sortOrder,
  handleColumnSort,
  loading, // Accept loading as a prop
}) => {
  const renderHeader = (key, label) => (
    <div
      onClick={() => handleColumnSort(key)}
      className="flex items-center cursor-pointer"
    >
      {label}
      {sortField === key && (
        <span className="ml-1">
          {sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />}
        </span>
      )}
    </div>
  );

  const columns = [
    { key: "variation_id", header: renderHeader("variation_id", "ID") },
    {
      key: "product_name",
      header: renderHeader("product_name", "Product Name"),
    },
    { key: "type", header: renderHeader("type", "Variation Type") },
    { key: "value", header: renderHeader("value", "Variation Value") },
    { key: "sku", header: renderHeader("sku", "SKU") },
    { key: "unit_price", header: renderHeader("unit_price", "Price") },
    {
      key: "status_description",
      header: renderHeader("status_description", "Status"),
    },
  ];

  // Conditional rendering for loading spinner or DataTable
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <ClipLoader size={50} color="#E53E3E" />
      </div>
    );
  }

  if (!loading && filteredVariations.length === 0) {
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

  return (
    <DataTable
      data={filteredVariations}
      columns={columns}
      onEdit={onEdit}
      onArchive={onArchive}
    />
  );
};

export default ProductVariationTable;
