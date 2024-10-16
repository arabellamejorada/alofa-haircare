import React, { useState, useRef, useEffect } from "react";
import { MdDelete, MdAddBox } from "react-icons/md";
import ReactDOM from "react-dom";

const StockInTable = ({
  columns,
  productVariations,
  stockInProducts,
  setStockInProducts,
  resetRows,
}) => {
  // Initialize rows with a default row if stockInProducts is empty
  const [rows, setRows] = useState(() => {
    if (stockInProducts && stockInProducts.length > 0) {
      return stockInProducts.map((product) => ({
        ...product,
        searchTerm: product.product_name || "",
        isDropdownVisible: false,
      }));
    } else {
      return [
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
    }
  });

  useEffect(() => {
    if (stockInProducts.length === 0) {
      // If stockInProducts is empty, add one default row
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
      // Otherwise, map stockInProducts to rows
      setRows(
        stockInProducts.map((product) => ({
          ...product,
          searchTerm: product.product_name || "",
          isDropdownVisible: false,
        })),
      );
    }
  }, [stockInProducts, setStockInProducts]);

  // Refs and state for dropdown positioning
  const inputRefs = useRef([]);
  const dropdownRefs = useRef([]);
  const [dropdownPositions, setDropdownPositions] = useState([]);

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
    setRows([...rows, newRow]);
    setStockInProducts([...stockInProducts, newRow]);
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
      product_name: `${variation.product_name} - ${variation.type}: ${variation.value}`,
      sku: variation.sku,
      type: variation.type,
      value: variation.value,
      searchTerm: variation.product_name,
      isDropdownVisible: false,
    };
    setRows(updatedRows);
    setStockInProducts(updatedRows);
  };

  const handleSearchChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].searchTerm = value;
    updatedRows[index].isDropdownVisible = true;
    setRows(updatedRows);
    updateDropdownPosition(index);
  };

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

  // Filter variations based on search term
  const getFilteredVariations = (searchTerm) =>
    productVariations.filter(
      (variation) =>
        (variation.product_name?.toLowerCase() || "").includes(
          searchTerm.toLowerCase(),
        ) ||
        (variation.value?.toLowerCase() || "").includes(
          searchTerm.toLowerCase(),
        ),
    );

  return (
    <div className="overflow-x-auto pt-4">
      {/* Add Row Button */}
      <div className="flex justify-end pr-6">
        <MdAddBox
          fontSize={30}
          className="text-gray-400 mb-2 hover:text-pink-400 active:text-pink-500"
          onClick={handleAddRow}
        />
      </div>
      {/* Table */}
      <div className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          {/* Table Head */}
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

          {/* Table Body */}
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
                    className="search-input w-64 border border-gray-200 rounded px-2 py-1 text-left"
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                  {row.isDropdownVisible &&
                    dropdownPositions[index] &&
                    ReactDOM.createPortal(
                      <div
                        ref={(el) => (dropdownRefs.current[index] = el)}
                        className="dropdown bg-white border border-slate-300 rounded-md z-20 max-h-40 overflow-y-auto"
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

                {/* Variation Type And Value */}
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  {row.type && row.value ? `${row.type}: ${row.value}` : "N/A"}
                </td>
                {/* SKU */}
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  {row.sku || ""}
                </td>

                {/* Quantity */}
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
                        setStockInProducts(updatedRows);
                      }
                    }}
                    className="w-20 border border-gray-200 rounded px-2 py-1 text-left"
                  />
                </td>
                {/* Delete Row Button */}
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
