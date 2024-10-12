import React from "react";
import DataTable from "../shared/DataTable";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const SupplierTable = ({
  suppliers,
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
    { key: "supplier_id", header: renderHeader("supplier_id", "ID") },
    {
      key: "supplier_name",
      header: renderHeader("supplier_name", "Supplier Name"),
    },
    {
      key: "contact_person",
      header: renderHeader("contact_person", "Contact Person"),
    },
    { key: "contact_number", header: "Contact Number" },
    { key: "email", header: "Email" },
    { key: "address", header: "Address" },
    { key: "status", header: "Status" },
  ];

  return (
    <DataTable
      data={suppliers}
      columns={columns}
      onEdit={onEdit}
      onArchive={onArchive}
    />
  );
};

export default SupplierTable;
