import React, { Fragment } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import StockOutTable from "./StockOutTable"; // Adjust the import path as needed
import { Link } from "react-router-dom";

const StockOut = () => {
  return (
    <Fragment>
      <div className="flex flex-col">
        <strong className="text-3xl font-bold text-gray-500">Stock Out</strong>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col px-6 pt-4 w-full gap-2">
            {/* Reference Number */}
            <div className="flex flex-row justify-between items-center">
              <label className="font-bold w-[30%]" htmlFor="reference_number">
                Reference Number:
              </label>
              <input
                type="text"
                name="reference_number"
                id="reference_number"
                // value={referenceNumber}
                readOnly
                className="rounded-md border w-[85%] h-8 pl-4 bg-gray-50 border-slate-300 text-slate-700"
              />
            </div>
            {/* Transaction ID */}
            <div className="flex flex-row justify-between items-center">
              <label
                className="font-bold w-[30%]"
                htmlFor="order_transaction_id"
              >
                Order Transaction ID:
              </label>
              <input
                type="text"
                name="order_transaction_id"
                id="order_transaction_id"
                readOnly
                className="rounded-md border w-[85%] h-8 pl-4 bg-gray-50 border-slate-300 text-slate-700"
              />
            </div>
          </div>

          <div className="flex flex-col px-6 pt-4 w-full gap-2">
            {/* Employee Dropdown */}
            <div className="flex flex-row justify-between items-center">
              <label className="font-bold w-[30%]" htmlFor="employee">
                Employee:
              </label>
              <div className="relative w-[85%]">
                <select
                  id="employee"
                  name="employee"
                  className="w-full h-8 px-4 appearance-none border rounded-md bg-gray-50 hover:border-green-500 hover:bg-white border-slate-300 text-slate-700"
                >
                  <option value="">Select Employee</option>
                  {/* Dummy options */}
                  <option value="1">John Doe</option>
                  <option value="2">Jane Smith</option>
                </select>
                <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Stock Out Date */}
            <div className="flex flex-row justify-between items-center">
              <label className="font-bold w-[30%]" htmlFor="stock_out_date">
                Stock Out Date:
              </label>
              <input
                type="datetime-local"
                name="stock_out_date"
                id="stock_out_date"
                className="rounded-md border w-[85%] h-8 pl-4 bg-gray-50 hover:border-green-500 hover:bg-white border-slate-300 text-slate-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stock Out Table */}
      <StockOutTable />

      {/* Submit Button */}
      <div className="flex flex-row mt-4 gap-2">
        <button className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600">
          Save
        </button>

        <Link to="/stockouthistory">
          <button className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600">
            View History
          </button>
        </Link>
      </div>
    </Fragment>
  );
};

export default StockOut;
