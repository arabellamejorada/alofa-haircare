import React, { Fragment, useEffect, useState } from "react";
import DataTable from "../shared/DataTable";
import { MdAddBox } from "react-icons/md";
import Modal from "../modal/Modal";
import { IoMdArrowDropdown } from "react-icons/io";
import StockInTable from "./StockInTable";

const StockIn = () => {
  const columns = [
    { key: "var_ID", header: "Variation ID" },
    { key: "product_name", header: "Product Name" },
    { key: "quantity", header: "Qty." },
    { key: "stock_in_date", header: "Stock In Date" },
    { key: "supplier", header: "Supplier" },
  ];

  const varID = ["101", "102", "103"];

  const initialData = [
    {
      sku: 1234,
      product_name: "Name 1",
      stock_in_date: "2021-10-01",
      supplier: "Supplier 1",
    },
    {
      sku: 5678,
      product_name: "Name 2",
      stock_in_date: "2021-10-02",
      supplier: "Supplier 2",
    },
  ];

  return (
    <Fragment>
      <div className="flex flex-col">
        <strong className="text-3xl font-bold text-gray-500">Stock In</strong>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col px-6 pt-4 w-full gap-2">
            <div className="flex flex-row justify-between items-center">
              <label className="font-bold w-[30%]" htmlFor="reference_number">
                Reference Number:
              </label>
              <input
                type="text"
                name="reference_number"
                id="reference_number"
                placeholder="Product Name"
                className="rounded-md border w-[85%] h-8 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              />
            </div>

            <div className="flex flex-row justify-between items-center">
              <label className="font-bold w-[30%]" htmlFor="product_name">
                Employee:
              </label>
              <div className="relative w-[85%]">
                <select
                  id="supplier_name"
                  name="supplier_name"
                  className="w-full h-8 px-4 appearance-none border rounded-md bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                >
                  <option value="">Select Employee</option>
                </select>
                <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <label className="font-bold w-[30%]" htmlFor="product_name">
                Stock In Date:
              </label>
              <input
                type="date"
                name="product_date"
                id="product_date"
                placeholder="Product Date"
                className="rounded-md border w-[85%] h-8 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              />
            </div>
          </div>
          <div className="flex flex-col px-6 pt-4 w-full gap-2">
            <div className="flex flex-row justify-between items-center">
              <label className="font-bold w-[30%]" htmlFor="supplier_name">
                Supplier:
              </label>
              <div className="relative w-[85%]">
                <select
                  id="supplier_name"
                  name="supplier_name"
                  className="w-full h-8 px-4 appearance-none border rounded-md bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                >
                  <option value="">Select Supplier</option>
                </select>
                <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <label className="font-bold w-[30%]" htmlFor="contact_person">
                Contact Person:
              </label>
              <input
                type="text"
                name="contact_person"
                id="contact_person"
                placeholder="Product Name"
                className="rounded-md border w-[85%] h-8 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              />
            </div>
            <div className="flex flex-row justify-between items-center">
              <label className="font-bold w-[30%]" htmlFor="address">
                Address:
              </label>
              <input
                type="text"
                name="address"
                id="address"
                placeholder="Product Name"
                className="rounded-md border w-[85%] h-8 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              />
            </div>
          </div>
        </div>
      </div>

      <StockInTable initialData={initialData} columns={columns} varID={varID} />
    </Fragment>
  );
};

export default StockIn;
