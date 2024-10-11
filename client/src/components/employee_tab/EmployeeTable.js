import React from "react";
import DataTable from "../shared/DataTable";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const EmployeeTable = ({
  sortedEmployees,
  columns,
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

  const enhancedColumns = columns.map((col) => ({
    ...col,
    header: renderHeader(col.key, col.header),
  }));

  return (
    <DataTable
      data={sortedEmployees}
      columns={enhancedColumns}
      onEdit={onEdit}
      onArchive={onArchive}
    />
  );
};

export default EmployeeTable;