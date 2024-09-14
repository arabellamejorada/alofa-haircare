import React, { Fragment, useEffect, useState } from "react";
import DataTable from "../shared/DataTable";
import { MdAddBox } from "react-icons/md";
import Modal from "../modal/Modal";
import { IoMdArrowDropdown } from "react-icons/io";
import { createProduct, getProducts, getCategories, getStatus, archiveProduct, updateProduct } from "../../api/products";


const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatus] = useState([]);
  const [error, setError] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [product_name, setProductName] = useState("");
  const [product_description, setProductDescription] = useState("");
  const [product_status, setProductStatus] = useState("");
  const [product_category, setProductCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getProducts();
        const categoriesData = await getCategories();
        const statusData = await getStatus();
        setProducts(productsData);
        setCategories(categoriesData);
        setStatus(statusData);
      } catch (err) {
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!product_name || !product_status || !product_description || !product_category) {
      alert("Please fill out all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", product_name);
    formData.append("description", product_description);
    formData.append("product_status_id", product_status);
    formData.append("product_category_id", product_category);
    
    try {
      let response;

      if (selectedProduct) {
        // If editing an existing product
        response = await updateProduct(selectedProduct.product_id, formData);
        console.log("Product updated successfully:", response);
      } else {
        // If adding a new product
        response = await createProduct(formData);
        console.log("Product created successfully:", response);
      }
      handleCloseModal();
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error("Error saving product:", error);
      setError("Error saving product. Please try again.");
    }
  };
  
  const handleEdit = (product) => {
    console.log("Editing product:", product);
    setSelectedProduct(product);
    setProductName(product.name || "");
    setProductDescription(product.description || "");
    setProductStatus(product.product_status_id || "");
    setProductCategory(product.product_category_id || "");

    setIsModalVisible(true);
  };

  const handleArchiveProduct = async (selectedProduct) => {
    if (!selectedProduct) return;
  
    const isConfirmed = window.confirm("Are you sure you want to archive this product?");
    if (!isConfirmed) return;
  
    const data = {
      product_status_id: 4, // Archived status
    };
  
    try {
      console.log("Archiving product: ", selectedProduct.product_id);
      const response = await archiveProduct(
        selectedProduct.product_id,
        data
      );
      console.log(response);
  
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error("Error archiving products: ", error);
      setError("Failed to update product status to Archived");
    }
  };  

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setShowModal(false);
    setSelectedProduct(null);
    setProductName("");
    setProductDescription("");
    setProductStatus("");
    setProductCategory("");
  };
  
  if (error) return <div>{error}</div>;

  const columns = [
    { key: "product_id", header: "ID" },
    { key: "name", header: "Product Name" },
    { key: "description", header: "Description" },
    { key: "product_category", header: "Category" },
    { key: "product_status", header: "Status" },
  ];

  // Map category IDs to names
  const categoryMap = categories.reduce((acc, category) => {
    acc[category.product_category_id] = category.name;
    return acc;
  }, {});

  // Map status IDs to descriptions
  const statusMap = statuses.reduce((acc, status) => {
    acc[status.status_id] = status.description;
    return acc;
  }, {});

  const processedProducts = products
    .map((product) => ({
      ...product,
      product_category: categoryMap[product.product_category_id] || "Unknown", // Map category based on product_category_id
      product_status: statusMap[product.product_status_id] || "Unknown",    // Map description from statusMap
    }))
    .sort((a, b) => {
      // Sort based on status_id
      if (a.product_status_id === 4 && b.product_status_id !== 4) return 1;
      if (a.product_status_id !== 4 && b.product_status_id === 4) return -1;
      return 0;
    });

  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <strong className="text-3xl font-bold text-gray-500">Products</strong>
          <div>
            <MdAddBox
              fontSize={30}
              className="text-gray-400 mx-2 hover:text-pink-400 active:text-pink-500"
              onClick={() => setShowModal(true)}
            />
          </div>
        </div>
        <DataTable
          data={processedProducts}
          columns={columns}
          onEdit={handleEdit}
          onArchive={handleArchiveProduct}
        />{" "}
      </div>

      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <form
          className="p-6"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="flex flex-col gap-4">
            <div className="font-extrabold text-3xl text-pink-400">
              Add New Product:
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
                onChange={(e) => setProductName(e.target.value)}
                className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="category">
                Category:
              </label>
              <div className="relative">
                <select
                  id="category"
                  name="product_category_id"
                  value={product_category}
                  onChange={(e) => setProductCategory(e.target.value)}
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
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="product_description">
                  Description:
                </label>
                <input
                  type="text"
                  name="product_description"
                  id="product_description"
                  placeholder="Product Description"
                  value={product_description}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700 "
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="status">
                Product Status:
              </label>
              <div className="relative">
                <select
                    id="status"
                    name="product_status_id"
                    value={product_status}
                    onChange={(e) => setProductStatus(e.target.value)}
                    className="w-full h-10 px-4 appearance-none border rounded-xl bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                  >
                    <option value="">Select Status</option>
                    {statuses.map((status) => (
                      <option
                        key={status.status_id}
                        value={status.status_id}
                      >
                        {status.description}
                      </option>
                    ))}
                  </select>
                <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div className="flex flex-row justify-between mt-4">
              <button
                type="submit"
                className="w-[10rem] text-center py-3 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 rounded-full font-semibold text-white"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-[10rem] text-center py-3 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 rounded-full font-extrabold text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      
      <Modal isVisible={isModalVisible} onClose={handleCloseModal}>
        <form className="p-6" onSubmit={handleSubmit} encType="multipart/form-data">
          {selectedProduct && (
            <div className="flex flex-col gap-4">
              <div className="font-extrabold text-3xl text-pink-400">
                Edit Product:
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="edit_product_name">
                  Edit Product Name:
                </label>
                <input
                  type="text"
                  name="product_name"
                  id="edit_product_name"
                  placeholder={selectedProduct.name}
                  value={product_name}
                  onChange={(e) => setProductName(e.target.value)}
                  className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700 "
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="edit_category">
                  Edit Category:
                </label>
                <div className="relative">
                  <select
                    id="edit_category"
                    name="product_category_id"
                    value={product_category}
                    onChange={(e) => setProductCategory(e.target.value)}
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
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label
                    className="font-bold"
                    htmlFor="edit_product_description"
                  >
                    Edit Description:
                  </label>
                  <input
                    type="text"
                    name="product_description"
                    id="edit_product_description"
                    placeholder={selectedProduct.description}
                    value={product_description}
                    onChange={(e) => setProductDescription(e.target.value)}
                    className="overflow-ellipsis rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700 "
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="edit_status">
                  Edit Product Status:
                </label>
                <div className="relative">
                <select
                    id="edit_status"
                    name="product_status_id"
                    value={product_status}
                    onChange={(e) => setProductStatus(e.target.value)}
                    className="w-full h-10 px-4 appearance-none border rounded-xl bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                >
                    <option value="">Select Status</option>
                    {statuses.map((status) => (
                      <option
                        key={status.status_id}
                        value={status.status_id}
                      >
                        {status.description}
                      </option>
                    ))}
                  </select>
                  <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              <div className="flex flex-row justify-between mt-4">
                <button
                  type="submit"
                  className="w-[10rem] text-center py-3 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 rounded-full font-semibold text-white"
                >
                  Apply Changes
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
          )}
        </form>
      </Modal>
    </Fragment>
  );
};

export default Products;
