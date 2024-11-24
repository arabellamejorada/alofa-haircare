import React, { useState, useRef, useEffect } from "react";
import { MdDelete, MdAddBox } from "react-icons/md";
import ReactDOM from "react-dom";

const StockInTable = ({
  columns,
  productVariations,
  stockInProducts,
  setStockInProducts,
  errors,
  setErrors,
}) => {
  const [rows, setRows] = useState(() => {
    return stockInProducts.length > 0
      ? stockInProducts.map((product) => ({
          ...product,
          searchTerm: product.product_name || "",
          isDropdownVisible: false,
        }))
      : [
          {
            variation_id: "",
            quantity: 1,
            product_name: "",
            searchTerm: "",
            isDropdownVisible: false,
            sku: "",
            type: "",
            value: "",
          },
        ];
  });

  useEffect(() => {
    if (stockInProducts.length === 0) {
      const defaultRow = {
        variation_id: "",
        quantity: 1,
        product_name: "",
        searchTerm: "",
        isDropdownVisible: false,
        sku: "",
        type: "",
        value: "",
      };
      setRows([defaultRow]);
      setStockInProducts([defaultRow]);
    } else {
      setRows(
        stockInProducts.map((product) => ({
          ...product,
          searchTerm: product.product_name || "",
          isDropdownVisible: false,
        })),
      );
    }
  }, [stockInProducts, setStockInProducts]);

  // Add new state to track selected variations
  const [selectedVariations, setSelectedVariations] = useState([]);

  const inputRefs = useRef([]);
  const dropdownRefs = useRef([]);

  const handleAddRow = () => {
    const newRow = {
      variation_id: "",
      quantity: 1,
      product_name: "",
      searchTerm: "",
      isDropdownVisible: false,
      sku: "",
      type: "",
      value: "",
    };
    const updatedRows = [...rows, newRow];
    setRows(updatedRows);
    setStockInProducts(updatedRows);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    const removedVariationId = rows[index].variation_id;

    // Update selected variations
    const updatedSelectedVariations = selectedVariations.filter(
      (id) => id !== removedVariationId,
    );

    setSelectedVariations(updatedSelectedVariations); // Update state
    setRows(updatedRows);
    setStockInProducts(updatedRows);
  };

  const handleQuantityChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].quantity = value > 0 ? value : 1;
    setRows(updatedRows);
    setStockInProducts(updatedRows);
  };

  const handleVariationChange = (index, variation) => {
    const updatedRows = [...rows];

    // Ensure that the index is within the bounds of the rows array
    if (index < 0 || index >= updatedRows.length) return;

    // Track previous variation ID
    const previousVariationId = updatedRows[index].variation_id;

    // Remove the previous variation ID from the selected variations
    let updatedSelectedVariations = [...selectedVariations];
    if (previousVariationId) {
      updatedSelectedVariations = updatedSelectedVariations.filter(
        (id) => id !== previousVariationId,
      );
    }

    // Add the newly selected variation ID
    updatedSelectedVariations.push(variation.variation_id);

    // Update the selected row with the new variation
    updatedRows[index] = {
      ...updatedRows[index],
      variation_id: variation.variation_id,
      product_name: variation.product_name,
      sku: variation.sku,
      type: variation.type,
      value: variation.value,
      searchTerm: variation.product_name,
      isDropdownVisible: false,
    };

    // Ensure errors array has enough elements
    const updatedErrors = [...errors];
    while (updatedErrors.length <= index) {
      updatedErrors.push({ variation: false, quantity: false });
    }
    updatedErrors[index].variation = false;

    // Update states
    setRows(updatedRows);
    setStockInProducts(updatedRows);
    setSelectedVariations(updatedSelectedVariations);
    setErrors(updatedErrors);
  };

  const handleSearchChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].searchTerm = value;
    updatedRows[index].isDropdownVisible = true;

    setRows(updatedRows);
  };

  const clearSearch = (index) => {
    const updatedRows = [...rows];
    const clearedVariationId = updatedRows[index].variation_id;

    updatedRows[index] = {
      ...updatedRows[index],
      variation_id: "",
      product_name: "",
      searchTerm: "",
      sku: "",
      type: "",
      value: "",
      isDropdownVisible: false,
    };

    // Update selected variations
    const updatedSelectedVariations = selectedVariations.filter(
      (id) => id !== clearedVariationId,
    );

    errors[index].variation = true;

    setSelectedVariations(updatedSelectedVariations);
    setRows(updatedRows);
    setStockInProducts(updatedRows);
  };

  const handleClickOutside = (event) => {
    const isClickInsideDropdown = dropdownRefs.current.some(
      (ref) => ref && ref.contains(event.target),
    );
    const isClickInsideInput = inputRefs.current.some(
      (ref) => ref && ref.contains(event.target),
    );
    if (!isClickInsideDropdown && !isClickInsideInput) {
      setRows((prevRows) =>
        prevRows.map((row) => ({ ...row, isDropdownVisible: false })),
      );
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter variations excluding already selected ones
  const getFilteredVariations = (searchTerm) =>
    productVariations
      .filter(
        (variation) =>
          variation.product_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          variation.value?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .filter(
        (variation) => !selectedVariations.includes(variation.variation_id),
      );

  return (
    <div className="overflow-x-auto pt-4">
      <div className="flex justify-end pr-6">
        <MdAddBox
          fontSize={40}
          className="text-gray-400 mb-2 hover:text-alofa-highlight active:text-alofa-pink"
          onClick={handleAddRow}
        />
      </div>
      <div className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-alofa-pink text-gray-100 text-left text-md font-semibold uppercase tracking-wider">
                #
              </th>
              {columns
                .filter(
                  (column) =>
                    column.key !== "stock_in_date" && column.key !== "supplier",
                )
                .map((column) => (
                  <th
                    className="px-5 py-3 border-b-2 border-gray-200 bg-alofa-pink text-gray-100 text-left text-md font-semibold uppercase tracking-wider"
                    key={column.key}
                  >
                    {column.header}
                  </th>
                ))}
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-alofa-pink text-gray-100 text-center text-md font-semibold uppercase tracking-wider">
                Delete
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  {index + 1}
                </td>

                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left relative">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Search Product Variation"
                      value={row.searchTerm}
                      onChange={(e) =>
                        handleSearchChange(index, e.target.value)
                      }
                      onFocus={() => handleSearchChange(index, row.searchTerm)}
                      className={`w-full border rounded-md px-2 py-1 ${
                        errors[index]?.variation
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                      ref={(el) => (inputRefs.current[index] = el)}
                    />
                    {errors[index]?.variation && (
                      <p className="text-red-500 text-xs mt-1">
                        Please select a product
                      </p>
                    )}

                    {row.searchTerm && (
                      <button
                        onClick={() => clearSearch(index)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-alofa-pink"
                        aria-label="Clear search"
                      >
                        &times;
                      </button>
                    )}
                  </div>

                  {row.isDropdownVisible &&
                    ReactDOM.createPortal(
                      <div
                        ref={(el) => (dropdownRefs.current[index] = el)}
                        className="bg-white border border-slate-300 rounded-md z-20 max-h-40 overflow-y-auto"
                        style={{
                          position: "absolute",
                          top: `${inputRefs.current[index]?.getBoundingClientRect().bottom + window.scrollY}px`,
                          left: `${inputRefs.current[index]?.getBoundingClientRect().left + window.scrollX}px`,
                          width: `${inputRefs.current[index]?.getBoundingClientRect().width}px`,
                        }}
                      >
                        {getFilteredVariations(row.searchTerm).length > 0 ? (
                          getFilteredVariations(row.searchTerm).map(
                            (variation) => (
                              <div
                                key={variation.variation_id}
                                onClick={() =>
                                  handleVariationChange(index, variation)
                                }
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                {`${variation.product_name} - ${variation.type}: ${variation.value}`}
                              </div>
                            ),
                          )
                        ) : (
                          <div className="px-4 py-2 text-gray-500">
                            No products found
                          </div>
                        )}
                      </div>,
                      document.body,
                    )}
                </td>

                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  {row.type && row.value ? `${row.type}: ${row.value}` : "N/A"}
                </td>

                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  {row.sku || ""}
                </td>

                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  <input
                    type="number"
                    min="1"
                    value={row.quantity}
                    onChange={(e) =>
                      handleQuantityChange(index, e.target.value)
                    }
                    className={`w-20 border ${
                      errors[index]?.quantity
                        ? "border-red-500"
                        : "border-gray-200"
                    } rounded px-2 py-1`}
                  />
                  {errors[index]?.quantity && (
                    <p className="text-red-500 text-xs mt-1">
                      Quantity must be greater than 0
                    </p>
                  )}
                </td>
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-center">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteRow(index)}
                  >
                    <MdDelete fontSize={30} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockInTable;
