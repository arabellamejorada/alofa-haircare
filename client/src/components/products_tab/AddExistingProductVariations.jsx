import React, { useState, useEffect } from "react";
import AddProductVariationsTable from "./product_variations/AddProductVariationsTable";
import { validateAddProductVariationForm } from "../../lib/consts/utils/validationUtils";
import {
  createProductWithVariationAndInventory,
  getAllProducts,
} from "../../api/products";

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

    let productSearchError = "";
    if (!productId) {
      console.log(productId);
      productSearchError = "Product selection is required";
    }

    const variationErrors = validateAddProductVariationForm(
      existingProductVariations,
    );

    // Include the product search error in the errors state
    setExistingProductFormErrors({
      product_search: productSearchError,
      variations: variationErrors,
    });
    console.log("errors", existingProductFormErrors);

    // If there are no errors, proceed with form submission
    if (
      !productSearchError &&
      variationErrors.every((error) => Object.keys(error).length === 0)
    ) {
      try {
        await createProductWithVariationAndInventory(
          { product_id: productId },
          existingProductVariations,
        );
        console.log("Variations added successfully!");

        // Reset the form on successful submission
        setExistingProductVariations([
          { type: "", value: "", unit_price: "", sku: "", image: null },
        ]);
        setExistingProductFormErrors({ variations: [{}] });
        setProductId(""); // Clear selected product
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
