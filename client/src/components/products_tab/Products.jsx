import React, { Fragment, useEffect, useState } from "react";
import DataTable from "../shared/DataTable";
import { MdAddBox } from "react-icons/md";
import Modal from "../modal/Modal";
import { IoMdArrowDropdown } from "react-icons/io";
import { getProducts, getCategories } from "../../api/products";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const [product_name, setProductName] = useState('');
  const [product_description, setProductDescription] = useState('');
  const [unit_price, setUnitPrice] = useState('');
  const [product_category, setProductCategory] = useState('');
  const [image, setImage] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getProducts();
        const categoriesData = await getCategories();
        setProducts(productsData);
        setCategories(categoriesData);
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
    { key: "status", header: "Status"},
    {
      key: "unit_price",
      header: "Price",
      render: (value) => `₱${value}`,
    },
    { key: "product_category", header: "Category" },
    { key: "image", header: "Image" },
    // Exclude inventory_id and product_category_id
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', product_name);
    formData.append('description', product_description);
    formData.append('unit_price', unit_price);
    formData.append('product_category_id', product_category);
    formData.append('image', image);

    try {
        const response = await axios.post('http://localhost:3001/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded successfully:', response.data);
      setShowModal(false);

      const productsData = await getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  if (error) return <div>{error}</div>;

  // Map category IDs to names
  const categoryMap = categories.reduce((acc, category) => {
    acc[category.id] = category.name;
    return acc;
  }, {});

  // Process product data to include category names
  const processedProducts = products.map((product) => ({
    ...product,
    product_category: categoryMap[product.product_category],
  }));

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
        <DataTable data={processedProducts} columns={columns} />{" "}
      </div>

      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <form className="p-6" onSubmit={handleSubmit} encType="multipart/form-data">
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
                className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700 dark:text-slate-200"
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
                    <option key={category.product_category_id} value={category.product_category_id}>
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
                  className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="product_price">
                  Price per unit:
                </label>
                <input
                  type="text"
                  name="product_price"
                  id="product_price"
                  placeholder="₱0.00"
                  value={unit_price}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="product_image">
                Product Image:
              </label>
              <input
                type="file"
                name="image"
                id="product_image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
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
    </Fragment>
  );
};

export default Products;
