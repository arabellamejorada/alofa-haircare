import React, { Fragment, useEffect, useState } from "react";
import DataTable from "../shared/DataTable";
import { MdAddBox } from "react-icons/md";
import Modal from "../modal/Modal";
import { createCategory, getCategories, updateCategory, archiveCategory } from "../../api/products";

const ProductCategories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [category_name, setCategoryName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (err) {
        setError("Failed to fetch categories");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category_name) {
      alert("Please fill out all required fields.");
      return;
    }

    const categoryData = {
      name: category_name,
    };

    try {
      let response;
      if (selectedCategory) {
        response = await updateCategory(selectedCategory.product_category_id, categoryData);
        console.log("Category updated successfully:", response);
      } else {
        response = await createCategory(categoryData);
        console.log("Category created successfully:", response);
      }
      handleCloseModal();
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error saving category:", error);
      setError("Error saving category. Please try again.");
    }
  };

  const handleArchive = async (category) => {
    try {
      const response = await archiveCategory(category.product_category_id);
      console.log("Category archived successfully:", response);
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error archiving category:", error);
      setError("Error archiving category. Please try again.");
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setSelectedCategory(category);
      setCategoryName(category.name || "");
    } else {
      setSelectedCategory(null);
      setCategoryName("");
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    setCategoryName("");
  };

  if (error) return <div>{error}</div>;

  const columns = [
    { key: "product_category_id", header: "ID" },
    { key: "name", header: "Category Name" },
  ];

  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <strong className="text-3xl font-bold text-gray-500">Product Categories</strong>
          <div>
            <MdAddBox
              fontSize={30}
              className="text-gray-400 mx-2 hover:text-pink-400 active:text-pink-500"
              onClick={() => openModal()}
            />
          </div>
        </div>
        <DataTable
          data={categories}
          columns={columns}
          onArchive={handleArchive}
          onEdit={openModal}
        />
      </div>

      <Modal isVisible={showModal} onClose={handleCloseModal}>
        <form className="p-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="font-extrabold text-3xl text-pink-400">
              {selectedCategory ? "Edit Category" : "Add New Category"}
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="category_name">
                Category Name:
              </label>
              <input
                type="text"
                name="category_name"
                id="category_name"
                placeholder="Category Name"
                value={category_name}
                onChange={(e) => setCategoryName(e.target.value)}
                className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              />
            </div>

            <div className="flex flex-row justify-between mt-4">
              <button
                type="submit"
                className="w-[10rem] text-center py-3 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 rounded-full font-semibold text-white"
              >
                {selectedCategory ? "Apply Changes" : "Add Category"}
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
    </Fragment>
  );
};

export default ProductCategories;
