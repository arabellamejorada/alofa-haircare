import React from "react";
import Modal from "../../modal/Modal";
import { IoMdArrowDropdown } from "react-icons/io";

const EditProductModal = ({
  isVisible,
  onClose,
  selectedProduct,
  handleSubmit,
  productFormData,
  handleInputChange,
  categories,
  statuses,
  errors,
  isFormModified,
}) => {
  const {
    product_name,
    product_description,
    product_category,
    product_status,
  } = productFormData;

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <form
        className="p-6"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="flex flex-col gap-4 w-[20rem]">
          <div className="font-extrabold text-3xl text-pink-400">
            {selectedProduct ? "Edit Product" : "Add New Product"}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold" htmlFor="product_name">
              Product Name:
            </label>
            <input
              type="text"
              name="product_name"
              id="product_name"
              placeholder="Product Name"
              value={product_name}
              onChange={handleInputChange}
              className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
            />
            {errors.product_name && (
              <p className="text-red-500 text-sm mt-1">{errors.product_name}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold" htmlFor="category">
              Category:
            </label>
            <div className="relative">
              <select
                id="category"
                name="product_category"
                value={product_category}
                onChange={handleInputChange}
                className="w-full h-10 px-4 appearance-none border rounded-xl bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option
                    key={category.product_category_id}
                    value={category.product_category_id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
              <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2" />
            </div>
            {errors.product_category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.product_category}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold" htmlFor="product_description">
              Description:
            </label>
            <textarea
              name="product_description"
              id="product_description"
              placeholder="Product Description"
              value={product_description}
              onChange={handleInputChange}
              className="rounded-xl border w-full h-32 max-h-64 p-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700 resize-y overflow-auto"
            />
            {errors.product_description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.product_description}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold" htmlFor="status">
              Product Status:
            </label>
            <div className="relative">
              <select
                id="status"
                name="product_status"
                value={product_status}
                onChange={handleInputChange}
                className="w-full h-10 px-4 appearance-none border rounded-xl bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              >
                <option value="">Select Status</option>
                {statuses.map((status) => (
                  <option key={status.status_id} value={status.status_id}>
                    {status.description}
                  </option>
                ))}
              </select>
              <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2" />
            </div>
            {errors.product_status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.product_status}
              </p>
            )}
          </div>

          <div className="flex flex-row justify-end gap-4">
            <button
              type="submit"
              disabled={selectedProduct && !isFormModified()} // Disable button if no edits made
              className={`px-4 py-2 text-white bg-pink-400 rounded-lg hover:bg-pink-500 ${
                selectedProduct && !isFormModified()
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {selectedProduct ? "Update Product" : "Add Product"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white bg-gray-400 rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditProductModal;
