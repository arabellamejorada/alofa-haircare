import React, { Fragment, useState, useContext } from "react";
import AddProductsTab from "./add_products/AddProductsTab";
import VariationsTab from "./view_variations/ViewVariationsTab";
import ProductsTab from "./view_products/ViewProductsTab";
import { AuthContext } from "../AuthContext"; // Import AuthContext to get the user's role

const Products = () => {
  const [activeTab, setActiveTab] = useState("view-products");
  const { role } = useContext(AuthContext); // Access the user's role from AuthContext

  // Check if the user is an admin
  const isAdmin = role === "admin";

  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <strong className="text-3xl font-bold text-gray-500">Products</strong>
        {/* Tabs for switching views */}
        <div className="border-b border-gray-300 mb-4">
          <button
            className={`px-4 py-2 ${
              activeTab === "view-products"
                ? "text-alofa-highlight border-b-2 border-alofa-highlight"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("view-products")}
          >
            View Products
          </button>
          {isAdmin && (
            <button
              className={`px-4 py-2 ${
                activeTab === "view-variations"
                  ? "text-alofa-highlight border-b-2 border-alofa-highlight"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("view-variations")}
            >
              View Product Variations
            </button>
          )}
          {isAdmin && (
            <button
              className={`px-4 py-2 ml-4 ${
                activeTab === "add-products"
                  ? "text-alofa-highlight border-b-2 border-alofa-highlight"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("add-products")}
            >
              Add Products/Variations
            </button>
          )}
        </div>
        {/* Render tabs based on the activeTab and user role */}
        {activeTab === "view-products" && (
          <div>
            <ProductsTab />
          </div>
        )}
        {activeTab === "view-variations" && isAdmin && (
          <div>
            <VariationsTab />
          </div>
        )}
        {activeTab === "add-products" && isAdmin && (
          <div>
            <AddProductsTab />
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Products;
