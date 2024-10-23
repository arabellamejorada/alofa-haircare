import React from "react";
import DataTable from "../shared/DataTable";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const EmployeeTable = ({
  sortedEmployees,
  onEdit,
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
    { key: "employee_id", header: renderHeader("employee_id", "ID") },
    { key: "first_name", header: renderHeader("first_name", "First Name") },
    { key: "last_name", header: renderHeader("last_name", "Last Name") },
    { key: "email", header: "Email" },
    { key: "contact_number", header: "Contact Number" },
    { key: "role_name", header: "Role" },
    { key: "status_description", header: "Status" },
  ];
  return (
    <DataTable
      data={sortedEmployees}
      columns={columns}
      onEdit={onEdit}
      isEmployee={true}
    />
  );
};

export default EmployeeTable;
