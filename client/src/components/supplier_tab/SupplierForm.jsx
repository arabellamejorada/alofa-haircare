import React from "react";
import Modal from "../modal/Modal";
import { IoMdArrowDropdown } from "react-icons/io";

const SupplierForm = ({
  isVisible,
  handleCloseModal,
  selectedSupplier,
  handleUpdateSupplier,
  handleAddSupplier,
  handleInputChange,
  supplierFormData,
  isFormModified, // Add the prop for form modification check
  errors,
}) => {
  const {
    supplier_name,
    contact_person,
    contact_number,
    email,
    address,
    status,
  } = supplierFormData;

  return (
    <Modal isVisible={isVisible} onClose={handleCloseModal}>
      <form
        className="p-6"
        onSubmit={selectedSupplier ? handleUpdateSupplier : handleAddSupplier}
      >
        <div className="flex flex-col gap-4">
          <div className="font-extrabold text-3xl text-pink-400">
            {selectedSupplier ? "Edit Supplier" : "Register New Supplier"}
          </div>

          {/* Supplier Name */}
          <div className="flex flex-col gap-2">
            <label className="font-bold" htmlFor="supplier_name">
              Supplier Name:
            </label>
            <input
              type="text"
              name="supplier_name"
              id="supplier_name"
              placeholder="Supplier Name"
              value={supplier_name}
              onChange={handleInputChange}
              className={`rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700 ${
                errors.supplier_name ? "border-red-500" : ""
              }`}
            />
            {errors.supplier_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.supplier_name}
              </p>
            )}
          </div>

          {/* Contact Person */}
          <div className="flex flex-col gap-2">
            <label className="font-bold" htmlFor="contact_person">
              Contact Person:
            </label>
            <input
              type="text"
              name="contact_person"
              id="contact_person"
              placeholder="Contact Person"
              value={contact_person}
              onChange={handleInputChange}
              className={`rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700 ${
                errors.contact_person ? "border-red-500" : ""
              }`}
            />
            {errors.contact_person && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contact_person}
              </p>
            )}
          </div>

          {/* Contact Number */}
          <div className="flex flex-col gap-2">
            <label className="font-bold" htmlFor="contact_number">
              Contact Number:
            </label>
            <input
              type="text"
              name="contact_number"
              id="contact_number"
              placeholder="Contact Number"
              value={contact_number}
              onChange={handleInputChange}
              className={`rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700 ${
                errors.contact_number ? "border-red-500" : ""
              }`}
            />
            {errors.contact_number && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contact_number}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="font-bold" htmlFor="email">
              Email:
            </label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={handleInputChange}
              className={`rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Address */}
          <div className="flex flex-col gap-2">
            <label className="font-bold" htmlFor="address">
              Address:
            </label>
            <input
              type="text"
              name="address"
              id="address"
              placeholder="Address"
              value={address}
              onChange={handleInputChange}
              className={`rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700 ${
                errors.address ? "border-red-500" : ""
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          {/* Status */}
          <div className="flex flex-col gap-2">
            <label className="font-bold" htmlFor="status">
              Status:
            </label>
            <div className="relative">
              <select
                name="status"
                id="status"
                value={status}
                onChange={handleInputChange}
                className={`w-full h-10 px-4 appearance-none border rounded-xl bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700 ${
                  errors.status ? "border-red-500" : ""
                }`}
              >
                <option value="" disabled>
                  Select Status
                </option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
                <option value="Archived">Archived</option>
              </select>
              <IoMdArrowDropdown className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500" />
            </div>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status}</p>
            )}
          </div>

          {/* Save/Update Button */}
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={selectedSupplier && !isFormModified()} // Disable if no changes made
              className={`w-[10rem] text-center py-3 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 rounded-full font-semibold text-white ${
                selectedSupplier && !isFormModified()
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {selectedSupplier ? "Update" : "Save"}
            </button>
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

export default SupplierForm;
