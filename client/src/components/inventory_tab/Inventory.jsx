import React, { Fragment, useState, useEffect } from "react";
import DataTable from "../shared/DataTable";
import { createInventory, getInventory, getProducts, updateInventory } from "../../api/products";
import { MdAddBox } from "react-icons/md";
import Modal from "../modal/Modal";
import { IoMdArrowDropdown } from "react-icons/io";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [productId, setProductID] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");

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

  const handleAddStock = async (e) => {
    e.preventDefault();
    
    // Parse and validate input
    const parsedProductId = parseInt(productId, 10);
    const parsedStockQuantity = parseInt(stockQuantity, 10);

    // Check if the parsed values are valid integers
    if (isNaN(parsedProductId) || isNaN(parsedStockQuantity) || parsedProductId <= 0 || parsedStockQuantity <= 0) {
      setError("Invalid product ID or stock quantity");
      return;
    }

    const newStock = {
      product_id: productId,
      stock_quantity: stockQuantity
    };

    try {
      const response = await updateInventory(newStock);
      console.log(response);
      setShowModal(false);

      const inventoryData = await getInventory();
      setInventory(inventoryData);
    } catch (error) {
      console.error(error);
      setError("Failed to add stock");
    }
  };

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

        <DataTable data={processedInventory} columns={columns} />
      </div>

      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <form className="p-6" onSubmit={handleAddStock}>
          <div className="flex flex-col gap-4">
            <div className="font-extrabold text-3xl text-pink-400">
              Add Stock:
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="product_name">
                Product:
              </label>
              <div className="grid">
                <svg
                  className="pointer-events-none z-10 right-1 relative col-start-1 row-start-1 h-4 w-4 self-center justify-self-end forced-colors:hidden mr-2"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <select
                  id="product_id"
                  value={productId}
                  onChange={(e) => setProductID(e.target.value)}
                  className="w-full h-10 px-4 appearance-none border rounded-xl bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.product_id} value={product.product_id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2" />
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
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className=" peer block min-h-[auto] w-full rounded-xl border h-10 pl-4 px-3 py-[0.32rem] leading-[1.6] bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
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
    </Fragment>
  );
};

export default Inventory;