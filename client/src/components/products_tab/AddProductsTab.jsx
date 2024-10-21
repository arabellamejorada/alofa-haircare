import React, { useState, useEffect, Fragment } from "react";
import AddProductVariationsTable from "./product_variations/AddProductVariationsTable";
import { IoMdArrowDropdown } from "react-icons/io";
import EditProductModal from "./products/EditProductModal";
import {
  createProductWithVariationAndInventory,
  getAllProducts,
  getAllProductVariations,
  getCategories,
  getStatus,
} from "../../api/products";
import { select } from "@material-tailwind/react";
const AddProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [productVariations, setProductVariations] = useState([]);

  const [formType, setFormType] = useState("newProduct");
  const [error, setError] = useState(null);

  const [productFormData, setProductFormData] = useState({
    product_name: "",
    product_description: "",
    product_status: "",
    product_category: "",
  });

  const [productId, setProductId] = useState("");
  const [variations, setVariations] = useState([
    {
      type: "",
      value: "",
      unit_price: "",
      sku: "",
      image: null,
    },
  ]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getAllProducts();
        const variationsData = await getAllProductVariations();
        const categoriesData = await getCategories();
        const statusData = await getStatus();

        setProducts(productsData);
        setProductVariations(variationsData);
        setCategories(categoriesData);
        setStatuses(statusData);
      } catch (err) {
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  // Function to add a new variation row
  const addVariationRow = () => {
    setVariations((prevVariations) => [
      ...prevVariations,
      {
        type: "",
        value: "",
        unit_price: "",
        sku: "",
        image: null,
      },
    ]);
    console.log(variations);
  };

  // Function to delete a variation row
  const deleteVariationRow = (index) => {
    setVariations((prevVariations) =>
      prevVariations.filter((_, i) => i !== index),
    );
  };

  // Function to handle variation field changes
  const handleVariationChange = (index, field, value) => {
    const updatedVariations = [...variations];
    updatedVariations[index][field] = value;
    setVariations(updatedVariations);
  };

  // Function to handle image change for a variation
  const handleImageChange = (index, file) => {
    const updatedVariations = [...variations];
    updatedVariations[index].image = file;
    setVariations(updatedVariations);
  };

  return (
    <Fragment>
      {/* Buttons to select form type */}
      <div className="flex flex-row gap-2 mb-4">
        <button
          onClick={() => setFormType("newProduct")}
          className={`flex items-center gap-2 px-6 py-2 text-white rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105 ${
            formType === "newProduct"
              ? "bg-pink-600"
              : "bg-pink-500 hover:bg-pink-600"
          }`}
        >
          Add A New Product & Variations
        </button>

        <button
          onClick={() => setFormType("existingProduct")}
          className={`flex items-center gap-2 px-6 py-2 text-white rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105 ${
            formType === "existingProduct"
              ? "bg-pink-600"
              : "bg-pink-500 hover:bg-pink-600"
          }`}
        >
          Add Variations to an Existing Product
        </button>
      </div>

      {formType === "newProduct" && (
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-4 col-span-1">
              <div className="flex flex-col gap-1">
                <label className="font-bold" htmlFor="product_name">
                  Product Name:
                </label>
                <input
                  type="text"
                  name="product_name"
                  id="product_name"
                  placeholder="Product Name"
                  className="rounded-2xl border border-gray-300 h-10 pl-4 bg-gray-100 text-gray-500 focus:outline-none focus:border-pink-500 focus:bg-white w-full"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold" htmlFor="category">
                  Category:
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="product_category"
                    className="rounded-2xl border border-gray-300 h-10 px-4 bg-gray-100 text-gray-500 focus:outline-none focus:border-pink-500 focus:bg-white w-full appearance-none"
                  >
                    <option value="">Select Category</option>
                    {/* Map categories here */}
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
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold" htmlFor="product_description">
                  Description:
                </label>
                <textarea
                  name="product_description"
                  id="product_description"
                  placeholder="Product Description"
                  className="rounded-2xl border border-gray-300 p-4 bg-gray-100 text-gray-500 focus:outline-none focus:border-pink-500 focus:bg-white resize-y w-full h-24"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold" htmlFor="status">
                  Product Status:
                </label>
                <div className="relative">
                  <select
                    id="status"
                    name="product_status"
                    className="rounded-2xl border border-gray-300 h-10 px-4 bg-gray-100 text-gray-500 focus:outline-none focus:border-pink-500 focus:bg-white w-full appearance-none"
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

                <button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 mt-4 rounded-lg shadow-md"
                >
                  SUBMIT
                </button>
              </div>
            </div>

            {/* Right Column: Variations Table (3/4) */}
            <div className="col-span-3">
              <label className="font-bold">Add Variations:</label>
              <AddProductVariationsTable
                variations={variations}
                handleVariationChange={handleVariationChange}
                handleImageChange={handleImageChange}
                addVariationRow={addVariationRow}
                deleteVariationRow={deleteVariationRow}
                existingProduct={false}
              />{" "}
            </div>
          </div>
        </div>
      )}

      {/* Product Search for Existing Product */}
      {formType === "existingProduct" && (
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          <AddProductVariationsTable
            variations={variations}
            handleVariationChange={handleVariationChange}
            handleImageChange={handleImageChange}
            addVariationRow={addVariationRow}
            deleteVariationRow={deleteVariationRow}
            products={products}
            productId={productId}
            setProductId={setProductId}
            existingProduct={true}
          />
          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 mt-4 rounded-lg shadow-md"
          >
            Add Variations
          </button>
        </div>
      )}
    </Fragment>
  );
};

export default AddProductsTab;
