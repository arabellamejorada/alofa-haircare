import React, { Fragment, useState, useEffect } from "react";
import DataTable from "../shared/DataTable";
import { getInventory, getAllProducts } from "../../api/products";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(""); // For dropdown filter
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryData, productsData] = await Promise.all([
          getInventory(),
          getAllProducts(),
        ]);
        setInventory(inventoryData);
        setProducts(productsData);

        // Debugging logs for productMap
        console.log("Products Data:", productsData);
        console.log("Inventory Data:", inventoryData);
      } catch (err) {
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleProductSelect = (e) => setSelectedProduct(e.target.value); // Handle product selection

  // Function to handle sorting when column header is clicked
  const handleColumnSort = (key) => {
    const newSortOrder =
      sortField === key && sortOrder === "asc" ? "desc" : "asc";
    setSortField(key);
    setSortOrder(newSortOrder);
  };

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

  const productMap = products.reduce((acc, product) => {
    acc[product.product_id] = {
      name: product.name,
      is_archived: product.is_archived,
    };
    return acc;
  }, {});

  // Function to filter and sort inventory based on search, dropdown filter, and sort criteria
  const filterAndSortInventory = (
    inventory,
    search,
    selectedProduct,
    sortField,
    sortOrder,
  ) => {
    let filtered = inventory.filter((item) => {
      const productName =
        productMap[item.product_id]?.name?.toLowerCase() || "";
      const variation = `${item.type} - ${item.value}`.toLowerCase();

      const matchesSearch =
        productName.includes(search.toLowerCase()) ||
        variation.includes(search.toLowerCase());

      const matchesProductFilter =
        selectedProduct === "" ||
        productName.toLowerCase() === selectedProduct.toLowerCase();

      return matchesSearch && matchesProductFilter;
    });

    // Sort by sortField and sortOrder (asc or desc)
    if (sortField) {
      filtered = filtered.sort((a, b) => {
        const aField = a[sortField] || "";
        const bField = b[sortField] || "";

        if (sortOrder === "asc") {
          return aField > bField ? 1 : -1;
        } else {
          return aField < bField ? 1 : -1;
        }
      });
    }

    return filtered;
  };

  const processedInventory = filterAndSortInventory(
    inventory,
    search,
    selectedProduct,
    sortField,
    sortOrder,
  ).map((item) => ({
    ...item,
    product_name: productMap[item.product_id]?.name || "Unknown", // Add product_name from productMap
    product_variation: `${item.type} - ${item.value}`, // Combine variation type and value
  }));

  const columns = [
    { key: "inventory_id", header: renderHeader("inventory_id", "ID") },
    { key: "sku", header: renderHeader("sku", "SKU") },
    {
      key: "product_name",
      header: renderHeader("product_name", "Product Name"),
    },
    {
      key: "product_variation",
      header: renderHeader("product_variation", "Variation"),
    },
    {
      key: "stock_quantity",
      header: renderHeader("stock_quantity", "Stock Quantity"),
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
