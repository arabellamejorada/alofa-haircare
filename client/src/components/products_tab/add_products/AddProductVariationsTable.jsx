import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { MdDelete } from "react-icons/md";

const AddProductVariationsTable = ({
  variations = [],
  handleVariationChange,
  handleImageChange,
  addVariationRow,
  deleteVariationRow,
  existingProduct,
  variationErrors = [],
  existingProductFormErrors,
  setExistingProductFormErrors,
  products,
  setProductId,
  showAddDeleteButtons = true,
  searchTerm,
  setSearchTerm,
}) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (searchTerm) {
      const results = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleProductSelect = (product) => {
    setProductId(product); // Set the selected product ID in state
    setSearchTerm(product.name); // Set the search term to the selected product name
    setIsDropdownVisible(false); // Hide the dropdown after selection

    // Clear the error message for product_search when a product is selected
    setExistingProductFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.product_search; // Remove the product_search error
      return updatedErrors;
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
    setProductId(null);
    setFilteredProducts(products);
    setIsDropdownVisible(false);
    setExistingProductFormErrors((prevErrors) => ({
      ...prevErrors,
      product_search: "Please select a product",
    }));
  };

  return (
    <div className="pt-4 w-full max-w-full">
      {existingProduct && (
        <div className="relative w-full">
          {/* Input Box for Product Name Search/Select */}
          <div className="relative w-1/3">
            <label className="font-bold" htmlFor="product">
              Product Name:
            </label>
            <input
              type="text"
              placeholder="Search Product"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownVisible(true);

                // Live Validation for Product Search
                if (e.target.value.trim() === "") {
                  setExistingProductFormErrors((prevErrors) => ({
                    ...prevErrors,
                    product_search: "Please select a product",
                  }));
                } else {
                  setExistingProductFormErrors((prevErrors) => {
                    const updatedErrors = { ...prevErrors };
                    delete updatedErrors.product_search;
                    return updatedErrors;
                  });
                }
              }}
              onFocus={() => setIsDropdownVisible(true)}
              className={`w-full rounded-2xl border border-gray-300 h-10 px-4 pr-8 mt-2 bg-white text-gray-500 focus:outline-none focus:border-alofa-pink focus:bg-white ${
                existingProductFormErrors.product_search ? "border-red-500" : ""
              }`}
              ref={inputRef}
            />
            {existingProductFormErrors.product_search && (
              <p className="text-red-500 text-xs mt-1">
                {existingProductFormErrors.product_search}
              </p>
            )}

            {/* Clear Search Button */}
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 text-gray-500 hover:text-alofa-pink"
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
          </div>
          {/* Dropdown for Filtered Products */}
          {isDropdownVisible &&
            ReactDOM.createPortal(
              <div
                ref={dropdownRef}
                className="bg-white border border-slate-300 rounded-md z-20 max-h-40 overflow-y-auto"
                style={{
                  position: "absolute",
                  top: `${inputRef.current?.getBoundingClientRect().bottom + window.scrollY}px`,
                  left: `${inputRef.current?.getBoundingClientRect().left + window.scrollX}px`,
                  width: `${inputRef.current?.getBoundingClientRect().width}px`,
                }}
              >
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div
                      key={product.product_id}
                      onClick={() => handleProductSelect(product)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {product.name}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">
                    No products found
                  </div>
                )}
              </div>,
              document.body,
            )}
        </div>
      )}
      <p className="text-sm text-gray-500 mt-2">
        *SKU is auto-generated but you can also provide your own
      </p>
      <div className="w-full bg-white shadow-md rounded-lg overflow-hidden mt-2">
        <table className="w-full leading-normal">
          <thead className="w-full">
            <tr>
              <th className="px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-center text-md font-semibold text-gray-600 uppercase">
                #
              </th>
              <th className="px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-center text-md font-semibold text-gray-600 uppercase">
                Variation Type
              </th>
              <th className="px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-center text-md font-semibold text-gray-600 uppercase">
                Variation Value
              </th>
              <th className="px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-center text-md font-semibold text-gray-600 uppercase w-[8rem]">
                Unit Price
              </th>
              <th className="px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-center text-md font-semibold text-gray-600 uppercase">
                *SKU
              </th>
              <th className="px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-center text-md font-semibold text-gray-600 uppercase">
                Image
              </th>
              {showAddDeleteButtons && (
                <th className="px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-center text-md font-semibold text-gray-600 uppercase">
                  Delete
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {variations.map((variation, index) => (
              <tr key={index}>
                {/* Index */}
                <td className="px-2 py-1 border-b border-gray-200 text-sm text-center">
                  {index + 1}
                </td>

                {/* Variation Type */}
                <td className="px-2 py-1 border-b border-gray-200 text-sm text-center">
                  <select
                    value={variation.type}
                    onChange={(e) =>
                      handleVariationChange(index, "type", e.target.value)
                    }
                    className={`w-full border rounded px-2 py-1 text-center appearance-none ${
                      variationErrors[index] && variationErrors[index].type
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  >
                    <option value="">Select Type</option>
                    <option value="Size">Size</option>
                    <option value="Color">Color</option>
                    <option value="Default">Default</option>
                  </select>
                  {variationErrors[index]?.type && (
                    <p className="text-red-500 text-xs mt-1">
                      {variationErrors[index].type}
                    </p>
                  )}
                </td>

                {/* Variation Value */}
                <td className="px-2 py-1 border-b border-gray-200 text-sm text-center">
                  <input
                    type="text"
                    disabled={variation.type === "Default"}
                    value={
                      variation.type === "Default"
                        ? (variation.value = "N/A")
                        : variation.value
                    }
                    placeholder={
                      variation.type === "Size"
                        ? "e.g. 30mL"
                        : variation.type === "Color"
                          ? "e.g. Sunrise"
                          : ""
                    }
                    onChange={(e) =>
                      handleVariationChange(index, "value", e.target.value)
                    }
                    className={`w-full border rounded px-2 py-1 text-center ${
                      variationErrors[index] && variationErrors[index].value
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  />
                  {variationErrors[index] && variationErrors[index].value && (
                    <p className="text-red-500 text-xs mt-1">
                      {variationErrors[index].value}
                    </p>
                  )}
                </td>

                {/* Unit Price */}
                <td className="px-2 py-1 border-b border-gray-200 text-sm text-center">
                  <input
                    type="number"
                    value={variation.unit_price}
                    placeholder="0.00"
                    onChange={(e) =>
                      handleVariationChange(index, "unit_price", e.target.value)
                    }
                    className={`w-full border rounded px-2 py-1 text-center ${
                      variationErrors[index] &&
                      variationErrors[index].unit_price
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  />
                  {variationErrors[index] &&
                    variationErrors[index].unit_price && (
                      <p className="text-red-500 text-xs mt-1">
                        {variationErrors[index].unit_price}
                      </p>
                    )}
                </td>

                {/* SKU */}
                <td className="px-2 py-1 border-b border-gray-200 text-sm text-center">
                  <input
                    type="text"
                    value={variation.sku}
                    placeholder="e.g. 123456"
                    onChange={(e) =>
                      handleVariationChange(index, "sku", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded px-2 py-1 text-center"
                  />
                </td>

                {/* Image */}
                <td className="px-2 py-1 border-b border-gray-200 text-sm text-center">
                  <div className="flex items-center gap-4">
                    {/* Image preview */}
                    {variation.image && (
                      <img
                        src={
                          typeof variation.image === "string"
                            ? variation.image
                            : URL.createObjectURL(variation.image)
                        }
                        alt="Uploaded Preview"
                        className="w-12 h-12 object-cover rounded-md border border-gray-300"
                      />
                    )}

                    {/* File input */}
                    <div className="flex items-center gap-2">
                      <label className="flex items-center px-4 py-2 text-sm font-medium text-white bg-alofa-pink rounded-lg cursor-pointer hover:bg-alofa-dark">
                        Choose File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageChange(index, e.target.files[0])
                          }
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </td>

                {/* Delete */}
                {showAddDeleteButtons && (
                  <td className="px-2 py-1 border-b border-gray-200 text-sm text-center">
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => deleteVariationRow(index)}
                    >
                      <MdDelete fontSize={24} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add More Variation Button */}
      {showAddDeleteButtons && (
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={addVariationRow}
            className="flex items-center gap-2 px-6 py-2 text-white bg-alofa-pink hover:bg-alofa-dark rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105"
          >
            <span>+</span> Add Row
          </button>
        </div>
      )}
    </div>
  );
};

export default AddProductVariationsTable;
