import React, { useEffect, useState } from "react";
import { MdAddBox } from "react-icons/md";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import {
  getEmployees,
  getRoles,
  createEmployee,
  updateEmployee,
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
  const [loading, setLoading] = useState(false);
  const [originalEmployeeData, setOriginalEmployeeData] = useState(null);

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

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
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
    setOriginalEmployeeData(null); // Reset original data
    setSelectedEmployee(null);
    setErrors({});
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
    });

    setErrors(formErrors);

    if (Object.values(formErrors).some((error) => error !== "")) {
      toast.error("Please fill out all required fields correctly.");
      return;
    }

    try {
      setLoading(true);

      // Prepare the employee data
      const newEmployee = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        contact_number: contactNumber,
        role_id: roleId,
        status_id: 1,
        password: "12345678",
      };

      // Send the data to your backend to create the employee and user in Supabase Auth
      await createEmployee(newEmployee);

      setIsModalVisible(false);
      const employeesData = await getEmployees();
      setEmployees(employeesData);
      toast.success("Employee added successfully");
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Failed to create employee.");
    } finally {
      setLoading(false);
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
      isEdit: true, // Indicate that this is an edit operation
    });

    setErrors(formErrors);

    if (Object.values(formErrors).some((error) => error !== "")) {
      toast.error("Please fill out all required fields correctly.");
      return;
    }

    const updatedEmployee = {
      first_name: firstName || selectedEmployee.first_name,
      last_name: lastName || selectedEmployee.last_name,
      email: email || selectedEmployee.email,
      contact_number: contactNumber || selectedEmployee.contact_number,
      role_id: roleId || selectedEmployee.role_id,
      status_id: statusId || selectedEmployee.status_id,
    };

    try {
      setLoading(true);
      await updateEmployee(selectedEmployee.employee_id, updatedEmployee);
      setIsModalVisible(false);
      const employeesData = await getEmployees();
      setEmployees(employeesData);
      toast.success("Employee updated successfully!");
    } catch (error) {
      toast.error("Failed to update employee.");
    } finally {
      setLoading(false);
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
    <div className="relative">
      {loading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
          <ClipLoader size={50} color="#E53E3E" loading={loading} />
        </div>
      )}
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
          roles={roles}
          statuses={statuses}
          errors={errors}
        />
      </div>
    </div>
  );
};

export default Employees;
