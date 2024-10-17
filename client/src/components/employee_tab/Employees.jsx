import React, { useEffect, useState } from "react";
import { MdAddBox } from "react-icons/md";
import { toast } from "sonner";
import {
  getEmployees,
  getRoles,
  createEmployee,
  updateEmployee,
  archiveEmployee,
  getEmployeeStatus,
} from "../../api/employees";
import { validateEmployeeForm } from "../../lib/consts/utils/validationUtils";
import EmployeeTable from "./EmployeeTable";
import EmployeeForm from "./EmployeeForm";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [error, setError] = useState(null);
  const [originalEmployeeData, setOriginalEmployeeData] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showArchived, setShowArchived] = useState(false);

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
      resetForm();
    }
  }, [isModalVisible]);

  const handleCloseModal = () => {
    setIsModalVisible(false); // Close the modal
    resetForm(); // Reset form fields and state
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setContactNumber("");
    setRoleId("");
    setUsername("");
    setPassword("");
    setOriginalEmployeeData(null); // Reset original data
    setSelectedEmployee(null);
  };

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

  const isFormModified = () => {
    return (
      firstName !== originalEmployeeData?.first_name ||
      lastName !== originalEmployeeData?.last_name ||
      email !== originalEmployeeData?.email ||
      contactNumber !== originalEmployeeData?.contact_number ||
      roleId !== originalEmployeeData?.role_id ||
      statusId !== originalEmployeeData?.status_id
    );
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();

    const formErrors = validateEmployeeForm({
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
      toast.error("Please fill out all required fields correctly.");
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
      setIsModalVisible(false);
      const employeesData = await getEmployees();
      setEmployees(employeesData);
      toast.success("Employee added successfully");
    } catch (error) {
      toast.error("Failed to create employee.");
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();

    if (!selectedEmployee) return;

    const formErrors = validateEmployeeForm({
      firstName: firstName || selectedEmployee.first_name,
      lastName: lastName || selectedEmployee.last_name,
      email: email || selectedEmployee.email,
      contactNumber: contactNumber || selectedEmployee.contact_number,
      roleId: roleId || selectedEmployee.role_id,
      username: "", // Skip username validation for edit
      password: "", // Skip password validation for edit
      isEdit: true, // Indicate that this is an edit operation
    });

    setErrors(formErrors);

    if (Object.values(formErrors).some((error) => error !== "")) {
      toast.error("Please fill out all required fields correctly.");
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
      await updateEmployee(selectedEmployee.employee_id, formData);
      setIsModalVisible(false);
      const employeesData = await getEmployees();
      setEmployees(employeesData);
      toast.success("Employee updated successfully!");
    } catch (error) {
      toast.error("Failed to update employee.");
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setOriginalEmployeeData(employee);
    setFirstName(employee.first_name);
    setLastName(employee.last_name);
    setEmail(employee.email);
    setContactNumber(employee.contact_number);
    setRoleId(employee.role_id);
    setStatusId(employee.status_id);
    setIsModalVisible(true);
    setErrors({});
  };

  const handleColumnSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

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
        : !showArchived // Hide archived if checkbox is checked
          ? statuses.find((s) => s.status_id === employee.status_id)
              ?.description !== "Archived"
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
      <div className="flex flex-col">
        {/* Employees Title */}
        <strong className="text-3xl font-bold text-gray-500 mb-2">
          Employees
        </strong>

        {/* Filters Row and Add Button */}
        <div className="flex flex-wrap items-center gap-4 mb-0 justify-between">
          <div className="flex items-center gap-4">
            {/* Search Input with Clear Button */}
            <div className="flex items-center relative w-[300px]">
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="ml-2 text-pink-500 hover:text-pink-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Role Filter with Clear Button */}
            <div className="flex items-center relative w-[200px]">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
              >
                <option value="">All Roles</option>
                {roles.map((role) => (
                  <option key={role.role_id} value={role.role_id}>
                    {role.name}
                  </option>
                ))}
              </select>
              {selectedRole && (
                <button
                  onClick={() => setSelectedRole("")}
                  className="ml-2 text-pink-500 hover:text-pink-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Status Filter with Clear Button */}
            <div className="flex items-center relative w-[200px]">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
              >
                <option value="">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status.status_id} value={status.status_id}>
                    {status.description}
                  </option>
                ))}
              </select>
              {selectedStatus && (
                <button
                  onClick={() => setSelectedStatus("")}
                  className="ml-2 text-pink-500 hover:text-pink-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Checkbox for Show/Hide Archived */}
            {selectedStatus === "" && (
              <div className="flex items-center ml-4">
                <input
                  type="checkbox"
                  checked={showArchived}
                  onChange={(e) => setShowArchived(e.target.checked)}
                  className="h-5 w-5 accent-pink-500"
                />
                <label className="ml-2 font-semibold text-gray-700">
                  {showArchived ? "Hide Archived" : "Show Archived"}
                </label>
              </div>
            )}
          </div>

          {/* Add Employee Button */}
          <MdAddBox
            fontSize={40}
            className="text-gray-400 hover:text-pink-400 active:text-pink-500 cursor-pointer"
            onClick={() => {
              setSelectedEmployee(null);
              resetForm();
              setIsModalVisible(true);
            }}
          />
        </div>

        {/* Employee Table */}
        <EmployeeTable
          sortedEmployees={sortedEmployees}
          onEdit={handleEdit}
          onArchive={archiveEmployee}
          sortField={sortField}
          sortOrder={sortOrder}
          handleColumnSort={handleColumnSort}
          className="mt-2"
        />
      </div>

      <EmployeeForm
        isVisible={isModalVisible}
        handleCloseModal={handleCloseModal}
        handleUpdateEmployee={handleUpdateEmployee}
        handleAddEmployee={handleAddEmployee}
        handleInputChange={handleInputChange}
        isFormModified={isFormModified}
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
