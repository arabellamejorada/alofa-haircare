import React, { useState, useEffect } from "react";
import AddProductVariationsTable from "./product_variations/AddProductVariationsTable";
import { IoMdArrowDropdown } from "react-icons/io";
import {
  validateProductForm,
  validateAddProductVariationForm,
} from "../../lib/consts/utils/validationUtils";
import {
  createProductWithVariationAndInventory,
  getCategories,
  getStatus,
} from "../../api/products";

const AddNewProduct = () => {
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [newProductFormData, setNewProductFormData] = useState({
    product_name: "",
    product_description: "",
    product_status: "",
    product_category: "",
  });

  const [newProductVariations, setNewProductVariations] = useState([
    {
      type: "",
      value: "",
      unit_price: "",
      sku: "",
      image: null,
    },
  ]);

  const [newProductFormErrors, setNewProductFormErrors] = useState({
    variations: [{}],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await getCategories();
        const statusData = await getStatus();
        setCategories(categoriesData);
        setStatuses(statusData);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, []);

  // Handle Input Changes for Product Form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProductFormData((prevData) => ({ ...prevData, [name]: value }));
    // Validate input as it changes
    const newErrors = { ...newProductFormErrors };
    if (value.trim() === "") {
      newErrors[name] = `${name.replace("_", " ")} is required`;
    } else {
      delete newErrors[name];
    }
    setNewProductFormErrors(newErrors);
  };

  // Handle Variation Changes
  const handleVariationChange = (index, field, value) => {
    const updatedVariations = [...newProductVariations];
    updatedVariations[index][field] = value;
    setNewProductVariations(updatedVariations);
  };

  // Add a new variation row
  const addVariationRow = () => {
    setNewProductVariations((prevVariations) => [
      ...prevVariations,
      {
        type: "",
        value: "",
        unit_price: "",
        sku: "",
        image: null,
      },
    ]);
  };

  // Delete a variation row
  const deleteVariationRow = (index) => {
    setNewProductVariations((prevVariations) =>
      prevVariations.filter((_, i) => i !== index),
    );
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const productErrors = validateProductForm(newProductFormData);
    const variationErrors =
      validateAddProductVariationForm(newProductVariations);
    // Set errors to state
    setNewProductFormErrors({
      ...productErrors,
      variations: variationErrors,
    });

    // If there are no errors, proceed with form submission
    if (
      Object.keys(productErrors).length === 0 &&
      variationErrors.every((error) => Object.keys(error).length === 0)
    ) {
      try {
        await createProductWithVariationAndInventory(
          newProductFormData,
          newProductVariations,
        );
        console.log("Product with variations created successfully!");
        // Reset form on successful submission
        setNewProductFormData({
          product_name: "",
          product_description: "",
          product_status: "",
          product_category: "",
        });
        setNewProductVariations([
          {
            type: "",
            value: "",
            unit_price: "",
            sku: "",
            image: null,
          },
        ]);
        setNewProductFormErrors({ variations: [{}] });
      } catch (error) {
        console.error("Error creating product with variations:", error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4 col-span-1">
          {/* Product Name Input */}
          <div className="flex flex-col gap-1">
            <label className="font-bold" htmlFor="product_name">
              Product Name:
            </label>
            <input
              type="text"
              name="product_name"
              id="product_name"
              placeholder="Product Name"
              value={newProductFormData.product_name}
              onChange={handleInputChange}
              className={`rounded-2xl border h-10 pl-4 bg-gray-100 text-gray-500 focus:outline-none focus:border-pink-500 focus:bg-white w-full ${
                newProductFormErrors.product_name
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {newProductFormErrors.product_name && (
              <p className="text-red-500 text-xs mt-1">
                {newProductFormErrors.product_name}
              </p>
            )}
          </div>

          {/* Category Selection */}
          <div className="flex flex-col gap-1">
            <label className="font-bold" htmlFor="category">
              Category:
            </label>
            <div className="relative">
              <select
                id="category"
                name="product_category"
                value={newProductFormData.product_category}
                onChange={handleInputChange}
                className={`rounded-2xl border h-10 px-4 bg-gray-100 text-gray-500 focus:outline-none focus:border-pink-500 focus:bg-white w-full appearance-none ${
                  newProductFormErrors.product_category
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
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
              <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            {newProductFormErrors.product_category && (
              <p className="text-red-500 text-xs mt-1">
                {newProductFormErrors.product_category}
              </p>
            )}
          </div>

          {/* Product Description */}
          <div className="flex flex-col gap-1">
            <label className="font-bold" htmlFor="product_description">
              Description:
            </label>
            <textarea
              name="product_description"
              id="product_description"
              placeholder="Product Description"
              value={newProductFormData.product_description}
              onChange={handleInputChange}
              className={`rounded-2xl border p-4 bg-gray-100 text-gray-500 focus:outline-none focus:border-pink-500 focus:bg-white resize-y w-full h-24 ${
                newProductFormErrors.product_description
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {newProductFormErrors.product_description && (
              <p className="text-red-500 text-xs mt-1">
                {newProductFormErrors.product_description}
              </p>
            )}
          </div>

          {/* Product Status */}
          <div className="flex flex-col gap-1">
            <label className="font-bold" htmlFor="status">
              Product Status:
            </label>
            <div className="relative">
              <select
                id="status"
                name="product_status"
                value={newProductFormData.product_status}
                onChange={handleInputChange}
                className={`rounded-2xl border h-10 px-4 bg-gray-100 text-gray-500 focus:outline-none focus:border-pink-500 focus:bg-white w-full appearance-none ${
                  newProductFormErrors.product_status
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select Status</option>
                {statuses.map((status) => (
                  <option key={status.status_id} value={status.status_id}>
                    {status.description}
                  </option>
                ))}
              </select>
              <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            {newProductFormErrors.product_status && (
              <p className="text-red-500 text-xs mt-1">
                {newProductFormErrors.product_status}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 mt-4 rounded-lg shadow-md"
          >
            SUBMIT
          </button>
        </div>

        {/* Variations Table */}
        <div className="col-span-3">
          <AddProductVariationsTable
            variations={newProductVariations}
            handleVariationChange={handleVariationChange}
            handleImageChange={(index, file) =>
              handleVariationChange(index, "image", file)
            }
            addVariationRow={addVariationRow}
            deleteVariationRow={deleteVariationRow}
            existingProduct={false}
            variationErrors={newProductFormErrors.variations || []}
          />
        </div>
      </div>
    </form>
  );
};

export default AddNewProduct;
