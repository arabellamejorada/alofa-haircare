import React, { Fragment, useState, useEffect } from "react";
import DataTable from "../shared/DataTable";
import { getInventory, getAllProducts } from "../../api/products";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

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

  const columns = [
    { key: "inventory_id", header: "ID" },
    { key: "sku", header: "SKU" },
    { key: "product_name", header: "Product Name" },
    { key: "product_variation", header: "Variation "},
    { key: "stock_quantity", header: "Stock Quantity" },
    { key: "stock_in_date", header: "Stock In Date" },
  ];
  
  if (error) return <div>{error}</div>;

  const productMap = products.reduce((acc, product) => {
    acc[product.product_id] = {
      name: product.name,
      is_archived: product.is_archived,
    };
    return acc;
  }, {});

  const processedInventory = inventory.map((item) => ({
    ...item,
    product_name: productMap[item.product_id]?.name || "Unknown",
    is_archived: productMap[item.product_id]?.is_archived || false,
  }));

  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <strong className="text-3xl font-bold text-gray-500">
            Inventory
          </strong>
          {/* <div>
            <MdAddBox
              fontSize={30}
              className="text-gray-400 mx-2 hover:text-pink-400 active:text-pink-500"
              onClick={() => setShowModal(true)}
            />
          </div> */}
        </div>

        <DataTable data={processedInventory} columns={columns} isInventory={true}/>{" "}
      </div>
    </Fragment>
  );
};

export default Inventory;
