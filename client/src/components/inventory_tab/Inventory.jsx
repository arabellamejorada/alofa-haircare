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
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

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

      // Check if the item matches the search criteria
      const matchesSearch =
        productName.includes(search.toLowerCase()) ||
        variation.includes(search.toLowerCase()) ||
        sku.includes(search.toLowerCase());

      // Check if the item matches the selected product and status filters
      const matchesProductFilter =
        selectedProduct === "" || productName === selectedProduct.toLowerCase();

      const matchesStatusFilter =
        selectedStatus === "" || inventory.product_status === selectedStatus;

      return (
        matchesSearch &&
        matchesProductFilter &&
        matchesStatusFilter &&
        (selectedStatus
          ? inventory.product_status === selectedStatus
          : inventory.product_status?.toLowerCase() !== "archived")
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
        <div className="flex flex-row items-center gap-4">
          <strong className="text-3xl font-bold text-gray-500">
            Inventory
          </strong>
          <SearchInput value={search} onChange={handleSearchChange} />
          <ProductDropdown
            products={products}
            value={selectedProduct}
            onChange={handleProductSelect}
          />
          <StatusDropdown
            value={selectedStatus}
            onChange={handleStatusSelect}
            statuses={productStatuses}
          />
        </div>
        <DataTable
          data={processedInventory}
          columns={columns}
          isInventory={true}
        />
      </div>
    </Fragment>
  );
};

// Status dropdown component for selecting status
const StatusDropdown = ({ value, onChange, statuses }) => (
  <select
    value={value}
    onChange={onChange}
    className="w-[200px] h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
  >
    <option value="">All Statuses</option>
    {statuses.map((status) => (
      <option key={status.product_status_id} value={status.product_status_id}>
        {status.description}{" "}
      </option>
    ))}
  </select>
);

// Dropdown component for selecting product
const ProductDropdown = ({ products, value, onChange }) => (
  <select
    value={value}
    onChange={onChange}
    className="w-[200px] h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
  >
    <option value="">All Products</option>
    {products.map((product) => (
      <option key={product.product_id} value={product.name}>
        {product.name}
      </option>
    ))}
  </select>
);

// Search input component for reusability
const SearchInput = ({ value, onChange }) => (
  <input
    type="text"
    className="w-[300px] h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
    placeholder="Search inventory..."
    value={value}
    onChange={onChange}
  />
);

export default Inventory;
