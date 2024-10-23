import React, { useState, useEffect } from "react";
import AddProductVariationsTable from "./AddProductVariationsTable";
import { validateAddProductVariationForm } from "../../../lib/consts/utils/validationUtils";
import {
  createProductWithVariationAndInventory,
  getAllProducts,
} from "../../../api/products";
import { toast } from "sonner";

const AddExistingProductVariations = () => {
  const [existingProductVariations, setExistingProductVariations] = useState([
    {
      type: "",
      value: "",
      unit_price: "",
      sku: "",
      image: null,
    },
  ]);
  const [existingProductFormErrors, setExistingProductFormErrors] = useState({
    variations: [{}],
  });
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
      } catch (err) {
        console.error("Failed to fetch products.");
      }
    };
    fetchData();
  }, []);

  // Function to handle variation change
  const handleVariationChange = (index, field, value) => {
    const updatedVariations = [...existingProductVariations];
    updatedVariations[index][field] = value;
    setExistingProductVariations(updatedVariations);

    // Perform live validation for variations and update variationErrors
    setExistingProductFormErrors((prevErrors) => {
      const updatedVariationErrors = [...(prevErrors.variations || [])];
      if (!updatedVariationErrors[index]) {
        updatedVariationErrors[index] = {};
      }

      // Add or clear errors based on the new value
      if (field === "type" && !value.trim()) {
        updatedVariationErrors[index].type = "Variation type is required";
      } else if (
        field === "value" &&
        updatedVariations[index].type !== "Default" &&
        !value.trim()
      ) {
        updatedVariationErrors[index].value = "Variation value is required";
      } else if (
        field === "unit_price" &&
        (!value.trim() || parseFloat(value) <= 0)
      ) {
        updatedVariationErrors[index].unit_price = "Price is required";
      } else {
        // If the current field has no issue, remove the error for that field
        delete updatedVariationErrors[index][field];
      }

      // Set the updated error messages
      return {
        ...prevErrors,
        variations: updatedVariationErrors,
      };
    });
  };

  // Function to handle image change for a variation
  const handleImageChange = (index, file) => {
    const updatedVariations = [...existingProductVariations];
    updatedVariations[index].image = file;
    setExistingProductVariations(updatedVariations);
  };

  // Function to add a new variation row
  const addVariationRow = () => {
    setExistingProductVariations((prevVariations) => [
      ...prevVariations,
      {
        type: "",
        value: "",
        unit_price: "",
        sku: "",
        image: null,
      },
    ]);
    setExistingProductFormErrors((prevErrors) => ({
      ...prevErrors,
      variations: [...(prevErrors.variations || []), {}],
    }));
  };

  // Function to delete a variation row
  const deleteVariationRow = (index) => {
    setExistingProductVariations((prevVariations) => {
      const updatedVariations = prevVariations.filter((_, i) => i !== index);
      return updatedVariations;
    });
    setExistingProductFormErrors((prevErrors) => {
      if (!prevErrors.variations) {
        return prevErrors;
      }
      const updatedVariationsErrors = prevErrors.variations.filter(
        (_, i) => i !== index,
      );
      return {
        ...prevErrors,
        variations: updatedVariationsErrors,
      };
    });
  };
  const handleSubmitExistingProduct = async (e) => {
    e.preventDefault();

    // Validate variations and selected product
    const variationErrors = validateAddProductVariationForm(
      existingProductVariations,
    );
    let productSearchError = "";
    if (!productId) {
      productSearchError = "Please select a product";
    }

    // Set errors to state
    setExistingProductFormErrors({
      product_search: productSearchError,
      variations: variationErrors,
    });

    console.log("Submission errors:", productSearchError, variationErrors);
    toast.error("Please fill in all required fields");

    // If there are no errors, proceed with form submission
    if (
      !productSearchError &&
      variationErrors.every((error) => Object.keys(error).length === 0)
    ) {
      try {
        const formData = new FormData();

        // Append product ID
        formData.append("product_id", productId.product_id);

        // Append variations if they exist and are in an array
        if (Array.isArray(existingProductVariations)) {
          existingProductVariations.forEach((variation, index) => {
            formData.append(`variations[${index}][type]`, variation.type);
            formData.append(`variations[${index}][value]`, variation.value);
            formData.append(
              `variations[${index}][unit_price]`,
              variation.unit_price,
            );
            formData.append(`variations[${index}][sku]`, variation.sku);
            if (variation.image) {
              formData.append("images", variation.image); // Append images as files
            }
          });
        }

        await createProductWithVariationAndInventory(formData);
        console.log("Variations added successfully!");
        toast.success("Variations added successfully!");

        setExistingProductVariations([
          { type: "", value: "", unit_price: "", sku: "", image: null },
        ]);
        setExistingProductFormErrors({ variations: [{}] });
        setProductId(""); // Clear selected product ID
        setSearchTerm(""); // Clear search term
        setExistingProductFormErrors({});
      } catch (error) {
        console.error("Error adding variations:", error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmitExistingProduct}
      className="bg-white p-6 rounded-lg shadow-md w-full"
    >
      <AddProductVariationsTable
        variations={existingProductVariations || []} // Ensure variations is an array
        handleVariationChange={handleVariationChange}
        handleImageChange={handleImageChange}
        addVariationRow={addVariationRow}
        deleteVariationRow={deleteVariationRow}
        products={products}
        productId={productId}
        setProductId={setProductId}
        existingProduct={true}
        variationErrors={existingProductFormErrors.variations || []}
        existingProductFormErrors={existingProductFormErrors}
        setExistingProductFormErrors={setExistingProductFormErrors}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <button
        type="submit"
        className="bg-pink-500 text-white rounded py-2 px-4 mt-4 shadow-md hover:bg-pink-600"
      >
        Submit
      </button>
    </form>
  );
};

export default AddExistingProductVariations;
