import React, { Fragment, useState } from "react";
import DataTable from "../shared/DataTable";
import { MdAddBox } from "react-icons/md";
import Modal from "../modal/Modal";
import { IoMdArrowDropdown } from "react-icons/io";
// import { Link } from "react-router-dom";

const sampleData = [
  {
    id: "1",
    name: "Product 1",
    description: "Product 1 Description",
    unit_price: "₱100.00",
    status: "AVAILABLE",
    category: "Category 1",
  },
  {
    id: "2",
    name: "Product 2",
    description: "Product 2 Description",
    unit_price: "₱200.00",
    status: "OUT OF STOCK",
    category: "Category 2",
  },
];

export default function Products() {
  const [showModal, setShowModal] = useState(false);

  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <strong className="text-3xl font-bold text-gray-500">Products</strong>
          <div>
            <MdAddBox
              fontSize={30}
              className="text-gray-400 mx-2 hover:text-pink-400 active:text-pink-500"
              onClick={() => setShowModal(true)}
            />
          </div>
        </div>

        {/* Render Table with data*/}
        <DataTable data={sampleData} />
      </div>

      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <form className="p-6">
          <div className="flex flex-col gap-4">
            <div className="font-extrabold text-3xl text-pink-400">
              Add New Product:
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="product_name">
                Product Name:
              </label>
              <input
                type="text"
                name="product_name"
                id="product_name"
                placeholder="Product Name"
                className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700 dark:text-slate-200"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="category">
                Category:
              </label>
              <div class="grid">
                <svg
                  class="pointer-events-none z-10 right-1 relative col-start-1 row-start-1 h-4 w-4 self-center justify-self-end forced-colors:hidden"
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
                  <option></option>
                  <option>Hair Oil</option>
                  <option>Comb</option>
                  <option>Hair Clip</option>
                  <IoMdArrowDropdown />
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="product_description">
                  Description:
                </label>
                <input
                  type="text"
                  name="product_description"
                  id="product_description"
                  placeholder="Product Description"
                  className="rounded-xl border w-full h-10 pl-4 bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="product_price">
                  Price per unit:
                </label>
                <input
                  type="text"
                  name="product_price"
                  id="product_price"
                  placeholder="₱0.00"
                  className="rounded-xl border w-full h-10 pl-4 bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>

            {/* <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="availability">
                Availability:
              </label>
              <div className="grid">
                <svg
                  className="pointer-events-none z-10 right-1 relative col-start-1 row-start-1 h-4 w-4 self-center justify-self-end forced-colors:hidden"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <select className="w-full h-10 px-4 appearance-none forced-colors:appearance-auto border row-start-1 col-start-1 rounded-xl bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200">
                  <option>Available</option>
                  <option>Out of Stock</option>
                  <option>Discontinued</option>
                  <IoMdArrowDropdown />
                </select>
              </div>
            </div> */}

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="product_image">
                Product Image:
              </label>
              <input
                type="file"
                name="product_image"
                id="product_image"
                accept="image/*"
              />
            </div>

            <div className="flex flex-row justify-between mt-4 w-full h-full">
              <div className="w-[10rem] text-center py-3 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 rounded-full font-semibold text-white">
                Add
              </div>
              <div className="w-[10rem] text-center py-3 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 rounded-full font-extrabold text-white">
                Cancel
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </Fragment>
  );
}
