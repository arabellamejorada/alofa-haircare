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
  // State for search terms and dropdown visibility per row
  const [searchTerms, setSearchTerms] = useState(stockOutProducts.map(() => ""));
  const [dropdownVisibility, setDropdownVisibility] = useState(
    stockOutProducts.map(() => false),
  );

  // Handle adding a new row
  const handleAddRow = () => {
    const newRow = {
      product_name: "",
      sku: "",
      quantity: 1,
      reason: "",
    };
    setStockOutProducts([...stockOutProducts, newRow]);
    setSearchTerms([...searchTerms, ""]); // Add a new search term
    setDropdownVisibility([...dropdownVisibility, false]); // Add a new dropdown visibility state
  };

  // State for dropdown position
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const inputRefs = useRef([]);
  const dropdownRef = useRef(null);

  // Handle input focus to show dropdown
  const handleFocus = (index) => {
    const inputElement = inputRefs.current[index];
    const rect = inputElement.getBoundingClientRect();
    setDropdownPosition({ top: rect.bottom, left: rect.left });

    const newVisibility = [...dropdownVisibility];
    newVisibility[index] = true;
    setDropdownVisibility(newVisibility);
  };

  // Handle click outside to close dropdown
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisibility((prevVisibility) => prevVisibility.map(() => false));
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle deleting a row
  const handleDeleteRow = (index) => {
    const updatedData = stockOutProducts.filter((_, i) => i !== index);
    setStockOutProducts(updatedData);
    setSearchTerms(searchTerms.filter((_, i) => i !== index)); // Remove the corresponding search term
    setDropdownVisibility(dropdownVisibility.filter((_, i) => i !== index)); // Remove the corresponding dropdown visibility state
  };

  // Handle product variation change
  const handleVariationChange = (index, variationId, productName) => {
    const selectedVariation = productVariations.find(
      (variation) => variation.variation_id === parseInt(variationId),
    );

    const updatedData = [...stockOutProducts];
    if (selectedVariation) {
      updatedData[index] = {
        ...updatedData[index],
        variation_id: selectedVariation.variation_id,
        product_name: productName,
        sku: selectedVariation.sku,
      };
    } else {
      // Clear the selection if no variation is selected
      updatedData[index] = {
        ...updatedData[index],
        variation_id: "",
        product_name: "",
        sku: "",
      };
    }
    setStockOutProducts(updatedData);

    // Hide dropdown and reset search term for the row
    const updatedVisibility = [...dropdownVisibility];
    updatedVisibility[index] = false;
    setDropdownVisibility(updatedVisibility);

    const updatedSearchTerms = [...searchTerms];
    updatedSearchTerms[index] = productName;
    setSearchTerms(updatedSearchTerms);
  };

  // Handle reason change
  const handleReasonChange = (index, reason) => {
    const updatedData = [...stockOutProducts];
    updatedData[index].reason = reason;
    setStockOutProducts(updatedData);
  };

  // Filter variations based on the search term for a specific row
  const getFilteredVariations = (searchTerm) =>
    productVariations.filter(
      (variation) =>
        variation.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            {stockOutProducts.map((item, index) => (
              <tr key={index}>
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  {index + 1}
                </td>
                {/* Variation Searchable Dropdown */}
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left relative overflow-visible">
                  <input
                    type="text"
                    placeholder="Search Product Variation"
                    value={searchTerms[index]}
                    onChange={(e) => {
                      const newSearchTerms = [...searchTerms];
                      newSearchTerms[index] = e.target.value;
                      setSearchTerms(newSearchTerms);

                      const newVisibility = [...dropdownVisibility];
                      newVisibility[index] = true;
                      setDropdownVisibility(newVisibility);
                    }}
                    onFocus={() => handleFocus(index)}
                    className="w-64 border border-gray-200 rounded px-2 py-1 text-left"
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                  {dropdownVisibility[index] &&
                    ReactDOM.createPortal(
                      <div
                        ref={dropdownRef}
                        className="bg-white border border-slate-300 rounded-md z-20 max-h-40 overflow-y-auto"
                        style={{
                          position: "fixed",
                          top: dropdownPosition.top,
                          left: dropdownPosition.left,
                          width: "256px",
                        }}
                      >
                        {getFilteredVariations(searchTerms[index]).length > 0 ? (
                          getFilteredVariations(searchTerms[index]).map((variation) => (
                            <div
                              key={variation.variation_id}
                              onClick={() =>
                                handleVariationChange(
                                  index,
                                  variation.variation_id,
                                  `${variation.product_name} - ${variation.type}: ${variation.value}`,
                                )
                              }
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              {`${variation.product_name} - ${variation.type}: ${variation.value}`}
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
                </td>

                {/* SKU */}
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  {item.sku || ""}
                </td>

                {/* Current Stock Quantity  */}
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  {inventories.find(
                    (inventory) => inventory.variation_id === item.variation_id,
                  )?.stock_quantity || 0}
                </td>

                {/* Quantity to be stocked out*/}
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity || 1}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value > 0) {
                        const updatedData = [...stockOutProducts];
                        updatedData[index]["quantity"] = value;
                        setStockOutProducts(updatedData);
                      }
                    }}
                    className="w-20 border border-gray-200 rounded px-2 py-1 text-left"
                  />
                </td>

                {/* Reason */}
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  <input
                    type="text"
                    value={item.reason || ""}
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