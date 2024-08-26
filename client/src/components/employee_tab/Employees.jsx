import React, { Fragment, useEffect, useState } from "react";
import DataTable from "../shared/DataTable";
import { MdAddBox } from "react-icons/md";
import Modal from "../modal/Modal";
import { IoMdArrowDropdown } from "react-icons/io";
import { getEmployees, getRoles, createEmployee } from "../../api/employees";
// import { Link } from "react-router-dom";

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

      const emoployeesData = await getEmployees();
      setEmployees(emoployeesData);
    } catch (error) {
      console.error("Error creating employee: ", error);
    }
  };

  const columns = [
    { key: "employee_id", header: "ID" },
    { key: "first_name", header: "First Name" },
    { key: "last_name", header: "Last Name" },
    { key: "email", header: "Email" },
    { key: "contact_number", header: "Contact Number" },
    { key: "role_name", header: "Role" },
    { key: "status", header: "Status" },
  ];

  if (error) return <div>{error}</div>;

  const roleMap = roles.reduce((acc, role) => {
    acc[role.role_id] = role.name;
    return acc;
  }, {});

  const processedEmployee = employees.map((item) => ({
    ...item,
    role_name: roleMap[item.role_id],
  }));

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedEmployee(null);
  };

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
        />
      </div>

      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <form className="p-6" onSubmit={handleAddEmployee}>
          <div className="flex flex-col gap-4">
            <div className="font-extrabold text-3xl text-pink-400">
              Register New Employee:
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="employee">
                Employee Name:
              </label>
              <div className="flex flex-row gap-2">
                <input
                  type="text"
                  name="employee_first_name"
                  id="employee_last_name"
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
              <label className="font-bold" htmlFor="Position">
                Position:
              </label>
              <div className="relative">
                <select
                  class="w-full h-10 px-4 appearance-none forced-colors:appearance-auto border row-start-1 col-start-1 rounded-xl bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                >
                  <option value="" disabled hidden>
                    {" "}
                    Position{" "}
                  </option>
                  {roles.map((role) => (
                    <option key={role.role_id} value={role.role_id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <IoMdArrowDropdown className="absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="employee_username">
                  Username:
                </label>
                <input
                  type="text"
                  name="employee_username"
                  id="employee_username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="rounded-xl border w-full h-10 pl-4 bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="employee_password">
                  Password:
                </label>
                <input
                  type="text"
                  name="employee_password"
                  id="employee_password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl border w-full h-10 pl-4 bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-between mt-4">
                <button
                  type="submit"
                  className="w-[10rem] text-center py-3 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 rounded-full font-semibold text-white"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-[10rem] text-center py-3 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 rounded-full font-extrabold text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isVisible={isModalVisible} onClose={handleCloseModal}>
        <form className="p-6">
          {selectedEmployee && (
            <div className="flex flex-col gap-4">
              <div className="font-extrabold text-3xl text-pink-400">
                Edit Employee Details:
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="edit_employee">
                  Edit Employee Name:
                </label>
                <div className="flex flex-row gap-2">
                  <input
                    type="text"
                    name="edit_employee_first_name"
                    id="edit_employee_last_name"
                    placeholder={selectedEmployee.first_name}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700 dark:text-slate-200"
                  />
                  <input
                    type="text"
                    name="employee_last_name"
                    id="employee_last_name"
                    placeholder={selectedEmployee.last_name}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-bold" htmlFor="edit_employee_email">
                    Edit Employee Email:
                  </label>
                  <input
                    type="text"
                    name="edit_employee_email"
                    id="edit_employee_email"
                    placeholder={selectedEmployee.email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl border w-full h-10 pl-4 bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-bold" htmlFor="edit_contact_number">
                    Edit Contact Number:
                  </label>
                  <input
                    type="text"
                    name="edit_contact_number"
                    id="edit_contact_number"
                    placeholder={selectedEmployee.contact_number}
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="rounded-xl border w-full h-10 pl-4 bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="edit_position">
                  Edit Position:
                </label>
                <div class="relative">
                  <select
                    class="w-full h-10 px-4 appearance-none forced-colors:appearance-auto border row-start-1 col-start-1 rounded-xl bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                    placeholder={selectedEmployee.roleId}
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                  >
                    <option value="" disabled hidden>
                      {" "}
                      Position{" "}
                    </option>
                    {roles.map((role) => (
                      <option key={role.role_id} value={role.role_id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  <IoMdArrowDropdown className="absolute right-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-bold" htmlFor="edit_employee_username">
                    Edit Employee Username:
                  </label>
                  <input
                    type="text"
                    name="edit_employee_username"
                    id="edit_employee_username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="rounded-xl border w-full h-10 pl-4 bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-bold" htmlFor="edit_employee_password">
                    Edit Employee Password:
                  </label>
                  <input
                    type="text"
                    name="edit_employee_password"
                    id="edit_employee_password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl border w-full h-10 pl-4 bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between mt-4">
                  <button
                    type="submit"
                    className="w-[10rem] text-center py-3 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 rounded-full font-semibold text-white"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCloseModal(false)}
                    className="w-[10rem] text-center py-3 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 rounded-full font-extrabold text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </Modal>
    </Fragment>
  );
};

export default Employees;
