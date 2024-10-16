import React from "react";
import DataTable from "../../shared/DataTable";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const ProductVariationTable = ({
  filteredVariations,
  onEdit,
  onArchive,
  sortField,
  sortOrder,
  handleColumnSort,
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
