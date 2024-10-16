import React, { useState, useRef, useEffect } from "react";
import { MdDelete, MdAddBox } from "react-icons/md";
import ReactDOM from "react-dom";
import { validateDropdown } from "../../../lib/consts/utils/validationUtils";

const StockInTable = ({
  columns,
  productVariations,
  stockInProducts,
  setStockInProducts,
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
  const [errors, setErrors] = useState(rows.map(() => false));

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
    setRows(updatedRows);
    setStockInProducts(updatedRows);
  };

  const handleVariationChange = (index, variation) => {
    const updatedRows = [...rows];
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

    // Validate and update errors
    const updatedErrors = [...errors];
    updatedErrors[index] = !validateDropdown(variation.variation_id);
    setErrors(updatedErrors);

    setRows(updatedRows);
    setStockInProducts(updatedRows);
  };

  const handleSearchChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].searchTerm = value;
    updatedRows[index].isDropdownVisible = true;

    // Validate when the search term is cleared
    const updatedErrors = [...errors];
    updatedErrors[index] = !validateDropdown(value);
    setErrors(updatedErrors);

    setRows(updatedRows);
  };

  const clearSearch = (index) => {
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      searchTerm: "",
      variation_id: "",
      product_name: "",
      sku: "",
      type: "",
      value: "",
      isDropdownVisible: false,
    };

    // Update error state when clearing the search
    const updatedErrors = [...errors];
    updatedErrors[index] = true; // Mark this row as having an error
    setErrors(updatedErrors);

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

  const getFilteredVariations = (searchTerm) =>
    productVariations.filter(
      (variation) =>
        variation.product_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        variation.value?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  return (
    <div className="overflow-x-auto pt-4">
      <div className="flex justify-end pr-6">
        <MdAddBox
          fontSize={30}
          className="text-gray-400 mb-2 hover:text-pink-400 active:text-pink-500"
          onClick={handleAddRow}
        />
      </div>
      <div className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gradient-to-b from-pink-400 to-pink-500 text-gray-100 text-left text-md font-semibold uppercase tracking-wider">
                #
              </th>
              {columns
                .filter(
                  (column) =>
                    column.key !== "stock_in_date" && column.key !== "supplier",
                )
                .map((column) => (
                  <th
                    className="px-5 py-3 border-b-2 border-gray-200 bg-gradient-to-b from-pink-400 to-pink-500 text-gray-100 text-left text-md font-semibold uppercase tracking-wider"
                    key={column.key}
                  >
                    {column.header}
                  </th>
                ))}
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gradient-to-b from-pink-400 to-pink-500 text-gray-100 text-center text-md font-semibold uppercase tracking-wider">
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
                        errors[index] ? "border-red-500" : "border-gray-200"
                      }`}
                      ref={(el) => (inputRefs.current[index] = el)}
                    />
                    {errors[index] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[index]}
                      </p>
                    )}
                    {row.searchTerm && (
                      <button
                        onClick={() => clearSearch(index)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-pink-500"
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
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      if (value > 0) {
                        const updatedRows = [...rows];
                        updatedRows[index].quantity = value;
                        setRows(updatedRows);
                        setStockInProducts(updatedRows);
                      }
                    }}
                    className="w-20 border border-gray-200 rounded px-2 py-1"
                  />
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
