import React, { Fragment, useEffect, useState } from "react";
import DataTable from "../shared/DataTable";
import { MdAddBox } from "react-icons/md";
import Modal from "../modal/Modal";
import { IoMdArrowDropdown } from "react-icons/io";
import { getProducts, getCategories, getStatuses, archiveProduct } from "../../api/products";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [error, setError] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [product_name, setProductName] = useState("");
  const [product_description, setProductDescription] = useState("");
  const [product_status_id, setProductStatusId] = useState("");
  const [product_category, setProductCategory] = useState("");
  const [variations, setVariations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getProducts();
        const categoriesData = await getCategories();
        const statusesData = await getStatuses();
        setProducts(productsData);
        setCategories(categoriesData);
        setStatuses(statusesData);
      } catch (err) {
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  const columns = [
    { key: "product_id", header: "ID" },
    { key: "name", header: "Product Name" },
    { key: "description", header: "Description" },
    { key: "product_status", header: "Product Status" },
    { key: "product_category", header: "Category" },
    {
      key: "variations",
      header: "Variations",
      render: (value) => {
        if (!Array.isArray(value)) return 'No Variations';
        return value
          .map(v => `${v.unit_price || 'N/A'} - ${v.image || 'No Image'}`)
          .join(', ');
      }
    }
  ];

  const handleVariationChange = (index, field, value) => {
    const updatedVariations = [...variations];
    updatedVariations[index][field] = value;
    setVariations(updatedVariations);
  };

  const handleAddVariation = () => {
    setVariations([...variations, { name: "", value: "", unit_price: "", image: "", product_status_id: "", stock_quantity: "" }]);
  };

  const handleRemoveVariation = (index) => {
    const updatedVariations = variations.filter((_, i) => i !== index);
    setVariations(updatedVariations);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product_name || !product_description || !product_category || !variations.length) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      let response;
      const formData = new FormData();
      formData.append("name", product_name);
      formData.append("description", product_description);
      formData.append("product_category_id", product_category);
      formData.append("product_status_id", product_status_id);

      variations.forEach((variation, index) => {
        formData.append(`variations[${index}][name]`, variation.name);
        formData.append(`variations[${index}][value]`, variation.value);
        formData.append(`variations[${index}][unit_price]`, variation.unit_price);
        formData.append(`variations[${index}][product_status_id]`, variation.product_status_id);
        formData.append(`variations[${index}][stock_quantity]`, variation.stock_quantity);
        if (variation.image) {
          formData.append(`variations[${index}][image]`, variation.image);
        }
      });

      if (selectedProduct) {
        // Update existing product
        response = await axios.put(
          `http://localhost:3001/products/${selectedProduct.product_id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log("Product updated successfully:", response.data);
      } else {
        // Create new product
        response = await axios.post(
          "http://localhost:3001/products",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log("Product added successfully:", response.data);
      }

      const productsData = await getProducts();
      setProducts(productsData);
      handleCloseModal();
    } catch (error) {
      console.error("Error saving product:", error);
      setError("Error saving product. Please try again.");
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setProductName(product.name || "");
    setProductDescription(product.description || "");
    setProductStatusId(product.product_status_id || "");
    setProductCategory(product.product_category_id || "");
    setVariations(product.variations || []);
    setIsModalVisible(true);
  };

  const handleArchiveProduct = async (selectedProduct) => {
    if (!selectedProduct) return;

    const isConfirmed = window.confirm("Are you sure you want to archive this product?");
    if (!isConfirmed) return;

    try {
      await archiveProduct(selectedProduct.product_id, { status_id: 3 });
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error("Error archiving product:", error);
      setError("Failed to update product status to Archived");
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setShowModal(false);
    setSelectedProduct(null);
    setProductName("");
    setProductDescription("");
    setProductStatusId("");
    setProductCategory("");
    setVariations([]);
  };

  if (error) return <div>{error}</div>;

  const categoryMap = categories.reduce((acc, category) => {
    acc[category.product_category_id] = category.name;
    return acc;
  }, {});

  const statusMap = statuses.reduce((acc, status) => {
    acc[status.status_id] = status.description;
    return acc;
  }, {});

  const processedProducts = products
    .map((product) => ({
      ...product,
      product_category: categoryMap[product.product_category_id] || "Unknown",
      product_status: statusMap[product.product_status_id] || "Unknown",
    }))
    .sort((a, b) => (a.product_status_id === 4 ? 1 : -1));

  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <strong className="text-3xl font-bold text-gray-500">Products</strong>
          <MdAddBox
            fontSize={30}
            className="text-gray-400 mx-2 hover:text-pink-400 active:text-pink-500"
            onClick={() => setShowModal(true)}
          />
        </div>
        <DataTable
          data={processedProducts}
          columns={columns}
          onEdit={handleEdit}
          onArchive={handleArchiveProduct}
        />
      </div>

      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <form className="p-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="font-extrabold text-3xl text-pink-400">
              {selectedProduct ? "Edit Product" : "Add New Product"}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="product_name">Product Name:</label>
              <input
                type="text"
                name="product_name"
                id="product_name"
                placeholder="Product Name"
                value={product_name}
                onChange={(e) => setProductName(e.target.value)}
                className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="product_category">Product Category:</label>
              <select
                name="product_category"
                id="product_category"
                value={product_category}
                onChange={(e) => setProductCategory(e.target.value)}
                className="rounded-xl border w-full h-10 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.product_category_id} value={category.product_category_id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="description">Product Description:</label>
              <textarea
                name="product_description"
                id="description"
                rows="4"
                placeholder="Product Description"
                value={product_description}
                onChange={(e) => setProductDescription(e.target.value)}
                className="rounded-xl border w-full p-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              ></textarea>
            </div>

            {/* Variations */}
            {variations.map((variation, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Variation Name"
                    value={variation.name}
                    onChange={(e) => handleVariationChange(index, "name", e.target.value)}
                    className="rounded-xl border w-1/2 h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                  />
                  <input
                    type="text"
                    placeholder="Variation Value"
                    value={variation.value}
                    onChange={(e) => handleVariationChange(index, "value", e.target.value)}
                    className="rounded-xl border w-1/2 h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                  />
                  <input
                    type="number"
                    placeholder="Unit Price"
                    value={variation.unit_price}
                    onChange={(e) => handleVariationChange(index, "unit_price", e.target.value)}
                    className="rounded-xl border w-1/2 h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                  />
                  <input
                    type="file"
                    onChange={(e) => handleVariationChange(index, "image", e.target.files[0])}
                    className="rounded-xl border w-1/2 h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                  />
                  <input
                    type="number"
                    placeholder="Stock Quantity"
                    value={variation.stock_quantity}
                    onChange={(e) => handleVariationChange(index, "stock_quantity", e.target.value)}
                    className="rounded-xl border w-1/2 h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveVariation(index)}
                  className="text-red-500 underline"
                >
                  Remove Variation
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddVariation}
              className="text-pink-500 underline"
            >
              Add Variation
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-pink-400 text-white rounded-xl hover:bg-pink-500"
            >
              {selectedProduct ? "Update Product" : "Save Product"}
            </button>
          </div>
        </form>
      </Modal>
    </Fragment>
  );
};

export default Products;
