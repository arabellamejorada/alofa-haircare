import React from "react";
import ProductVariationsTable from "./AddProductVariationsTable";
import { IoMdArrowDropdown } from "react-icons/io";

const AddProductVariationPage = ({
  handleSubmit,
  product_id,
  setProductId,
  products,
  variations,
  handleVariationChange,
  handleImageChange,
  addVariation,
  statuses,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-full mx-auto p-6 bg-white shadow-md rounded-lg"
    >
      {" "}
      <div className="flex flex-col gap-6">
        <div className="font-extrabold text-3xl text-pink-500">
          Add Product Variations
        </div>

        {/* Product Selection */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-gray-700" htmlFor="product_id">
            Product Name:
          </label>
          <div className="relative">
            <select
              id="product_id"
              name="product_id"
              value={product_id}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full h-12 px-4 border rounded-xl bg-gray-50 text-gray-700 focus:ring-pink-300 focus:border-pink-400 appearance-none"
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product.product_id} value={product.product_id}>
                  {product.name}
                </option>
              ))}
            </select>
            <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Variations Table */}
        <ProductVariationsTable
          variations={variations}
          statuses={statuses}
          handleVariationChange={handleVariationChange}
          handleImageChange={handleImageChange}
          addVariation={addVariation}
          // deleteVariation={deleteVariation}
        />

        {/* Submit Button */}
        <div className="flex justify-start mt-6">
          <button
            type="submit"
            className="px-6 py-3 text-white bg-pink-400 hover:bg-pink-500 rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105"
          >
            Add Product Variations
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddProductVariationPage;
