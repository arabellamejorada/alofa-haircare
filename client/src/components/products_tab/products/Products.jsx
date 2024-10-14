import React, { Fragment, useState, useEffect } from "react";
import { MdAddBox } from "react-icons/md";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import { toast } from "sonner";
import {
  createProduct,
  getAllProducts,
  getCategories,
  getStatus,
  archiveProduct,
  updateProduct,
} from "../../../api/products";
import {
  validateProductForm,
  validateName,
  validateDescription,
  validateStatus,
  validateCategory,
} from "../../../lib/consts/utils/validationUtils";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [originalProductData, setOriginalProductData] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [productFormData, setProductFormData] = useState({
    product_name: "",
    product_description: "",
    product_status: "",
    product_category: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getAllProducts();
        const categoriesData = await getCategories();
        const statusData = await getStatus();
        setProducts(productsData);
        setCategories(categoriesData);
        setStatuses(statusData);
      } catch (err) {
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "product_name":
        error = validateName(value)
          ? ""
          : `${name.replace("_", " ")} is required`;
        break;
      case "description":
        error = validateDescription(value)
          ? ""
          : `${name.replace("_", " ")} is required`;
        break;
      case "status":
        error = validateStatus(value) ? "" : "Status is required";
        break;
      case "category":
        error = validateCategory(value) ? "" : "Category is required";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductFormData((prevData) => ({
      ...prevData,
      [name]: value.toString(),
    }));
    validateField(name, value);
  };

  const validateForm = () => {
    const formErrors = validateProductForm(productFormData);
    setErrors(formErrors);
    return !Object.values(formErrors).some((error) => error !== "");
  };

  const isFormModified = () => {
    return (
      productFormData.product_name !== originalProductData?.name ||
      productFormData.product_description !==
        originalProductData?.description ||
      productFormData.product_status !== originalProductData?.status_id ||
      productFormData.product_category !==
        originalProductData?.product_category_id
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill out all required fields correctly.");
      return;
    }

    const {
      product_name,
      product_description,
      product_status,
      product_category,
    } = productFormData;

    const productData = {
      name: product_name,
      description: product_description,
      product_status_id: product_status,
      product_category_id: product_category,
    };

    try {
      let response;
      if (selectedProduct) {
        response = await updateProduct(selectedProduct.product_id, productData);
        console.log("Product updated successfully:", response);
        toast.success("Product updated successfully");
      } else {
        response = await createProduct(productData);
        console.log("Product created successfully:", response);
        toast.success("Product created successfully");
      }
      handleCloseModal();
      const productsData = await getAllProducts();
      setProducts(productsData);
    } catch (error) {
      console.error("Error creating/updating product: ", error);
      toast.error("Failed to create/update product");
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setOriginalProductData(product);
      setProductFormData({
        product_name: product.name || "",
        product_description: product.description || "",
        product_status: product.status_id || "",
        product_category: product.product_category_id || "",
      });
    } else {
      setSelectedProduct(null);
      setOriginalProductData(null);
      setProductFormData({
        product_name: "",
        product_description: "",
        product_status: "",
        product_category: "",
      });
    }
    setShowModal(true);
  };

  const handleArchiveProduct = async (selectedProduct) => {
    if (!selectedProduct) return;

    if (window.confirm("Are you sure you want to archive this product?")) {
      try {
        const response = await archiveProduct(selectedProduct.product_id);
        const productsData = await getAllProducts();
        console.log("Product archived successfully:", response);
        toast.success("Product archived successfully");
        setProducts(productsData);
      } catch (error) {
        console.error("Error archiving product: ", error);
        setError("Failed to update product status to Archived");
        toast.error("Failed to archive product");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setProductFormData({
      product_name: "",
      product_description: "",
      product_status: "",
      product_category: "",
    });
  };

  const handleColumnSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const handleSearchChange = (e) => setSearch(e.target.value.toLowerCase());

  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

  const handleStatusChange = (e) => setSelectedStatus(e.target.value);

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search);

      const matchesCategory =
        !selectedCategory ||
        product.product_category.toLowerCase() ===
          selectedCategory.toLowerCase();

      const matchesStatus =
        !selectedStatus ||
        product.product_status.toLowerCase() === selectedStatus.toLowerCase();

      const isArchived = product.product_status.toLowerCase() === "archived";

      if (selectedStatus.toLowerCase() === "archived") {
        return matchesSearch && matchesCategory && matchesStatus && isArchived;
      }

      // Hide archived products by default, unless 'Archived' is selected
      return matchesSearch && matchesCategory && matchesStatus && !isArchived;
    })
    .sort((a, b) => {
      // Sorting logic based on selected column and order
      const aField = a[sortField] || "";
      const bField = b[sortField] || "";
      if (sortOrder === "asc") {
        return aField > bField ? 1 : -1;
      } else {
        return aField < bField ? 1 : -1;
      }
    });

  if (error) return <div>{error}</div>;

  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <strong className="text-3xl font-bold text-gray-500">
              Products
            </strong>
            <input
              type="text"
              className="w-[300px] h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
              placeholder="Search products..."
              value={search}
              onChange={handleSearchChange}
            />
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-[200px] h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option
                  key={category.product_category_id}
                  value={category.name}
                >
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="w-[200px] h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
            >
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option
                  key={status.status_id}
                  value={status.status_description}
                >
                  {status.description}
                </option>
              ))}
            </select>
          </div>
          <MdAddBox
            fontSize={30}
            className="text-gray-400 mx-2 hover:text-pink-400 active:text-pink-500"
            onClick={() => openModal()}
          />
        </div>

        <ProductTable
          products={filteredProducts}
          onEdit={openModal}
          onArchive={handleArchiveProduct}
          handleColumnSort={handleColumnSort}
          sortField={sortField}
          sortOrder={sortOrder}
        />
      </div>

      {/* Modal for Adding/Editing Product */}
      {showModal && (
        <ProductForm
          isVisible={showModal}
          onClose={handleCloseModal}
          selectedProduct={selectedProduct}
          handleSubmit={handleSubmit}
          productFormData={productFormData}
          handleInputChange={handleInputChange}
          categories={categories}
          statuses={statuses}
          errors={errors}
          isFormModified={isFormModified}
        />
      )}
    </Fragment>
  );
};

export default Products;
