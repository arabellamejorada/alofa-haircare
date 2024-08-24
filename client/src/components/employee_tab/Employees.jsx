import React, { Fragment, useEffect, useState } from "react";
import DataTable from "../shared/DataTable";
import { MdAddBox } from "react-icons/md";
import Modal from "../modal/Modal";
import { IoMdArrowDropdown } from "react-icons/io";
import { getEmployees, getRoles } from "../../api/employees";
// import { Link } from "react-router-dom";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesData = await getEmployees();
        const rolesData = await getRoles();
        setEmployees(employeesData);
        setRoles(rolesData);
      } catch (err) {
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  const columns = [
    { key: "employee_id", header: "ID" },
    { key: "first_name", header: "First Name" },
    { key: "last_name", header: "Last Name" },
    { key: "email", header: "Email" },
    { key: "contact_number", header: "Contact Number" },
    { key: "status", header: "Status" },
    { key: "role_name", header: "Role" },
  ];

  if (error) return <div>{error}</div>;

  // Map product IDs to names
  const roleMap = roles.reduce((acc, role) => {
    acc[role.role_id] = role.name;
    return acc;
  }, {});

  // Process inventory data to include product names
  const processedEmployee = employees.map((item) => ({
    ...item,
    role_name: roleMap[item.role_id], // Ensure product_id is correctly mapped
  }));

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
        <DataTable data={processedEmployee} columns={columns} />
      </div>

      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <form className="p-6">
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
                  className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700 dark:text-slate-200"
                />
                <input
                  type="text"
                  name="employee_last_name"
                  id="employee_last_name"
                  placeholder="Last Name"
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
                  className="rounded-xl border w-full h-10 pl-4 bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="Position">
                Position:
              </label>
              <div class="grid">
                <svg
                  class="pointer-events-none z-10 right-1 relative col-start-1 row-start-1 h-4 w-4 self-center justify-self-end forced-colors:hidden mr-2"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <select class="w-full h-10 px-4 appearance-none forced-colors:appearance-auto border row-start-1 col-start-1 rounded-xl bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200">
                  <option value="" disabled selected hidden>
                    Position
                  </option>
                  <option>Admin</option>
                  <option>Employee</option>
                  <IoMdArrowDropdown />
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="employee_status">
                Status:
              </label>
              <div class="grid">
                <svg
                  class="pointer-events-none z-10 right-1 relative col-start-1 row-start-1 h-4 w-4 self-center justify-self-end forced-colors:hidden mr-2"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <select class="w-full h-10 px-4 appearance-none forced-colors:appearance-auto border row-start-1 col-start-1 rounded-xl bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200">
                  <option value="" disabled selected hidden>
                    Select Status
                  </option>
                  <option>Active</option>
                  <option>Fired</option>
                  <IoMdArrowDropdown />
                </select>
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
                  className="rounded-xl border w-full h-10 pl-4 bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="employee_status">
                Status:
              </label>
              <div class="grid">
                <svg
                  class="pointer-events-none z-10 right-1 relative col-start-1 row-start-1 h-4 w-4 self-center justify-self-end forced-colors:hidden mr-2"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <select class="w-full h-10 px-4 appearance-none forced-colors:appearance-auto border row-start-1 col-start-1 rounded-xl bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200">
                  <option value="" disabled selected hidden>
                    Select Status
                  </option>
                  <option>Active</option>
                  <option>Fired</option>
                  <IoMdArrowDropdown />
                </select>
              </div>
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
    </Fragment>
  );
};

export default Employees;
