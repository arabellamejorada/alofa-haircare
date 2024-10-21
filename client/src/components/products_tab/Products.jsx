import React, { Fragment, useState } from "react";
import AddProductsTab from "./AddProductsTab";
import VariationsTab from "./ViewVariationsTab";
import ProductsTab from "./ViewProductsTab";

const Products = () => {
  const [activeTab, setActiveTab] = useState("view-products");

  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <strong className="text-3xl font-bold text-gray-500">Products</strong>
        {/* Tabs for switching views */}
        <div className="border-b border-gray-300 mb-4">
          <button
            className={`px-4 py-2 ${
              activeTab === "view-products"
                ? "text-pink-400 border-b-2 border-pink-400"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("view-products")}
          >
            View Products
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "view-variations"
                ? "text-pink-400 border-b-2 border-pink-400"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("view-variations")}
          >
            View Product Variations
          </button>
          <button
            className={`px-4 py-2 ml-4 ${
              activeTab === "add-products"
                ? "text-pink-400 border-b-2 border-pink-400"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("add-products")}
          >
            Add Products/Variations
          </button>
        </div>
        {activeTab === "view-products" && (
          <div>
            <ProductsTab />
          </div>
        )}
        {activeTab === "view-variations" && (
          <div>
            {" "}
            <VariationsTab />
          </div>
        )}

        {activeTab === "add-products" && (
          <div>
            <AddProductsTab />
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Products;
