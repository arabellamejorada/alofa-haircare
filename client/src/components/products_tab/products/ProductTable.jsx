import React from "react";
import DataTable from "../../shared/DataTable";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const ProductTable = ({
  products,
  onEdit,
  onArchive,
  handleColumnSort,
  sortField,
  sortOrder,
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
    { key: "product_id", header: renderHeader("product_id", "ID") },
    { key: "name", header: renderHeader("name", "Product Name") },
    { key: "description", header: renderHeader("description", "Description") },
    {
      key: "product_category",
      header: renderHeader("product_category", "Category"),
    },
    {
      key: "product_status",
      header: renderHeader("product_status", "Status"),
    },
  ];
  return (
    <DataTable
      data={products}
      columns={columns}
      onEdit={onEdit}
      onArchive={onArchive}
    />
  );
};

export default ProductTable;
