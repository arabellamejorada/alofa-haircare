import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { MdAddBox } from "react-icons/md";

const StockInTable = ({
  columns,
  productVariations,
  stockInProducts,
  setStockInProducts,
}) => {
  // Track search terms and dropdown visibility per row
  const [searchTerms, setSearchTerms] = useState(stockInProducts.map(() => ""));
  const [dropdownVisibility, setDropdownVisibility] = useState(
    stockInProducts.map(() => false),
  );

  // Handle adding a new row
  const handleAddRow = () => {
    const newRow = { variation_id: "", quantity: 1, product_name: "" };
    setStockInProducts([...stockInProducts, newRow]);
    setSearchTerms([...searchTerms, ""]); // Add a new search term
    setDropdownVisibility([...dropdownVisibility, false]); // Add a new dropdown visibility state
  };

  // Handle deleting a row
  const handleDeleteRow = (index) => {
    const updatedData = stockInProducts.filter((_, i) => i !== index);
    setStockInProducts(updatedData);
    setSearchTerms(searchTerms.filter((_, i) => i !== index)); // Remove the corresponding search term
    setDropdownVisibility(dropdownVisibility.filter((_, i) => i !== index)); // Remove the corresponding dropdown visibility state
  };

  // Handle product variation change
  const handleVariationChange = (index, variationId, productName) => {
    const selectedVariation = productVariations.find(
      (variation) => variation.variation_id === parseInt(variationId),
    );

    const updatedData = [...stockInProducts];
    if (selectedVariation) {
      updatedData[index] = {
        ...updatedData[index],
        variation_id: selectedVariation.variation_id,
        product_name: productName,
        type: selectedVariation.type,
        value: selectedVariation.value,
        sku: selectedVariation.sku,
      };
    }
    setStockInProducts(updatedData);

    // Hide dropdown and reset search term for the row
    const updatedVisibility = [...dropdownVisibility];
    updatedVisibility[index] = false;
    setDropdownVisibility(updatedVisibility);

    const updatedSearchTerms = [...searchTerms];
    updatedSearchTerms[index] = productName;
    setSearchTerms(updatedSearchTerms);
  };

  // Filter variations based on the search term for a specific row
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
            {stockInProducts.map((item, index) => (
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
                    onFocus={() => {
                      const newVisibility = [...dropdownVisibility];
                      newVisibility[index] = true;
                      setDropdownVisibility(newVisibility);
                    }}
                    className="w-64 border border-gray-200 rounded px-2 py-1 text-left"
                  />
                  {dropdownVisibility[index] && (
                    <div className="absolute left-0 right-0 top-full bg-white border border-slate-300 rounded-md z-20 max-h-40 overflow-y-auto">
                      {getFilteredVariations(searchTerms[index]).length > 0 ? (
                        getFilteredVariations(searchTerms[index]).map(
                          (variation) => (
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
                          ),
                        )
                      ) : (
                        <div className="px-4 py-2 text-gray-500">
                          No products found
                        </div>
                      )}
                    </div>
                  )}
                </td>

                {/* Type */}
                {/* <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  {item.type || ""}
                </td> */}

                {/* Value */}
                {/* <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  {item.value || ""}
                </td> */}

                {/* SKU */}
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  {item.sku || ""}
                </td>

                {/* Quantity */}
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity || 1}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value > 0) {
                        const updatedData = [...stockInProducts];
                        updatedData[index]["quantity"] = value;
                        setStockInProducts(updatedData);
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
