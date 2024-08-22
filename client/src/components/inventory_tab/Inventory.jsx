import React, { Fragment, useState, useEffect } from "react";
import DataTable from "../shared/DataTable";
import { getInventory, getProducts } from "../../api/products";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inventoryData = await getInventory();
        const productsData = await getProducts();
        setInventory(inventoryData);
        setProducts(productsData);
      } catch (err) {
        setError('Failed to fetch data');
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
  const processedInventory = inventory.map(item => ({
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
        </div>

        {/* Render Table with data*/}
        <DataTable data={processedInventory} columns={columns} />
      </div>
    </Fragment>
  );
};

export default Inventory;
