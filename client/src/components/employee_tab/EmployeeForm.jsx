import React from "react";
import Modal from "../modal/Modal";
import { IoMdArrowDropdown } from "react-icons/io";

const EmployeeForm = ({
  isVisible,
  handleCloseModal,
  selectedEmployee,
  handleUpdateEmployee,
  handleAddEmployee,
  handleInputChange,
  isFormModified,
  firstName,
  lastName,
  email,
  contactNumber,
  roleId,
  roles,
  statusId,
  statuses,
  errors,
  setStatusId,
}) => {
  return (
    <Modal isVisible={isVisible} onClose={handleCloseModal}>
      <form
        className="p-6"
        onSubmit={selectedEmployee ? handleUpdateEmployee : handleAddEmployee}
      >
        <div className="flex flex-col gap-4">
          <div className="font-extrabold text-3xl text-alofa-highlight">
            {selectedEmployee ? "Edit Employee" : "Register New Employee"}
          </div>

          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="font-bold" htmlFor="employee_first_name">
              Employee Name:
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="flex flex-col w-full">
                  <input
                    type="text"
                    name="employee_first_name"
                    id="employee_first_name"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => handleInputChange(e, "firstName")}
                    className={`rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-alofa-pink hover:bg-white border-slate-300 text-slate-700 ${
                      errors.firstName ? "border-red-500" : ""
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className="flex flex-col w-full">
                  <input
                    type="text"
                    name="employee_last_name"
                    id="employee_last_name"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => handleInputChange(e, "lastName")}
                    className={`rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-alofa-pink hover:bg-white border-slate-300 text-slate-700 ${
                      errors.lastName ? "border-red-500" : ""
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="employee_email">
                Email:
              </label>
              <input
                type="email"
                name="employee_email"
                id="employee_email"
                placeholder="Email"
                value={email}
                onChange={(e) => handleInputChange(e, "email")}
                className={`rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-alofa-pink hover:bg-white border-slate-300 text-slate-700 ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Contact Number */}
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
                onChange={(e) => handleInputChange(e, "contactNumber")}
                className={`rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-alofa-pink hover:bg-white border-slate-300 text-slate-700 ${
                  errors.contactNumber ? "border-red-500" : ""
                }`}
              />
              {errors.contactNumber && (
                <p className="text-red-500 text-sm">{errors.contactNumber}</p>
              )}
            </div>
          </div>

          {/* Role */}
          <div className="flex flex-col gap-2">
            <label className="font-bold" htmlFor="roleId">
              Position:
            </label>
            <div className="relative">
              <select
                id="roleId"
                name="roleId"
                value={roleId}
                onChange={(e) => handleInputChange(e, "roleId")}
                className={`w-full h-10 px-4 appearance-none border rounded-xl bg-gray-50 hover:border-alofa-pink hover:bg-white border-slate-300 text-slate-700 ${
                  errors.roleId ? "border-red-500" : ""
                }`}
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
            {errors.roleId && (
              <p className="text-red-500 text-sm mt-1">{errors.roleId}</p>
            )}
          </div>

          {/* Status Dropdown for Edit Modal */}
          {selectedEmployee && (
            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="statusId">
                Status:
              </label>
              <div className="relative">
                <select
                  name="statusId"
                  id="statusId"
                  value={statusId}
                  onChange={(e) => setStatusId(e.target.value)}
                  className="w-full h-10 px-4 appearance-none border rounded-xl bg-gray-50 hover:border-alofa-pink hover:bg-white border-slate-300 text-slate-700"
                >
                  <option value="" disabled>
                    Select Status
                  </option>
                  {statuses.map((status) => (
                    <option key={status.status_id} value={status.status_id}>
                      {status.description}
                    </option>
                  ))}
                </select>
                <IoMdArrowDropdown className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          )}

          {/* Save/Update and Cancel Buttons */}
          <div className="flex justify-between mt-2">
            {/* Save/Update Button */}
            <button
              type="submit"
              disabled={!isFormModified()}
              className={`w-[10rem] text-center py-3 bg-alofa-highlight hover:bg-alofa-pink active:bg-alofa-dark rounded-full font-semibold text-white ${
                !isFormModified() ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {selectedEmployee ? "Update" : "Save"}
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="w-[10rem] text-center py-3 bg-gray-400 hover:bg-gray-500 active:bg-gray-600 rounded-full font-semibold text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EmployeeForm;
