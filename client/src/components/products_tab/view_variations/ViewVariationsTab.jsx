import React, { Fragment, useState, useEffect } from "react";
import EditProductVariationModal from "./EditProductVariationModal";
import ProductVariationTable from "./ProductVariationTable";
import ConfirmModal from "../../shared/ConfirmModal";
import FilterProductsAndVariationsTable from "../FilterProductsAndVariationsTable";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import {
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

const VariationsTab = () => {
  const [product_variations, setProductVariations] = useState([]);
  const [products, setProducts] = useState([]);
  const [statuses, setStatus] = useState([]);
  const [originalProductData, setOriginalProductData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("variation_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [errors, setErrors] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productVariationsData = await getAllProductVariations();
        const productsData = await getAllProducts();
        let statusData = await getStatus();
        // Map to only available and archived statuses
        statusData = statusData.filter(
          (status) =>
            status.description.toLowerCase() === "available" ||
            status.description.toLowerCase() === "archived",
        );
        setProductVariations(productVariationsData);
        setProducts(productsData);
        setStatus(statusData);
      } catch (err) {
        toast.error("Error fetching product variations.");
      } finally {
        setLoading(false);
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
    // console.log(`Validating ${name}: ${value}`);

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

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formErrors = validateEditProductVariationForm({
      unit_price: unitPrice,
      product_status_id: productStatusId,
    });

    setErrors(formErrors);

    // If there are validation errors, prevent submission
    if (Object.values(formErrors).some((error) => error !== "")) {
      toast.error("Please fill out all required fields correctly.");
      return;
    }

    const formData = new FormData();

    formData.append("unit_price", unitPrice);
    formData.append("product_status_id", productStatusId);

    if (image && typeof image !== "string") {
      formData.append("image", image, image.name);
    }

    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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
    setConfirmMessage(
      `Are you sure you want to archive ${selectedProductVariation.product_name} - ${selectedProductVariation.value}?`,
    );
    setConfirmAction(() => async () => {
      try {
        setLoading(true);
        const response = await archiveProductVariation(
          selectedProductVariation.variation_id,
        );
        const productVariationsData = await getAllProductVariations();
        setProductVariations(productVariationsData);
        console.log("Product variation archived:", response);
        toast.success("Product variation archived successfully.");
      } catch (error) {
        console.error("Error archiving product variation: ", error);
        toast.error("Error archiving product variation. Please try again.");
      } finally {
        setLoading(false);
        setIsConfirmModalOpen(false);
      }
    });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmClose = () => {
    setIsConfirmModalOpen(false);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
  };

  const handleColumnSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const filteredVariations = product_variations
    .filter((variation) => {
      // console.log("Variation:", variation);
      const matchesSearch = search
        ? (variation.product_name || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (variation.type || "").toLowerCase().includes(search.toLowerCase()) ||
          (variation.value || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (variation.sku || "").toLowerCase().includes(search.toLowerCase()) ||
          (variation.status_description || "")
            .toLowerCase()
            .includes(search.toLowerCase())
        : true;

      const matchesStatus = selectedStatus
        ? variation.product_status_id === parseInt(selectedStatus)
        : !showArchived
          ? variation.status_description.toLowerCase() !== "archived"
          : true;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aField = a[sortField] || "";
      const bField = b[sortField] || "";
      if (sortField === "unit_price" || sortField === "variation_id") {
        return sortOrder === "asc" ? aField - bField : bField - aField;
      } else {
        return sortOrder === "asc"
          ? aField > bField
            ? 1
            : -1
          : aField < bField
            ? 1
            : -1;
      }
    });

  const handleSearchChange = (e) => setSearch(e.target.value.toLowerCase());
  const handleStatusChange = (e) => setSelectedStatus(e.target.value);

  return (
    <Fragment>
      <div className="relative">
        {loading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
            <ClipLoader size={50} color="#E53E3E" loading={loading} />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center justify-between">
            <strong className="text-3xl font-bold text-gray-500">
              Product Variations
            </strong>
          </div>
          {/* Filters Section */}
          <FilterProductsAndVariationsTable
            search={search}
            setSearch={setSearch}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            handleStatusChange={handleStatusChange}
            statuses={statuses}
            showArchived={showArchived}
            setShowArchived={setShowArchived}
            handleSearchChange={handleSearchChange}
          />

          <ProductVariationTable
            filteredVariations={filteredVariations}
            onEdit={handleEdit}
            onArchive={handleArchive}
            sortField={sortField}
            sortOrder={sortOrder}
            handleColumnSort={handleColumnSort}
          />

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
        </div>

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={handleConfirmClose}
          onConfirm={handleConfirm}
          message={confirmMessage}
        />
      </div>
    </Fragment>
  );
};

export default VariationsTab;
