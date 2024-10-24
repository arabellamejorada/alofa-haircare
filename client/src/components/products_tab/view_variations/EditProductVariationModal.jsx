import React from "react";
import Modal from "../../modal/Modal";
import { IoMdArrowDropdown } from "react-icons/io";

const EditProductVariationModal = ({
  isEditModalVisible,
  handleUpdate,
  handleCloseModal,
  handleInputChange,
  isFormModified,
  product_id,
  products,
  type,
  value,
  sku,
  unitPrice,
  setUnitPrice,
  image,
  setImage,
  productStatusId,
  setProductStatusId,
  statuses,
  errors,
}) => {
  const selectedProduct = products.find(
    (product) => product.product_id === product_id,
  );

  return (
    <Modal isVisible={isEditModalVisible} onClose={handleCloseModal}>
      <form className="p-6" onSubmit={handleUpdate}>
        <div className="flex flex-col gap-4">
          <div className="font-extrabold text-3xl text-pink-400">
            Edit Product Variation
          </div>

          {/* Product Name and SKU side by side */}
          <div className="flex flex-row gap-x-4">
            <div className="w-1/2 flex flex-col gap-2">
              <label className="font-bold">Product Name:</label>
              <input
                type="text"
                value={selectedProduct?.name || "Unknown Product"}
                disabled
                className="w-full h-10 px-4 border rounded-xl bg-gray-50 text-gray-700"
              />
            </div>
            <div className="w-1/2 flex flex-col gap-2">
              <label className="font-bold">SKU:</label>
              <input
                type="text"
                value={sku}
                disabled
                className="w-full h-10 px-4 border rounded-xl bg-gray-50 text-gray-700"
              />
            </div>
          </div>

          {/* Variation Type and Variation Value side by side */}
          <div className="flex flex-row gap-x-4 mt-4">
            <div className="w-1/2 flex flex-col gap-2">
              <label className="font-bold">Variation Type:</label>
              <input
                type="text"
                value={type}
                disabled
                className="w-full h-10 px-4 border rounded-xl bg-gray-50 text-gray-700"
              />
            </div>
            <div className="w-1/2 flex flex-col gap-2">
              <label className="font-bold">Variation Value:</label>
              <input
                type="text"
                value={value}
                disabled
                className="w-full h-10 px-4 border rounded-xl bg-gray-50 text-gray-700"
              />
            </div>
          </div>

          {/* Unit Price */}
          <div className="flex flex-col gap-2">
            <label className="font-bold" htmlFor="unit_price">
              Unit Price:
            </label>
            <input
              type="number"
              name="unit_price" // Add this name
              id="unit_price"
              value={unitPrice}
              onChange={handleInputChange} // Use handleInputChange
              className="w-full h-10 px-4 border rounded-xl bg-gray-50"
            />
            {errors?.unit_price && (
              <p className="text-red-500 text-sm">{errors.unit_price}</p>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="font-bold" htmlFor="product_status_id">
              Status:
            </label>
            <div className="relative">
              <select
                id="product_status_id"
                name="product_status_id" // Add this name
                value={productStatusId}
                onChange={handleInputChange} // Use handleInputChange
                className="w-full h-10 px-4 border rounded-xl bg-gray-50 appearance-none"
              >
                <option value="" disabled>
                  Select Status
                </option>
                {statuses.map((status) => (
                  <option key={status.status_id} value={status.status_id}>
                    {status.description}
                  </option>
                ))}
              </select>
              <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2" />
              {errors?.product_status_id && (
                <p className="text-red-500 text-sm">
                  {errors.product_status_id}
                </p>
              )}
            </div>
          </div>

          {/* Image and Image Upload */}
          <div className="flex flex-col gap-4">
            <label className="font-bold" htmlFor="image">
              Product Image:
            </label>

            <div className="flex items-center gap-x-4">
              {/* Image Preview */}
              {image ? (
                <img
                  src={
                    typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
                  alt="Product"
                  className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center bg-gray-100 text-gray-500 border border-gray-300 rounded-lg">
                  No Image
                </div>
              )}

              {/* Image Upload */}
              <input
                type="file"
                accept="image/*"
                name="image" // Add this name
                onChange={handleInputChange} // Use handleInputChange
                className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none"
              />
              {errors?.image && (
                <p className="text-red-500 text-sm">{errors.image}</p>
              )}
            </div>

            <p className="text-sm text-gray-500">
              Supported formats: JPEG, JPG, PNG
            </p>
          </div>

          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!isFormModified()} // Disable if form is not modified
              className={`w-[10rem] text-center py-3 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 rounded-full font-semibold text-white ${
                !isFormModified() ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Update Variation
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditProductVariationModal;
