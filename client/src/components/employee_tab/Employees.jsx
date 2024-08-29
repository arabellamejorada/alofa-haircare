import React, { Fragment, useEffect, useState } from "react";
import DataTable from "../shared/DataTable";
import { MdAddBox } from "react-icons/md";
import Modal from "../modal/Modal";
import { IoMdArrowDropdown } from "react-icons/io";
import {
  getEmployees,
  getRoles,
  createEmployee,
  updateEmployee,
  archiveEmployee,
} from "../../api/employees";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [roleId, setRoleId] = useState("");
  const [status, setEmployeeStatus] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesData = await getEmployees();
        let rolesData = await getRoles();

        rolesData = rolesData.filter(
          (role) => role.name === "Admin" || role.name === "Employee"
        );

        setEmployees(employeesData);
        setRoles(rolesData);
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

  const handleAddEmployee = async (e) => {
    e.preventDefault();

    const newEmployee = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      contact_number: contactNumber,
      role_id: roleId,
      username: username,
      password: password,
    };

    try {
      const response = await createEmployee(newEmployee);
      console.log(response);
      setShowModal(false);

      const employeesData = await getEmployees();
      setEmployees(employeesData);
    } catch (error) {
      console.error("Error creating employee: ", error);
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();

    if (!selectedEmployee) return;

    const formData = new FormData();
    formData.append("first_name", firstName || selectedEmployee.first_name);
    formData.append("last_name", lastName || selectedEmployee.last_name);
    formData.append("email", email || selectedEmployee.email);
    formData.append(
      "contact_number",
      contactNumber || selectedEmployee.contact_number
    );
    formData.append("role_id", roleId || selectedEmployee.role_id);
    formData.append("status", status || selectedEmployee.status);

    try {
      const response = await updateEmployee(
        selectedEmployee.employee_id,
        formData
      );
      console.log(response);
      setIsModalVisible(false);

      const employeesData = await getEmployees();
      setEmployees(employeesData);
    } catch (error) {
      console.error("Error updating employee: ", error);
      setError("Failed to update employee");
    }
  };

  const handleArchiveEmployee = async (selectedEmployee) => {
    if (!selectedEmployee) return;
  
    const isConfirmed = window.confirm("Are you sure you want to archive this employee?");
    if (!isConfirmed) return;
  
    const data = {
      status: "Archived"
    };
  
    try {
      console.log("Archiving employee: ", selectedEmployee.employee_id);
      const response = await archiveEmployee(
        selectedEmployee.employee_id,
        data
      );
      console.log(response);
  
      // Optionally refresh the employees list
      const employeesData = await getEmployees();
      setEmployees(employeesData);
    } catch (error) {
      console.error("Error archiving employee: ", error);
      setError("Failed to update employee status to Archived");
    }
  };
  
  
  
  const handleEdit = (employee) => {
    console.log("Selected Employee:", employee); // Check if employee data is correct

    setSelectedEmployee(employee);
    setFirstName(employee.first_name);
    setLastName(employee.last_name);
    setEmail(employee.email);
    setContactNumber(employee.contact_number);
    setRoleId(employee.role_id);
    setEmployeeStatus(employee.status);

    setIsModalVisible(true);
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
    { key: "status", header: "Status" }
  ];

  if (error) return <div>{error}</div>;

  const roleMap = roles.reduce((acc, role) => {
    acc[role.role_id] = role.name;
    return acc;
  }, {});

  const processedEmployee = employees
  .map((item) => ({
    ...item,
    role_name: roleMap[item.role_id],
  }))
  .sort((a, b) => {
    // Move archived employees to the end
    if (a.status === 'Archived' && b.status !== 'Archived') return 1;
    if (a.status !== 'Archived' && b.status === 'Archived') return -1;
    return 0;
  });


  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <strong className="text-3xl font-bold text-gray-500">
            Employees
          </strong>
          <div>
            <MdAddBox
              fontSize={30}
              className="text-gray-400 mx-2 hover:text-pink-400 active:text-pink-500"
              onClick={() => setShowModal(true)}
            />
          </div>
        </div>

        {/* Render Table with data*/}
        <DataTable
          data={processedEmployee}
          columns={columns}
          onEdit={handleEdit}
          onArchive={handleArchiveEmployee}
        />
      </div>

      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <form className="p-6" onSubmit={handleAddEmployee}>
          <div className="flex flex-col gap-4">
            <div className="font-extrabold text-3xl text-pink-400">
              Register New Employee:
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="employee_first_name">
                Employee Name:
              </label>
              <div className="flex flex-row gap-2">
                <input
                  type="text"
                  name="employee_first_name"
                  id="employee_first_name"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700 dark:text-slate-200"
                />
                <input
                  type="text"
                  name="employee_last_name"
                  id="employee_last_name"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="employee_email">
                  Email:
                </label>
                <input
                  type="text"
                  name="employee_email"
                  id="employee_email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border w-full h-10 pl-4 bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="contact_number">
                  Contact Number:
                </label>
                <input
                  type="text"
                  name="contact_number"
                  id="contact_number"
                  placeholder="Contact Number"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="rounded-xl border w-full h-10 pl-4 bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="roleId">
                Position:
              </label>
              <div className="relative">
                <select
                  id="roleId"
                  name="roleId"
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  className="w-full h-10 px-4 appearance-none border rounded-xl bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  {roles.map((role) => (
                    <option key={role.role_id} value={role.role_id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <IoMdArrowDropdown className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="username">
                Username:
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-xl border w-full h-10 pl-4 bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="password">
                Password:
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border w-full h-10 pl-4 bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-pink-500 text-white rounded-xl"
              >
                Add
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal isVisible={isModalVisible} onClose={handleCloseModal}>
        <form className="p-6" onSubmit={handleUpdateEmployee}>
          <div className="flex flex-col gap-4">
            <div className="font-extrabold text-3xl text-pink-400">
              Edit Employee:
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="employee_first_name">
                Employee Name:
              </label>
              <div className="flex flex-row gap-2">
                <input
                  type="text"
                  name="employee_first_name"
                  id="employee_first_name"
                  placeholder={selectedEmployee?.first_name || "First Name"}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                />
                <input
                  type="text"
                  name="employee_last_name"
                  id="employee_last_name"
                  placeholder={selectedEmployee?.last_name || "Last Name"}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="employee_email">
                  Email:
                </label>
                <input
                  type="text"
                  name="employee_email"
                  id="employee_email"
                  placeholder={selectedEmployee?.email || "Email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="contact_number">
                  Contact Number:
                </label>
                <input
                  type="text"
                  name="contact_number"
                  id="contact_number"
                  placeholder={
                    selectedEmployee?.contact_number || "Contact Number"
                  }
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="roleId">
                Position:
              </label>
              <div className="relative">
                <select
                  id="roleId"
                  name="roleId"
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  className="w-full h-10 px-4 appearance-none border rounded-xl bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  {roles.map((role) => (
                    <option key={role.role_id} value={role.role_id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <IoMdArrowDropdown className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="status">
                Status:
              </label>
              <div className="relative">
                <select
                  name="status"
                  id="status"
                  value={status}
                  onChange={(e) => setEmployeeStatus(e.target.value)}
                  className="w-full h-10 px-4 appearance-none border rounded-xl bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Terminated">Terminated</option>
                  <option value="Archived">Archived</option>
                </select>
                <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="w-[10rem] text-center py-3 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 rounded-full font-semibold text-white"
              >
                Update
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </Fragment>
  );
};

export default Employees;
