import React, { Fragment, useState, useEffect } from "react";
import DataTable from "../shared/DataTable";
import { getInventory, getStatus, getAllProducts } from "../../api/products";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [productStatuses, setProductStatuses] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortField, setSortField] = useState("inventory_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryData, statusesData, productsData] = await Promise.all([
          getInventory(),
          getStatus(),
          getAllProducts(),
        ]);
        setInventory(inventoryData);
        setProductStatuses(statusesData);
        setProducts(productsData);
      } catch (err) {
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleProductSelect = (e) => setSelectedProduct(e.target.value);
  const handleStatusSelect = (e) => setSelectedStatus(e.target.value);

  // Function to render the header with sorting arrows
  const renderHeader = (key, label) => (
    <div
      onClick={() => handleColumnSort(key)}
      className="flex items-center cursor-pointer"
    >
      {label}
      {sortField === key && (
        <span className="ml-1">
          {sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />}
        </span>
      )}
    </div>
  );

  const handleColumnSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const processedInventory = inventory
    .filter((inventory) => {
      const productName = inventory.product_name?.toLowerCase() || "";
      const variation =
        `${inventory.type || ""} - ${inventory.value || ""}`.toLowerCase();
      const sku = inventory.sku?.toLowerCase() || "";

      const matchesSearch =
        productName.includes(search.toLowerCase()) ||
        variation.includes(search.toLowerCase()) ||
        sku.includes(search.toLowerCase());

      const matchesProductFilter =
        selectedProduct === "" || productName === selectedProduct.toLowerCase();

      const matchesStatusFilter =
        selectedStatus === "" || inventory.product_status === selectedStatus;

      return (
        matchesSearch &&
        matchesProductFilter &&
        matchesStatusFilter &&
        (showArchived || inventory.product_status?.toLowerCase() !== "archived")
      );
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });

  const columns = [
    { key: "inventory_id", header: renderHeader("inventory_id", "ID") },
    { key: "sku", header: renderHeader("sku", "SKU") },
    {
      key: "product_name",
      header: renderHeader("product_name", "Product Name"),
    },
    {
      key: "variation",
      header: renderHeader("variation", "Variation"),
    },
    {
      key: "stock_quantity",
      header: renderHeader("stock_quantity", "Stock Quantity"),
    },
    {
      key: "product_status",
      header: renderHeader("product_status", "Status"),
    },
    {
      key: "last_updated_date",
      header: renderHeader("last_updated_date", "Last Update"),
    },
  ];

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <strong className="text-3xl font-bold text-gray-500">
            Inventory
          </strong>

          {/* Filters Section */}
          <div className="flex flex-row flex-wrap items-center gap-4 mt-4">
            {/* Search Input with Clear Button */}
            <div className="relative flex items-center w-[220px]">
              <input
                type="text"
                className="w-full h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
                placeholder="Search inventory..."
                value={search}
                onChange={handleSearchChange}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="ml-2 text-pink-500 hover:text-pink-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Product Dropdown with Clear Button */}
            <div className="relative flex items-center w-[220px]">
              <select
                value={selectedProduct}
                onChange={handleProductSelect}
                className="w-full h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
              >
                <option value="">All Products</option>
                {products.map((product) => (
                  <option key={product.product_id} value={product.name}>
                    {product.name}
                  </option>
                ))}
              </select>
              {selectedProduct && (
                <button
                  onClick={() => setSelectedProduct("")}
                  className="ml-2 text-pink-500 hover:text-pink-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Status Dropdown with Clear Button */}
            <div className="flex items-center">
              <div className="relative w-[200px]">
                <select
                  value={selectedStatus}
                  onChange={handleStatusSelect}
                  className="w-full h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
                >
                  <option value="">All Statuses</option>
                  {productStatuses.map((status) => (
                    <option
                      key={status.product_status_id}
                      value={status.product_status_id}
                    >
                      {status.description}
                    </option>
                  ))}
                </select>
              </div>
              {selectedStatus && (
                <button
                  onClick={() => setSelectedStatus("")}
                  className="ml-2 text-pink-500 hover:text-pink-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Checkbox for Show/Hide Archived */}
            {selectedStatus === "" && (
              <div className="flex items-center ml-4">
                <input
                  type="checkbox"
                  checked={showArchived}
                  onChange={(e) => setShowArchived(e.target.checked)}
                  className="h-5 w-5 accent-pink-500"
                />
                <label className="ml-2 font-semibold text-gray-700">
                  {showArchived ? "Hide Archived" : "Show Archived"}
                </label>
              </div>
            )}
          </div>

          {/* DataTable */}
          <DataTable
            data={processedInventory}
            columns={columns}
            isInventory={true}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default Inventory;
