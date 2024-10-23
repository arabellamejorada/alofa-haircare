import React, { Fragment, useEffect, useState } from "react";
import DataTable from "../shared/DataTable";
import { MdAddBox } from "react-icons/md";
import Modal from "../modal/Modal";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../../api/products";
import { validateName } from "../../lib/consts/utils/validationUtils"; // Assuming you have a validation utility

const ProductCategories = () => {
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [category_name, setCategoryName] = useState("");
  const [originalCategory, setOriginalCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        toast.error("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setCategoryName(value);
    // Validate name in real-time
    if (!validateName(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        category_name: "Category name is required",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        category_name: "",
      }));
    }
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!validateName(category_name)) {
      validationErrors.category_name = "Category name is required";
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const isFormModified = () => {
    return category_name !== originalCategory;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in the required fields.");
      return;
    }

    const categoryData = {
      name: category_name,
    };

    try {
      setLoading(true);

      let response;
      if (selectedCategory) {
        response = await updateCategory(
          selectedCategory.product_category_id,
          categoryData,
        );
        toast.success("Category updated successfully.");
      } else {
        response = await createCategory(categoryData);
        console.log("Category created: ", response);
        toast.success("Category created successfully.");
      }
      handleCloseModal();
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      toast.error("Error saving category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the category "${category.name}"?
        Note: Categories with associated product variations cannot be deleted.`,
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await deleteCategory(category.product_category_id);
      toast.success("Category deleted successfully.");
      const categoriesData = await getCategories();
      setCategories(categoriesData); // Refresh the categories list
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error deleting category. Cannot delete categories with associated products.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    setCategoryName("");
    setOriginalCategory("");
    setErrors({});
  };

  const openModal = (category = null) => {
    if (category) {
      setSelectedCategory(category);
      setCategoryName(category.name || "");
      setOriginalCategory(category.name || "");
    } else {
      setSelectedCategory(null);
      setCategoryName("");
      setOriginalCategory("");
    }
    setShowModal(true);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const handleColumnSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const filteredCategories = categories
    .filter((category) => category.name.toLowerCase().includes(search))
    .sort((a, b) => {
      if (sortField === "name") {
        if (sortOrder === "asc") {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      } else if (sortField === "product_category_id") {
        if (sortOrder === "asc") {
          return a.product_category_id - b.product_category_id;
        } else {
          return b.product_category_id - a.product_category_id;
        }
      }
      return 0;
    });

  const columns = [
    {
      key: "product_category_id",
      header: (
        <div
          onClick={() => handleColumnSort("product_category_id")}
          className="cursor-pointer"
        >
          ID{" "}
          {sortField === "product_category_id" && (
            <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: (
        <div
          onClick={() => handleColumnSort("name")}
          className="cursor-pointer"
        >
          Category Name{" "}
          {sortField === "name" && (
            <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <Fragment>
      <div className="relative">
        {loading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
            <ClipLoader size={50} color="#E53E3E" loading={loading} />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <strong className="text-3xl font-bold text-gray-500">
            Product Categories
          </strong>

          {/* Filters Section */}
          <div className="flex flex-row flex-wrap items-center justify-between mt-4 gap-4">
            <div className="flex items-center gap-4">
              {/* Search Input with Clear Button */}
              <div className="relative flex items-center w-[300px]">
                <input
                  type="text"
                  className="w-full h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
                  placeholder="Search categories..."
                  value={search}
                  onChange={handleSearchChange}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="ml-2 text-pink-500 hover:text-pink-700"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Add Button */}
            <MdAddBox
              fontSize={40}
              className="text-gray-400 mx-2 hover:text-pink-400 active:text-pink-500"
              onClick={() => openModal()}
            />
          </div>

          <DataTable
            data={filteredCategories}
            columns={columns}
            onEdit={openModal}
            onDelete={handleDeleteCategory}
            isProductCategory={true}
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
                  onChange={handleInputChange}
                  className={`rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 ${
                    errors.category_name ? "border-red-500" : ""
                  }`}
                />
                {errors.category_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category_name}
                  </p>
                )}
              </div>

              <div className="flex flex-row justify-end gap-4">
                <button
                  type="submit"
                  disabled={selectedCategory && !isFormModified()} // Disable if no changes
                  className={`px-4 py-2 text-white bg-pink-400 rounded-lg hover:bg-pink-500 ${
                    selectedCategory && !isFormModified()
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {selectedCategory ? "Update Category" : "Add Category"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-white bg-gray-400 rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    </Fragment>
  );
};

export default ProductCategories;
