import React, { Fragment, useState, useEffect } from "react";
import DataTable from "../shared/DataTable";
import { MdAddBox } from "react-icons/md";
import Modal from "../modal/Modal";
import { IoMdArrowDropdown } from "react-icons/io";
import ProductVariationsTable from "./ProductVariationsTable";
import {
  createProductVariationWithInventory,
  getAllProductVariations,
  getAllProducts,
  updateProductVariation,
  getStatus,
  archiveProductVariation,
} from "../../api/products";

const ProductVariations = () => {
  const [product_variations, setProductVariations] = useState([]);
  const [products, setProducts] = useState([]);
  const [statuses, setStatus] = useState([]);
  const [error, setError] = useState(null);

  const [selectedProductVariation, setSelectedProductVariation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // For Edit Modal (Individual State Variables)
  const [product_id, setProductId] = useState("");
  const [type, setType] = useState("");
  const [value, setValue] = useState("");
  const [sku, setSku] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [productStatusId, setProductStatusId] = useState("");
  const [image, setImage] = useState(null);

  const [variations, setVariations] = useState([
    {
      type: "",
      value: "",
      sku: "",
      unit_price: "",
      product_status_id: "",
      image: null,
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productVariationsData = await getAllProductVariations();
        const productsData = await getAllProducts();
        const statusData = await getStatus();

        setProductVariations(productVariationsData);
        setProducts(productsData);
        setStatus(statusData);
      } catch (err) {
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  // Function to handle form submission for adding new product variations
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product_id) {
      alert("Please select a product.");
      return;
    }

    const formData = new FormData();
    formData.append("product_id", product_id);

    // Append each variation's data and image to FormData
    variations.forEach((variation, index) => {
      formData.append(`variations[${index}][type]`, variation.type);
      formData.append(`variations[${index}][value]`, variation.value);
      formData.append(`variations[${index}][unit_price]`, variation.unit_price);
      formData.append(`variations[${index}][product_status_id]`, variation.product_status_id);
      if (variation.image) {
        formData.append(`images`, variation.image);
      }
    });

    try {
      const response = await createProductVariationWithInventory(formData);
      console.log("Product variation created successfully:", response);
      handleCloseModal();
      const productVariationsData = await getAllProductVariations();
      setProductVariations(productVariationsData);
    } catch (error) {
      console.error("Error saving product variation:", error);
      setError("Error saving product variation. Please try again.");
    }
  };

  // Handle variation input change
  const handleVariationChange = (index, field, value) => {
    const newVariations = [...variations];
    newVariations[index][field] = value;
    setVariations(newVariations);
  };

  // Handle image change
  const handleImageChange = (index, file) => {
    const newVariations = [...variations];
    newVariations[index].image = file;
    setVariations(newVariations);
  };

  // Add new variation
  const addVariation = () => {
    setVariations([
      ...variations,
      {
        type: "",
        value: "",
        sku: "",
        unit_price: "",
        product_status_id: "",
        image: null,
      },
    ]);
  };

  // Handle Edit Modal
  const handleEdit = (product_variation) => {
    setSelectedProductVariation(product_variation);
    setProductId(product_variation.product_id || "");
    setType(product_variation.type || "");
    setValue(product_variation.value || "");
    setSku(product_variation.sku || "");
    setUnitPrice(product_variation.unit_price || "");
    setProductStatusId(product_variation.product_status_id || "");
    setImage(product_variation.image || null);
    setIsEditModalVisible(true);
  };

  // Handle Update Variation
  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("product_id", product_id);
    formData.append("type", type);
    formData.append("value", value);
    formData.append("sku", sku);
    formData.append("unit_price", unitPrice);
    formData.append("product_status_id", productStatusId);
    if (image) formData.append("image", image);  

    try {
      const response = await updateProductVariation(selectedProductVariation.variation_id, formData);
      console.log("Product variation updated successfully:", response);
      setIsEditModalVisible(false);
      const updatedVariations = await getAllProductVariations();
      setProductVariations(updatedVariations);
    } catch (error) {
      console.error("Error updating product variation:", error);
    }
  };

  // Handle Archive
  const handleArchive = async (selectedProductVariation) => {
    if (!selectedProductVariation) return;

    const isConfirmed = window.confirm(
      "Are you sure you want to archive this product variation?"
    );
    if (!isConfirmed) return;

    try {
      const response = await archiveProductVariation(selectedProductVariation.variation_id);
      console.log(response);
      const productVariationsData = await getAllProductVariations();
      setProductVariations(productVariationsData);
    } catch (error) {
      console.error("Error archiving product variation: ", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditModalVisible(false);
    setSelectedProductVariation(null);
    setProductId("");
    setVariations([
      {
        type: "",
        value: "",
        sku: "",
        unit_price: "",
        product_status_id: "",
        image: null,
      },
    ]);
  };

  if (error) return <div>{error}</div>;

  const columns = [
    { key: "variation_id", header: "ID" },
    { key: "product_name", header: "Product Name" },
    { key: "type", header: "Variation Type" },
    { key: "value", header: "Variation Value" },
    { key: "sku", header: "SKU" },
    { key: "unit_price", header: "Price" },
    { key: "status_description", header: "Status" },
  ];

  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <strong className="text-3xl font-bold text-gray-500">
            Product Variations
          </strong>
          <div>
            <MdAddBox
              fontSize={30}
              className="text-gray-400 mx-2 hover:text-pink-400 active:text-pink-500"
              onClick={() => setShowModal(true)}
            />
          </div>
        </div>
        <DataTable
          data={product_variations}
          columns={columns}
          onEdit={handleEdit}
          onArchive={handleArchive}
        />
      </div>

   {/* Add Modal */}
   <Modal isVisible={showModal} onClose={handleCloseModal}>
        <form
          className="px-2 w-full max-w-4xl mx-auto bg-white rounded-lg"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="flex flex-col gap-4">
          <div className="font-extrabold text-2xl md:text-3xl text-pink-400 text-center">
              {selectedProductVariation ? "Edit Product Variation" : "Add Product Variations"}
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="product_id">Product Name:</label>
              <div className="relative">
                <select
                  id="product_id"
                  name="product_id"
                  value={product_id}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full h-10 px-4 appearance-none border rounded-xl bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.product_id} value={product.product_id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Product Variations Table */}
            <div className="overflow-x-auto">
              <ProductVariationsTable
                variations={variations}
                statuses={statuses}
                handleVariationChange={handleVariationChange}
                handleImageChange={handleImageChange}
                addVariation={addVariation}
              />
            </div>

            <div className="flex flex-row justify-between mt-4">
              <button
                type="submit"
                className="w-[10rem] text-center py-3 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 rounded-full font-semibold text-white"
              >
                {selectedProductVariation ? "Apply Changes" : "Add Product Variations"}
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-[10rem] text-center py-3 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 rounded-full font-extrabold text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isVisible={isEditModalVisible} onClose={handleCloseModal}>
        <form className="p-6" onSubmit={handleUpdate}>
          <div className="flex flex-col gap-4">
            <div className="font-extrabold text-3xl text-pink-400">Edit Product Variation</div>

            {/* Product Name */}
            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="product_name">Product Name:</label>
              <div className="relative">
                <select
                  id="product_id"
                  name="product_id"
                  value={product_id}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full h-10 px-4 appearance-none border rounded-xl bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                >
                  <option value="" disabled>Select Product</option>
                  {products.map((product) => (
                    <option key={product.product_id} value={product.product_id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <IoMdArrowDropdown className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Variation Type */}
            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="type">Variation Type:</label>
              <input
                type="text"
                name="type"
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              />
            </div>

            {/* Variation Value */}
            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="value">Variation Value:</label>
              <input
                type="text"
                name="value"
                id="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              />
            </div>

            {/* SKU */}
            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="sku">SKU:</label>
              <input
                type="text"
                name="sku"
                id="sku"
                value={sku}
                readOnly
                className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              />
            </div>

            {/* Unit Price */}
            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="unit_price">Unit Price:</label>
              <input
                type="number"
                name="unit_price"
                id="unit_price"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              />
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="image">Product Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="rounded-xl border w-full h-10 px-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              />
            </div>

            {/* Product Status */}
            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="statusId">Status:</label>
              <div className="relative">
                <select
                  name="statusId"
                  id="statusId"
                  value={productStatusId}
                  onChange={(e) => setProductStatusId(e.target.value)}
                  className="w-full h-10 px-4 appearance-none border rounded-xl bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                >
                  <option value="" disabled>Select Status</option>
                  {statuses.map((status) => (
                    <option key={status.product_status_id} value={status.status_id}>
                      {status.description}
                    </option>
                  ))}
                </select>
                <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="w-[10rem] text-center py-3 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 rounded-full font-semibold text-white"
              >
                Update Variation
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </Fragment>
  );
};

export default ProductVariations;
