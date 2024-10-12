import React, { useEffect, useState } from "react";
import { MdAddBox } from "react-icons/md";
import { showToast } from "../../lib/consts/utils/toastUtils";
import {
  getEmployees,
  getRoles,
  createEmployee,
  updateEmployee,
  archiveEmployee,
  getEmployeeStatus,
} from "../../api/employees";
import { validateForm } from "../../lib/consts/utils/validationUtils";
import EmployeeTable from "./EmployeeTable";
import EmployeeForm from "./EmployeeForm";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [error, setError] = useState(null);

  // State for filters
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortField, setSortField] = useState("employee_id");
  const [sortOrder, setSortOrder] = useState("asc");

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [roleId, setRoleId] = useState("");
  const [statusId, setStatusId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // State for form validation errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesData = await getEmployees();
        const employeeStatusData = await getEmployeeStatus();
        let rolesData = await getRoles();

        rolesData = rolesData.filter(
          (role) => role.name === "Admin" || role.name === "Employee",
        );

        setEmployees(employeesData);
        setRoles(rolesData);
        setStatuses(employeeStatusData);
      } catch (err) {
        setError("Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!isModalVisible) {
      // Reset fields when modal is closed
      setFirstName("");
      setLastName("");
      setEmail("");
      setContactNumber("");
      setRoleId("");
      setUsername("");
      setPassword("");
      setSelectedEmployee(null); // Clear selected employee
    }
  }, [isModalVisible]);

  const handleInputChange = (e, field) => {
    const value = e.target.value;

    let error = "";

    switch (field) {
      case "firstName":
        setFirstName(value);
        error = value.trim() ? "" : "First name is required";
        break;
      case "lastName":
        setLastName(value);
        error = value.trim() ? "" : "Last name is required";
        break;
      case "email":
        setEmail(value);
        error = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Enter a valid email address";
        break;
      case "contactNumber":
        setContactNumber(value);
        error = /^\d{11}$/.test(value)
          ? ""
          : "Enter a valid 11-digit phone number";
        break;
      case "roleId":
        setRoleId(value);
        error = value ? "" : "Role is required";
        break;
      case "username":
        setUsername(value);
        error = value.trim() ? "" : "Username is required";
        break;
      case "password":
        setPassword(value);
        error =
          value.length >= 6 ? "" : "Password must be at least 6 characters";
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleColumnSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();

    const formErrors = validateForm({
      firstName,
      lastName,
      email,
      contactNumber,
      roleId,
      username: selectedEmployee ? "placeholder" : username || "",
      password: selectedEmployee ? "placeholder" : password || "",
    });

    setErrors(formErrors);

    if (Object.values(formErrors).some((error) => error !== "")) {
      showToast("error", "Please fill out all required fields correctly.");
      return;
    }

    const newEmployee = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      contact_number: contactNumber,
      role_id: roleId,
      status_id: 1,
      username: username,
      password: password,
    };

    try {
      const response = await createEmployee(newEmployee);
      console.log(response);
      setIsModalVisible(false);

      const employeesData = await getEmployees();
      setEmployees(employeesData);

      showToast("success", "Employee added successfully!");
    } catch (error) {
      console.error("Error creating employee: ", error);
      showToast("error", "Failed to add employee. Please try again.");
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();

    if (!selectedEmployee) return;

    const formErrors = validateForm({
      firstName: firstName || selectedEmployee.first_name,
      lastName: lastName || selectedEmployee.last_name,
      email: email || selectedEmployee.email,
      contactNumber: contactNumber || selectedEmployee.contact_number,
      roleId: roleId || selectedEmployee.role_id,
      username: "",
      password: "",
      isEdit: true,
    });

    setErrors(formErrors);

    if (Object.values(formErrors).some((error) => error !== "")) {
      showToast("error", "Please fill out all required fields correctly.");
      return;
    }

    const formData = new FormData();
    formData.append("first_name", firstName || selectedEmployee.first_name);
    formData.append("last_name", lastName || selectedEmployee.last_name);
    formData.append("email", email || selectedEmployee.email);
    formData.append(
      "contact_number",
      contactNumber || selectedEmployee.contact_number,
    );
    formData.append("role_id", roleId || selectedEmployee.role_id);
    formData.append("status_id", statusId || selectedEmployee.status_id);

    try {
      const response = await updateEmployee(
        selectedEmployee.employee_id,
        formData,
      );
      console.log(response);
      setIsModalVisible(false);

      const employeesData = await getEmployees();
      setEmployees(employeesData);

      showToast("success", "Employee updated successfully!");
    } catch (error) {
      console.error("Error updating employee: ", error);
      showToast("error", "Failed to update employee. Please try again.");
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setFirstName(employee.first_name);
    setLastName(employee.last_name);
    setEmail(employee.email);
    setContactNumber(employee.contact_number);
    setRoleId(employee.role_id);
    setStatusId(employee.status_id);
    setIsModalVisible(true);
    setErrors({});
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedEmployee(null);
  };

  const columns = [
    { key: "employee_id", header: "ID" },
    { key: "first_name", header: "First Name" },
    { key: "last_name", header: "Last Name" },
    { key: "email", header: "Email" },
    { key: "contact_number", header: "Contact Number" },
    { key: "role_name", header: "Role" },
    { key: "status_description", header: "Status" },
  ];

  const filteredEmployees = employees
    .filter((employee) => {
      const fullName =
        `${employee.first_name} ${employee.last_name}`.toLowerCase();
      const matchesSearch = search
        ? fullName.includes(search.toLowerCase())
        : true;
      const matchesRole = selectedRole
        ? employee.role_id === parseInt(selectedRole)
        : true;
      const matchesStatus = selectedStatus
        ? employee.status_id === parseInt(selectedStatus)
        : true;
      return matchesSearch && matchesRole && matchesStatus;
    })
    .map((item) => ({
      ...item,
      role_name: roles.find((r) => r.role_id === item.role_id)?.name || "",
      status_description:
        statuses.find((s) => s.status_id === item.status_id)?.description ||
        "Unknown Status",
    }));

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-between">
        <strong className="text-3xl font-bold text-gray-500">Employees</strong>
        <div className="flex gap-2">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[200px] h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
          />
          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-[150px] h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
          >
            <option value="">All Roles</option>
            {roles.map((role) => (
              <option key={role.role_id} value={role.role_id}>
                {role.name}
              </option>
            ))}
          </select>
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-[150px] h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status.status_id} value={status.status_id}>
                {status.description}
              </option>
            ))}
          </select>
          <MdAddBox
            fontSize={30}
            className="text-gray-400 mx-2 hover:text-pink-400 active:text-pink-500"
            onClick={() => {
              setSelectedEmployee(null); // Clear the selected employee
              setIsModalVisible(true); // Show the modal
            }}
          />
        </div>
      </div>

      {/* Render EmployeeTable */}
      <EmployeeTable
        sortedEmployees={sortedEmployees}
        columns={columns}
        onEdit={handleEdit}
        onArchive={archiveEmployee}
        sortField={sortField}
        sortOrder={sortOrder}
        handleColumnSort={handleColumnSort}
      />

      {/* Render EmployeeForm */}
      <EmployeeForm
        isVisible={isModalVisible}
        handleCloseModal={handleCloseModal}
        handleUpdateEmployee={handleUpdateEmployee}
        handleAddEmployee={handleAddEmployee}
        handleInputChange={handleInputChange}
        selectedEmployee={selectedEmployee}
        firstName={firstName}
        lastName={lastName}
        email={email}
        contactNumber={contactNumber}
        roleId={roleId}
        statusId={statusId}
        setStatusId={setStatusId}
        username={username}
        password={password}
        roles={roles}
        statuses={statuses}
        errors={errors}
      />
    </div>
  );
};

export default Employees;
