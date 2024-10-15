import React, { Fragment, useState, useEffect } from "react";
import EditProductVariationModal from "./EditProductVariationModal";
import AddProductVariationPage from "./AddProductVariationPage";
import ProductVariationTable from "./ProductVariationTable";
import { toast } from "sonner";
import {
  createProductVariationWithInventory,
  getAllProductVariations,
  getAllProducts,
  updateProductVariation,
  getStatus,
  archiveProductVariation,
} from "../../../api/products";
import {
  validateEditProductVariationForm,
  validateUnitPrice,
  validateProductStatusId,
  validateImage,
} from "../../../lib/consts/utils/validationUtils";

const ProductVariations = () => {
  const [product_variations, setProductVariations] = useState([]);
  const [products, setProducts] = useState([]);
  const [statuses, setStatus] = useState([]);
  const [activeTab, setActiveTab] = useState("view");
  const [originalProductData, setOriginalProductData] = useState(null);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [errors, setErrors] = useState({});
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const [selectedProductVariation, setSelectedProductVariation] =
    useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [product_id, setProductId] = useState("");
  const [type, setType] = useState("");
  const [value, setValue] = useState("");
  const [sku, setSku] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [productStatusId, setProductStatusId] = useState("");
  const [image, setImage] = useState(null);
  const [variations, setVariations] = useState([]);

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
        toast.error("Error fetching product variations.");
      }
    };
    fetchData();
  }, []);

  const handleCloseModal = () => {
    setIsEditModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setProductId("");
    setType("");
    setValue("");
    setSku("");
    setUnitPrice("");
    setProductStatusId("");
    setImage(null);
    setSelectedProductVariation(null);
  };

  const validateField = (name, value) => {
    console.log(`Validating ${name}: ${value}`);

    let error = "";
    switch (name) {
      case "unit_price":
        error = validateUnitPrice(value)
          ? ""
          : "Unit price is required and must be positive";
        break;
      case "product_status_id":
        error = validateProductStatusId(value) ? "" : "Status is required";
        break;
      case "image":
        error = validateImage(value) ? "" : "Invalid image format";
        break;
      default:
        break;
    }

    // Set errors
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error, // Dynamically update the error for the correct field
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    console.log(`Field: ${name}, Value: ${value}, Type: ${typeof value}`);

    switch (name) {
      case "unit_price":
        setUnitPrice(value);
        validateField(name, value); // Validate unit price
        break;
      case "product_status_id":
        setProductStatusId(value);
        validateField(name, value); // Validate status
        break;
      case "image":
        const file = files[0];
        setImage(file);
        console.log("Image File:", file); // Check if image file is being selected

        validateField(name, file); // Validate image
        break;
      default:
        break;
    }
  };

  const isFormModified = () => {
    return (
      unitPrice !== originalProductData?.unit_price ||
      productStatusId !== originalProductData?.product_status_id ||
      (typeof image === "object" &&
        image !== null &&
        image !== originalProductData?.image) // Only mark as modified if a new file is uploaded
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("product_id", product_id);

    variations.forEach((variation, index) => {
      formData.append(`variations[${index}][type]`, variation.type);
      formData.append(`variations[${index}][value]`, variation.value);
      formData.append(`variations[${index}][unit_price]`, variation.unit_price);
      formData.append(`variations[${index}][sku]`, variation.sku);
      if (variation.image) {
        formData.append("images", variation.image, variation.image.name);
      }
    });

    try {
      const response = await createProductVariationWithInventory(formData);
      const productVariationsData = await getAllProductVariations();
      setProductVariations(productVariationsData);
      setProductId("");
      setVariations([
        {
          type: "",
          value: "",
          sku: "",
          unit_price: "",
          image: null,
        },
      ]);
      console.log("Product variation added:", response);
      toast.success("Product variation added successfully.");
    } catch (error) {
      console.error("Error saving product variation:", error);
      toast.error("Error saving product variation. Please try again.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formErrors = validateEditProductVariationForm({
      unit_price: unitPrice, // Use state variable
      product_status_id: productStatusId, // Use state variable
    });

    setErrors(formErrors);

    // If there are validation errors, prevent submission
    if (Object.values(formErrors).some((error) => error !== "")) {
      toast.error("Please fill out all required fields correctly.");
      return;
    }

    const formData = new FormData();

    // Append only modified fields
    if (unitPrice !== selectedProductVariation.unit_price) {
      formData.append("unit_price", unitPrice);
    }
    if (productStatusId !== selectedProductVariation.product_status_id) {
      formData.append("product_status_id", productStatusId);
    }

    if (image && typeof image !== "string") {
      formData.append("image", image, image.name);
    }

    try {
      const response = await updateProductVariation(
        selectedProductVariation.variation_id,
        formData,
      );
      const updatedVariations = await getAllProductVariations();
      setProductVariations(updatedVariations);
      setIsEditModalVisible(false);
      console.log("Product variation successfully updated:", response);
      toast.success("Product variation updated successfully.");
    } catch (error) {
      console.error("Error updating product variation:", error);
      toast.error("Error updating product variation. Please try again.");
    }
  };

  // Handle Edit Modal
  const handleEdit = (product_variation) => {
    setSelectedProductVariation(product_variation);
    setOriginalProductData(product_variation);
    setProductId(product_variation.product_id || "");
    setType(product_variation.type || "");
    setValue(product_variation.value || "");
    setSku(product_variation.sku || "");
    setUnitPrice(product_variation.unit_price || "");
    setProductStatusId(product_variation.product_status_id || "");
    setImage(
      product_variation.image
        ? `http://localhost:3001/uploads/${product_variation.image.split("/").pop()}`
        : null,
    );
    setIsEditModalVisible(true);
    setErrors({});
  };

  // Handle Archive
  const handleArchive = async (selectedProductVariation) => {
    if (!selectedProductVariation) return;

    const isConfirmed = window.confirm(
      "Are you sure you want to archive this product variation?",
    );
    if (!isConfirmed) return;

    try {
      const response = await archiveProductVariation(
        selectedProductVariation.variation_id,
      );
      const productVariationsData = await getAllProductVariations();
      setProductVariations(productVariationsData);
      console.log("Product variation archived:", response);
      toast.success("Product variation archived successfully.");
    } catch (error) {
      console.error("Error archiving product variation: ", error);
    }
  };

  const handleColumnSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const filteredVariations = product_variations
    .filter((variation) => {
      // Check if variation matches the search term
      const matchesSearch = search
        ? variation.product_name.toLowerCase().includes(search.toLowerCase()) ||
          variation.type.toLowerCase().includes(search.toLowerCase()) ||
          variation.value.toLowerCase().includes(search.toLowerCase()) ||
          variation.sku.toLowerCase().includes(search.toLowerCase()) ||
          (variation.status_description &&
            variation.status_description
              .toLowerCase()
              .includes(search.toLowerCase()))
        : true;

      const matchesProduct = selectedProduct
        ? variation.product_id === parseInt(selectedProduct)
        : true;

      const matchesStatus = selectedStatus
        ? variation.product_status_id === parseInt(selectedStatus)
        : true;

      const matchesArchived =
        showArchived || variation.status_description !== "Archived";

      return (
        matchesSearch && matchesProduct && matchesStatus && matchesArchived
      );
    })
    .sort((a, b) => {
      if (sortField === "unit_price") {
        // Ensure prices are treated as numbers
        const priceA = parseFloat(a[sortField]) || 0;
        const priceB = parseFloat(b[sortField]) || 0;

        // Compare based on ascending or descending order
        return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
      } else {
        // Default string comparison for other fields
        if (sortOrder === "asc") {
          return a[sortField] > b[sortField] ? 1 : -1;
        } else {
          return a[sortField] < b[sortField] ? 1 : -1;
        }
      }
    });

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
        image: null,
      },
    ]);
  };

  const deleteVariation = (index) => {
    const newVariations = variations.filter((_, i) => i !== index);
    setVariations(newVariations);
  };

  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <strong className="text-3xl font-bold text-gray-500">
            Product Variations
          </strong>
        </div>

        {/* Tabs for switching views */}
        <div className="border-b border-gray-300 mb-4">
          <button
            className={`px-4 py-2 ${
              activeTab === "view"
                ? "text-pink-400 border-b-2 border-pink-400"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("view")}
          >
            View Product Variations
          </button>
          <button
            className={`px-4 py-2 ml-4 ${
              activeTab === "add"
                ? "text-pink-400 border-b-2 border-pink-400"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("add")}
          >
            Add Product Variations
          </button>
        </div>

        {/* Filter */}
        {activeTab === "view" && (
          <div className="mb-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search Product Variations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md h-10 px-4 border rounded-xl bg-gray-50 border-slate-300 focus:outline-none focus:border-pink-400 focus:bg-white"
            />
            {/* Product Filter */}
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-[150px] h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
            >
              <option value="">All Products</option>
              {products.map((product) => (
                <option key={product.product_id} value={product.product_id}>
                  {product.name}
                </option>
              ))}
            </select>
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-[150px] h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
            >
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option key={status.status_id} value={status.status_id}>
                  {status.description}
                </option>
              ))}
            </select>
            {/* Other filters */}
            <input
              type="checkbox"
              checked={showArchived}
              onChange={() => setShowArchived(!showArchived)}
              className="ml-2"
            />
            <label className="ml-2">Show Archived</label>
          </div>
        )}

        {activeTab === "view" ? (
          <ProductVariationTable
            filteredVariations={filteredVariations}
            onEdit={handleEdit}
            onArchive={handleArchive}
            sortField={sortField}
            sortOrder={sortOrder}
            handleColumnSort={handleColumnSort}
          />
        ) : (
          <AddProductVariationPage
            handleSubmit={handleSubmit}
            handleVariationChange={handleVariationChange}
            handleImageChange={handleImageChange}
            product_id={product_id}
            setProductId={setProductId}
            products={products}
            variations={variations}
            addVariation={addVariation}
            deleteVariation={deleteVariation}
          />
        )}
      </div>

      {/* Edit Modal */}
      <EditProductVariationModal
        isEditModalVisible={isEditModalVisible}
        handleUpdate={handleUpdate}
        handleCloseModal={handleCloseModal}
        handleInputChange={handleInputChange}
        isFormModified={isFormModified}
        setProductId={setProductId}
        product_id={product_id}
        products={products}
        type={type}
        setType={setType}
        value={value}
        setValue={setValue}
        sku={sku}
        unitPrice={unitPrice}
        setUnitPrice={setUnitPrice}
        image={image}
        setImage={setImage}
        productStatusId={productStatusId}
        setProductStatusId={setProductStatusId}
        statuses={statuses}
        errors={errors}
      />
    </Fragment>
  );
};

export default ProductVariations;
