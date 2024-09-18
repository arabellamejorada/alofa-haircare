import React from "react";
import { MdDelete } from "react-icons/md";
import { MdAddBox } from "react-icons/md";

const StockInTable = ({ columns, productVariations, stockInProducts, setStockInProducts }) => {
  // Handle adding a new row
  const handleAddRow = () => {
    const newRow = { variation_id: "", quantity: 1 }; // Empty product, default quantity 1
    setStockInProducts([...stockInProducts, newRow]);
  };

  // Handle deleting a row
  const handleDeleteRow = (index) => {
    const updatedData = stockInProducts.filter((_, i) => i !== index);
    setStockInProducts(updatedData);
  };

  // Handle product variation change
  const handleVariationChange = (index, variationId) => {
    const selectedVariation = productVariations.find(
      (variation) => variation.variation_id === parseInt(variationId)
    );

    const updatedData = [...stockInProducts];
    if (selectedVariation) {
      updatedData[index] = {
        ...updatedData[index],
        variation_id: selectedVariation.variation_id,
        product_name: selectedVariation.product_name,
        type: selectedVariation.type,
        value: selectedVariation.value,
        sku: selectedVariation.sku,
      };
    }
    setStockInProducts(updatedData);
  };

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
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                #
              </th>
              {columns
                .filter(
                  (column) =>
                    column.key !== "stock_in_date" && column.key !== "supplier"
                ) // Exclude stock_in_date and supplier
                .map((column) => (
                  <th
                    className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    key={column.key}
                  >
                    {column.header}
                  </th>
                ))}
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
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

                {/* Variation Dropdown */}
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  <select
                    value={item.variation_id || ""}
                    onChange={(e) => handleVariationChange(index, e.target.value)}
                    className="w-64 border border-gray-200 rounded px-2 py-1 text-left appearance-none"
                  >
                    <option value="" disabled>
                      Select Variation
                    </option>
                    {productVariations.map((variation, idx) => (
                      <option key={idx} value={variation.variation_id}>
                        {`${variation.product_name} - ${variation.type}: ${variation.value}`}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Type */}
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  {item.type || ""}
                </td>

                {/* Value */}
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  {item.value || ""}
                </td>

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
