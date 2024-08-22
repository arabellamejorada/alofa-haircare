import React, { Fragment, useEffect, useState } from "react";
import DataTable from "../shared/DataTable";
import { MdAddBox } from "react-icons/md";
import Modal from "../modal/Modal";
import { IoMdArrowDropdown } from "react-icons/io";
import { getProducts, getCategories } from "../../api/products";
// import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getProducts();
        const categoriesData = await getCategories();
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  const columns = [
    { key: 'name', header: 'Product Name' },
    { key: 'description', header: 'Description' },
    { key: 'unit_price', header: 'Price per Unit', render: (value) => `₱${value}` },
    { key: 'product_category', header: 'Category' },
    { key: 'image', header: 'Image' },
    // Exclude inventory_id and product_category_id
  ];
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  if (error) return <div>{error}</div>;

  // Map category IDs to names
  const categoryMap = categories.reduce((acc, category) => {
    acc[category.id] = category.name;
    return acc;
  }, {});

  // Process product data to include category names
  const processedProducts = products.map(product => ({
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

        {/* Render Table with data */}
        <DataTable data={processedProducts} columns={columns}/> {/* Pass processed products */}
      </div>

      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <form className="p-6" onSubmit={handleSubmit}>
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
                  name="category"
                  className="w-full h-10 px-4 appearance-none border rounded-xl bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
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
                  className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>

            {/* <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="availability">
                Availability:
              </label>
              <div className="relative">
                <select
                  id="availability"
                  name="availability"
                  className="w-full h-10 px-4 appearance-none border rounded-xl bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                >
                  <option value="Available">Available</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Discontinued">Discontinued</option>
                </select>
                <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2" />
              </div>
            </div> */}

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="product_image">
                Product Image:
              </label>
              <input
                type="file"
                name="product_image"
                id="product_image"
                accept="image/*"
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
