import React, { useState } from "react";
import Modal from "../modal/Modal";
import { IoMdArrowDropdown } from "react-icons/io";

const VoucherModal = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  voucherData,
  setVoucherData,
  selectedVoucher,
  errors,
  setErrors,
}) => {
  const [previousMaxDiscount, setPreviousMaxDiscount] = useState("");

  // Format date to yyyy-mm-dd
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleInputChange = (e) => {
    console.log(errors, setErrors);

    const { name, value } = e.target;

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));

    if (name === "type") {
      if (value === "flat") {
        // Save current max_discount to previousMaxDiscount before clearing it
        setPreviousMaxDiscount(voucherData.max_discount);
        setVoucherData((prevData) => ({
          ...prevData,
          [name]: value,
          max_discount: "", // Clear max_discount when type is flat
        }));
      } else if (value === "percentage") {
        // Restore max_discount from previousMaxDiscount if switching back to percentage
        setVoucherData((prevData) => ({
          ...prevData,
          [name]: value,
          max_discount: previousMaxDiscount || "", // Restore or keep empty
        }));

        if (name === "discount_value") {
          if (value < 0 || value > 100) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              discount_value: "Percentage must be between 0 and 100",
            }));
          }
        }
      }
    } else {
      setVoucherData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  return (
    <Modal isVisible={isOpen} onClose={onClose}>
      <form className="p-6" onSubmit={onSubmit}>
        <div className="font-extrabold text-3xl text-alofa-highlight mb-4">
          {selectedVoucher ? "Edit Voucher" : "Add New Voucher"}
        </div>

        {/* Code Input */}
        <div className="relative w-full mb-4">
          <input
            type="text"
            name="code"
            id="code"
            value={voucherData.code}
            onChange={handleInputChange}
            className="block w-full px-3 pb-2 pt-4 text-base 
                text-gray-900 bg-transparent rounded-lg border 
                border-gray-300 appearance-none focus:outline-none 
                focus:ring-0 focus:border-alofa-pink peer"
            placeholder=" "
          />
          <label
            htmlFor="code"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
          >
            Code
          </label>
          {errors.code && (
            <p className="text-red-500 text-sm mt-1">{errors.code}</p>
          )}
        </div>

        {/* Two-Column Layout for Other Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Type Input */}
          <div className="relative w-full">
            <select
              name="type"
              id="type"
              value={voucherData.type}
              onChange={handleInputChange}
              className="block w-full px-3 pb-2 pt-4 text-base 
                  text-gray-900 bg-transparent rounded-lg border 
                  border-gray-300 appearance-none focus:outline-none 
                  focus:ring-0 focus:border-alofa-pink peer"
            >
              <option value="">Select Type</option>
              <option value="percentage">Percentage</option>
              <option value="flat">Flat</option>
            </select>
            <IoMdArrowDropdown className="absolute right-2 top-5 text-gray-500" />
            <label
              htmlFor="type"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Type
            </label>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type}</p>
            )}
          </div>

          {/* Discount Value Input */}
          <div className="relative w-full">
            <input
              type="number"
              name="discount_value"
              id="discount_value"
              value={voucherData.discount_value}
              onChange={handleInputChange}
              className="block w-full px-3 pb-2 pt-4 text-base 
                  text-gray-900 bg-transparent rounded-lg border 
                  border-gray-300 appearance-none focus:outline-none 
                  focus:ring-0 focus:border-alofa-pink peer"
              min="0"
              max={voucherData.type === "percentage" ? "100" : undefined}
              placeholder=""
            />
            <label
              htmlFor="discount_value"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              {voucherData.type === "percentage"
                ? "Discount Value(%)"
                : "Discount Value(₱)"}
            </label>
            {errors.discount_value && (
              <p className="text-red-500 text-sm mt-1">
                {errors.discount_value}
              </p>
            )}
          </div>

          {/* Min Spend Input */}
          <div className="relative w-full">
            <input
              type="number"
              name="min_spend"
              id="min_spend"
              value={voucherData.min_spend}
              onChange={handleInputChange}
              className="block w-full px-3 pb-2 pt-4 text-base 
                  text-gray-900 bg-transparent rounded-lg border 
                  border-gray-300 appearance-none focus:outline-none 
                  focus:ring-0 focus:border-alofa-pink peer"
              min="0"
              placeholder=" "
            />
            <label
              htmlFor="min_spend"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Min. Spend(₱)
            </label>
            {errors.min_spend && (
              <p className="text-red-500 text-sm mt-1">{errors.min_spend}</p>
            )}
          </div>

          {/* Max Discount Input - Hidden for Flat Type */}
          {voucherData.type !== "flat" && (
            <div className="relative w-full">
              <input
                type="number"
                name="max_discount"
                id="max_discount"
                value={voucherData.max_discount}
                onChange={handleInputChange}
                className="block w-full px-3 pb-2 pt-4 text-base 
                    text-gray-900 bg-transparent rounded-lg border 
                    border-gray-300 appearance-none focus:outline-none 
                    focus:ring-0 focus:border-alofa-pink peer"
                min="0"
                placeholder=" "
              />
              <label
                htmlFor="max_discount"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Max Discount(₱)
              </label>
              {errors.max_discount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.max_discount}
                </p>
              )}
            </div>
          )}

          {/* Total Limit Input */}
          <div className="relative w-full">
            <input
              type="number"
              name="total_limit"
              id="total_limit"
              value={voucherData.total_limit}
              onChange={handleInputChange}
              className="block w-full px-3 pb-2 pt-4 text-base 
                  text-gray-900 bg-transparent rounded-lg border 
                  border-gray-300 appearance-none focus:outline-none 
                  focus:ring-0 focus:border-alofa-pink peer"
              min="0"
              placeholder=" "
            />
            <label
              htmlFor="total_limit"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Usage Limit
            </label>
            {errors.total_limit && (
              <p className="text-red-500 text-sm mt-1">{errors.total_limit}</p>
            )}
          </div>

          {/* Max Use Per User Input */}
          <div className="relative w-full">
            <input
              type="number"
              name="max_use_per_user"
              id="max_use_per_user"
              value={voucherData.max_use_per_user}
              onChange={handleInputChange}
              className="block w-full px-3 pb-2 pt-4 text-base 
                  text-gray-900 bg-transparent rounded-lg border 
                  border-gray-300 appearance-none focus:outline-none 
                  focus:ring-0 focus:border-alofa-pink peer"
              min="0"
              placeholder=" "
            />
            <label
              htmlFor="max_use_per_user"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Max. Use Per User
            </label>
            {errors.max_use_per_user && (
              <p className="text-red-500 text-sm mt-1">
                {errors.max_use_per_user}
              </p>
            )}
          </div>

          {/* Is Active Input */}
          {/* <div className="relative w-full">
            <select
              name="is_active"
              id="is_active"
              value={voucherData.is_active}
              onChange={handleInputChange}
              className="block w-full px-3 pb-2 pt-4 text-base 
                  text-gray-900 bg-transparent rounded-lg border 
                  border-gray-300 appearance-none focus:outline-none 
                  focus:ring-0 focus:border-alofa-pink peer"
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
            <label
              htmlFor="is_active"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Is Active
            </label>
          </div> */}

          {/* Valid From */}
          <div className="relative w-full">
            <input
              type="date"
              name="valid_from"
              id="valid_from"
              value={formatDateForInput(voucherData.valid_from)}
              onChange={handleInputChange}
              className="block w-full px-3 pb-2 pt-4 text-base 
                  text-gray-900 bg-transparent rounded-lg border 
                  border-gray-300 appearance-none focus:outline-none 
                  focus:ring-0 focus:border-alofa-pink peer"
            />
            <label
              htmlFor="valid_from"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Valid From
            </label>
            {errors.valid_from && (
              <p className="text-red-500 text-sm mt-1">{errors.valid_from}</p>
            )}
          </div>

          {/* Valid Until */}
          <div className="relative w-full">
            <input
              type="date"
              name="valid_until"
              id="valid_until"
              value={formatDateForInput(voucherData.valid_until)}
              onChange={handleInputChange}
              className="block w-full px-3 pb-2 pt-4 text-base 
                  text-gray-900 bg-transparent rounded-lg border 
                  border-gray-300 appearance-none focus:outline-none 
                  focus:ring-0 focus:border-alofa-pink peer"
            />
            <label
              htmlFor="valid_until"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Valid Until
            </label>
            {errors.valid_until && (
              <p className="text-red-500 text-sm mt-1">{errors.valid_until}</p>
            )}
          </div>

          <div className="relative w-full">
            {/* Discount Scope Dropdown */}
            <select
              name="discount_scope"
              id="discount_scope"
              value={voucherData.discount_scope}
              onChange={handleInputChange}
              className="block w-full px-3 pb-2 pt-4 text-base 
                text-gray-900 bg-transparent rounded-lg border 
                border-gray-300 appearance-none focus:outline-none 
                focus:ring-0 focus:border-alofa-pink peer"
            >
              <option value="">Select Discount Scope</option>
              <option value="total">Total Amount</option>
              <option value="product_variation">Product Variation</option>
            </select>
            <IoMdArrowDropdown className="absolute right-2 top-5 text-gray-500" />
            <label
              htmlFor="discount_scope"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-alofa-pink peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Discount Scope
            </label>
            {errors.discount_scope && (
              <p className="text-red-500 text-sm mt-1">
                {errors.discount_scope}
              </p>
            )}
          </div>
        </div>

        {/* Submit & Cancel % Delete Buttons */}
        <div className="flex flex-row justify-end gap-4 mt-6">
          {/* Only show Delete if it's an existing voucher */}
          {selectedVoucher && (
            <button
              type="button"
              onClick={onDelete}
              className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              Delete Voucher
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 text-white bg-alofa-highlight rounded-lg hover:bg-alofa-pink"
          >
            {selectedVoucher ? "Update Voucher" : "Add Voucher"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-white bg-gray-400 rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default VoucherModal;
