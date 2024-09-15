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

  const [product_id, setProductId] = useState("");
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

  // Function to handle form submission
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
      formData.append(`variations[${index}][sku]`, variation.sku);
      formData.append(`variations[${index}][unit_price]`, variation.unit_price);
      formData.append(`variations[${index}][product_status_id]`, variation.product_status_id);
      if (variation.image) {
        formData.append("images", variation.image); // Append the image for each variation
      }
    });

    try {
      let response;
      if (selectedProductVariation) {
        response = await updateProductVariation(selectedProductVariation.variation_id, formData);
        console.log("Product variation updated successfully:", response);
      } else {
        response = await createProductVariationWithInventory(formData);
        console.log("Product variation created successfully:", response);
      }
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

  // Delete a variation
  const deleteVariation = (index) => {
    const newVariations = variations.filter((_, idx) => idx !== index);
    setVariations(newVariations);
  };

  const handleEdit = (product_variation) => {
    console.log("Editing product:", product_variation);
    setSelectedProductVariation(product_variation);
    setProductId(product_variation.product_id || "");
    setVariations([
      {
        type: product_variation.type,
        value: product_variation.value,
        sku: product_variation.sku,
        unit_price: product_variation.unit_price,
        product_status_id: product_variation.product_status_id,
        image: null,
      },
    ]);
    setShowModal(true);
  };

  const handleArchive = async (selectedProductVariation) => {
    if (!selectedProductVariation) return;

    const isConfirmed = window.confirm(
      "Are you sure you want to archive this product variation?"
    );
    if (!isConfirmed) return;

    const data = {
      product_status_id: 4, // Archived status
    };

    try {
      const response = await archiveProductVariation(
        selectedProductVariation.variation_id,
        data
      );
      console.log(response);

      const productVariationsData = await getAllProductVariations();
      setProductVariations(productVariationsData);
    } catch (error) {
      console.error("Error archiving product variation: ", error);
      setError("Failed to update product status to Archived");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
    ]); // Reset the form
  };

  if (error) return <div>{error}</div>;

  const columns = [
    { key: "variation_id", header: "ID" },
    { key: "product_name", header: "Product Name" },
    { key: "type", header: "Variation Type" },
    { key: "value", header: "Variation Value" },
    { key: "sku", header: "SKU" },
    { key: "unit_price", header: "Price" },
    { key: "product_status", header: "Status" },
  ];

  // Map product IDs to names
  const productMap = products.reduce((acc, product) => {
    acc[product.product_id] = product.name;
    return acc;
  }, {});

  // Map status IDs to descriptions
  const statusMap = statuses.reduce((acc, status) => {
    acc[status.status_id] = status.description;
    return acc;
  }, {});

  const processedProductVariations = product_variations
    .map((variation) => ({
      ...variation,
      product_name: productMap[variation.product_id] || "Unknown", // Map name from productMap
      product_status: statusMap[variation.product_status_id] || "Unknown", // Map description from statusMap
    }))
    .sort((a, b) => {
      if (a.product_status_id === 4 && b.product_status_id !== 4) return 1;
      if (a.product_status_id !== 4 && b.product_status_id === 4) return -1;
      return 0;
    });

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
          data={processedProductVariations}
          columns={columns}
          onEdit={handleEdit}
          onArchive={handleArchive}
        />
      </div>

      <Modal isVisible={showModal} onClose={handleCloseModal}>
        <form
          className="p-6 w-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="flex flex-col gap-4">
            <div className="font-extrabold text-2xl md:text-3xl text-pink-400 text-center">
              {selectedProductVariation
                ? "Edit Product Variation"
                : "Add Product Variations"}
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="product_id">
                Product Name:
              </label>
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

            {/* Use the separated ProductVariationsTable component */}
            <ProductVariationsTable
              variations={variations}
              statuses={statuses}
              handleVariationChange={handleVariationChange}
              handleImageChange={handleImageChange}
              addVariation={addVariation}
              deleteVariation={deleteVariation}
            />

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
    </Fragment>
  );
};

export default ProductVariations;