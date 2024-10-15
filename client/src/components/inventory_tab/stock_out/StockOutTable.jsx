import React, { useState, useRef, useEffect } from "react";
import { MdDelete, MdAddBox } from "react-icons/md";
import ReactDOM from "react-dom";

const StockOutTable = ({
  columns,
  productVariations,
  inventories,
  stockOutProducts,
  setStockOutProducts,
}) => {
  // Initialize rows with a default row if stockOutProducts is empty
  const [rows, setRows] = useState(() => {
    if (stockOutProducts && stockOutProducts.length > 0) {
      return stockOutProducts.map((product) => ({
        ...product,
        searchTerm: product.product_name || "",
        isDropdownVisible: false,
      }));
    } else {
      return [
        {
          variation_id: "",
          product_name: "",
          sku: "",
          quantity: 1,
          reason: "",
          searchTerm: "",
          isDropdownVisible: false,
        },
      ];
    }
  });

  // Ensure stockOutProducts is initialized with a default row
  useEffect(() => {
    if (!stockOutProducts || stockOutProducts.length === 0) {
      setStockOutProducts([
        {
          variation_id: "",
          product_name: "",
          sku: "",
          quantity: 1,
          reason: "",
        },
      ]);
    }
  }, [stockOutProducts, setStockOutProducts]);

  // Refs and state for dropdown positioning
  const inputRefs = useRef([]);
  const dropdownRefs = useRef([]);
  const [dropdownPositions, setDropdownPositions] = useState([]);

  // Handle adding a new row
  const handleAddRow = () => {
    const newRow = {
      variation_id: "",
      product_name: "",
      sku: "",
      quantity: 1,
      reason: "",
      searchTerm: "",
      isDropdownVisible: false,
    };
    setRows([...rows, newRow]);
    setStockOutProducts([...stockOutProducts, newRow]);
  };

  // Handle deleting a row
  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    setStockOutProducts(updatedRows);
  };

  // Handle variation selection
  const handleVariationChange = (index, variation) => {
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      variation_id: variation.variation_id,
      product_name: `${variation.product_name} - ${variation.type}: ${variation.value}`,
      sku: variation.sku,
      searchTerm: variation.product_name,
      isDropdownVisible: false,
    };
    setRows(updatedRows);
    setStockOutProducts(updatedRows);
  };

  // Handle search input change
  const handleSearchChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].searchTerm = value;
    updatedRows[index].isDropdownVisible = true;
    setRows(updatedRows);
    updateDropdownPosition(index);
  };

  // Update dropdown position for a specific index
  const updateDropdownPosition = (index) => {
    const inputElement = inputRefs.current[index];
    if (inputElement) {
      const rect = inputElement.getBoundingClientRect();
      const position = {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      };
      const updatedPositions = [...dropdownPositions];
      updatedPositions[index] = position;
      setDropdownPositions(updatedPositions);
    }
  };

  // Handle click outside to close dropdowns
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

  // Handle reason change
  const handleReasonChange = (index, reason) => {
    const updatedRows = [...rows];
    updatedRows[index].reason = reason;
    setRows(updatedRows);
    setStockOutProducts(updatedRows);
  };

  // Filter variations based on the search term
  const getFilteredVariations = (searchTerm) =>
    productVariations.filter(
      (variation) =>
        variation.product_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        variation.value.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  return (
    <div className="overflow-x-auto pt-4">
      <div className="flex justify-end pr-6">
        <MdAddBox
          fontSize={30}
          className="text-gray-400 mb-2 hover:text-green-500 active:text-green-600 cursor-pointer"
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
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gradient-to-b from-pink-400 to-pink-500 text-gray-100 text-left text-md font-semibold uppercase tracking-wider"
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
                {/* Index */}
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  {index + 1}
                </td>
                {/* Variation Searchable Dropdown */}
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left relative">
                  <input
                    type="text"
                    placeholder="Search Product Variation"
                    value={row.searchTerm}
                    onChange={(e) => handleSearchChange(index, e.target.value)}
                    onFocus={() => {
                      handleSearchChange(index, row.searchTerm);
                      updateDropdownPosition(index);
                    }}
                    className="w-64 border border-gray-200 rounded px-2 py-1 text-left"
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                  {row.isDropdownVisible &&
                    dropdownPositions[index] &&
                    ReactDOM.createPortal(
                      <div
                        ref={(el) => (dropdownRefs.current[index] = el)}
                        className="bg-white border border-slate-300 rounded-md z-20 max-h-40 overflow-y-auto"
                        style={{
                          position: "absolute",
                          top: `${dropdownPositions[index].top}px`,
                          left: `${dropdownPositions[index].left}px`,
                          width: `${dropdownPositions[index].width}px`,
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

                {/* SKU */}
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  {row.sku || ""}
                </td>

                {/* Current Stock Quantity */}
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  {inventories.find(
                    (inventory) => inventory.variation_id === row.variation_id,
                  )?.stock_quantity || 0}
                </td>

                {/* Quantity to be stocked out*/}
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  <input
                    type="number"
                    min="1"
                    value={row.quantity || 1}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      if (value > 0) {
                        const updatedRows = [...rows];
                        updatedRows[index].quantity = value;
                        setRows(updatedRows);
                        setStockOutProducts(updatedRows);
                      }
                    }}
                    className="w-20 border border-gray-200 rounded px-2 py-1 text-left"
                  />
                </td>

                {/* Reason */}
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  <input
                    type="text"
                    value={row.reason || ""}
                    onChange={(e) => handleReasonChange(index, e.target.value)}
                    className="w-full border border-gray-200 rounded px-2 py-1 text-left"
                  />
                </td>

                {/* Delete Button */}
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

export default StockOutTable;
