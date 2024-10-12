import { useState, useEffect } from "react";
import { getEmployees, getRoles, getEmployeeStatus } from "../../api/employees";

export const useEmployeeData = () => {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [error, setError] = useState(null);

  // State for filters and sorting
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortField, setSortField] = useState("employee_id");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesData = await getEmployees();
        const rolesData = await getRoles();
        const employeeStatusData = await getEmployeeStatus();

        setEmployees(employeesData);
        setRoles(rolesData);
        setStatuses(employeeStatusData);
      } catch (err) {
        setError("Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  // Create a map for roles and statuses for easier lookup
  const roleMap = roles.reduce((acc, role) => {
    acc[role.role_id] = role.name;
    return acc;
  }, {});

  const statusMap = statuses.reduce((acc, status) => {
    acc[status.status_id] = status.description;
    return acc;
  }, {});

  // Filter and sort employees based on search, role, and status
  const filteredEmployees = employees
    .map((employee) => ({
      ...employee,
      role_name: roleMap[employee.role_id] || "Unknown Role",
      status_description: statusMap[employee.status_id] || "Unknown Status",
    }))
    .filter((employee) => {
      const fullName = `${employee.first_name} ${employee.last_name}`.toLowerCase();
      const matchesSearch = search ? fullName.includes(search.toLowerCase()) : true;
      const matchesRole = selectedRole ? employee.role_id === parseInt(selectedRole) : true;
      const matchesStatus = selectedStatus ? employee.status_id === parseInt(selectedStatus) : true;
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });

  return {
    employees: filteredEmployees,
    roles,
    statuses,
    error,
    setEmployees,
    search,
    setSearch,
    selectedRole,
    setSelectedRole,
    selectedStatus,
    setSelectedStatus,
    sortField,
    sortOrder,
    handleColumnSort: (field) => {
      const isAsc = sortField === field && sortOrder === "asc";
      setSortOrder(isAsc ? "desc" : "asc");
      setSortField(field);
    },
  };
};
