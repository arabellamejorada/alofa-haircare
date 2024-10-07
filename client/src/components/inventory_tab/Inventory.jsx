import React, { Fragment, useState, useEffect } from "react";
import DataTable from "../shared/DataTable";
import { getInventory, getAllProducts } from "../../api/products";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inventoryData = await getInventory();
        const productsData = await getAllProducts();
        setInventory(inventoryData);
        setProducts(productsData);
      } catch (err) {
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const columns = [
    { key: "inventory_id", header: "ID" },
    { key: "sku", header: "SKU" },
    { key: "product_name", header: "Product Name" },
    { key: "product_variation", header: "Variation " },
    { key: "stock_quantity", header: "Stock Quantity" },
    { key: "last_updated_date", header: "Last Update" },
  ];

  const productMap = products.reduce((acc, product) => {
    acc[product.product_id] = {
      name: product.name,
      is_archived: product.is_archived,
    };
    return acc;
  }, {});

  // Filter inventory based on the search input
  const filteredInventory = inventory.filter((item) => {
    const productName = productMap[item.product_id]?.name.toLowerCase() || "";
    const variation = `${item.type} - ${item.value}`.toLowerCase();
    return (
      productName.includes(search) ||
      item.sku.toLowerCase().includes(search) ||
      variation.includes(search)
    );
  });

  const processedInventory = filteredInventory.map((item) => ({
    ...item,
    product_name: productMap[item.product_id]?.name || "Unknown",
    is_archived: productMap[item.product_id]?.is_archived || false,
    product_variation: `${item.type} - ${item.value}`,
  }));

  if (error) return <div>{error}</div>;

  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <strong className="text-3xl font-bold text-gray-500">
            Inventory
          </strong>
          <input
            type="text"
            className="w-[200px] h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
            placeholder="Search inventory..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <DataTable
          data={processedInventory}
          columns={columns}
          isInventory={true}
        />{" "}
      </div>
    </Fragment>
  );
};

export default Inventory;
