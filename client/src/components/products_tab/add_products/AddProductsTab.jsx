import React, { useState, Fragment } from "react";
import AddNewProduct from "./AddNewProduct";
import AddExistingProductVariations from "./AddExistingProductVariations";

const AddProductsTab = () => {
  const [formType, setFormType] = useState("newProduct");

  return (
    <Fragment>
      {/* Buttons to select form type */}
      <div className="flex flex-row gap-2 mb-4">
        <button
          type="button"
          onClick={() => setFormType("newProduct")}
          className={`flex items-center gap-2 px-6 py-2 text-white rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105 ${
            formType === "newProduct"
              ? "bg-alofa-dark"
              : "bg-alofa-pink hover:bg-alofa-dark"
          }`}
        >
          Add A New Product & Variations
        </button>

        <button
          type="button"
          onClick={() => setFormType("existingProduct")}
          className={`flex items-center gap-2 px-6 py-2 text-white rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105 ${
            formType === "existingProduct"
              ? "bg-alofa-dark"
              : "bg-alofa-pink hover:bg-alofa-dark"
          }`}
        >
          Add Variations to an Existing Product
        </button>
      </div>

      {formType === "newProduct" && <AddNewProduct />}
      {formType === "existingProduct" && <AddExistingProductVariations />}
    </Fragment>
  );
};

export default AddProductsTab;
