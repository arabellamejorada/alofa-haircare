import React, { Fragment, useState, useEffect } from "react";
import DataTable from "../shared/DataTable";
import { getInventory, getProducts } from "../../api/products";
import { MdAddBox } from "react-icons/md";
import Modal from "../modal/Modal";
import { IoMdArrowDropdown } from "react-icons/io";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inventoryData = await getInventory();
        const productsData = await getProducts();
        setInventory(inventoryData);
        setProducts(productsData);
      } catch (err) {
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  const columns = [
    { key: "inventory_id", header: "ID" },
    { key: "product_name", header: "Product Name" },
    { key: "stock_quantity", header: "Stock Quantity" },
    { key: "stock_in_date", header: "Stock In Date" },
  ];

  if (error) return <div>{error}</div>;

  // Map product IDs to names
  const productMap = products.reduce((acc, product) => {
    acc[product.product_id] = product.name;
    return acc;
  }, {});

  // Process inventory data to include product names
  const processedInventory = inventory.map((item) => ({
    ...item,
    product_name: productMap[item.product_id], // Ensure product_id is correctly mapped
  }));

  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <strong className="text-3xl font-bold text-gray-500">
            Inventory
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
        <DataTable data={processedInventory} columns={columns} />
      </div>

      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <form className="p-6">
          <div className="flex flex-col gap-4">
            <div className="font-extrabold text-3xl text-pink-400">
              Add Stock:
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="product_name">
                Product:
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
                <label className="font-bold" htmlFor="add_stock">
                  Number of New Stock:
                </label>
                <input
                  type="number"
                  name="add_stock"
                  id="add_stock"
                  placeholder="# of Stock"
                  class=" peer block min-h-[auto] w-full rounded-xl border h-10 pl-4 px-3 py-[0.32rem] leading-[1.6] bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                />
              </div>
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
};

export default Inventory;
