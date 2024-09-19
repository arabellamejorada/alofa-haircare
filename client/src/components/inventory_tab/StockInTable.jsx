import React, { useState } from "react";
// import { IoMdArrowDropdown } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { MdAddBox } from "react-icons/md";
import { Link } from "react-router-dom";

const StockInTable = ({ columns, productVariations }) => {
  const [data, setData] = useState([]);

  // Handle adding a new row
  const handleAddRow = () => {
    const newRow = {
      product_name: "",
      type: "",
      value: "",
      sku: "",
      quantity: 1, // Default quantity to 1
    };
    setData([...data, newRow]);
  };

  // Handle deleting a row
  const handleDeleteRow = (index) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
  };

  // Handle product variation change
  const handleVariationChange = (index, variationId) => {
    const selectedVariation = productVariations.find(
      (variation) => variation.variation_id === parseInt(variationId)
    );

    const updatedData = [...data];
    if (selectedVariation) {
      updatedData[index] = {
        ...updatedData[index],
        var_ID: selectedVariation.variation_id,
        product_name: selectedVariation.name,
        type: selectedVariation.type,
        value: selectedVariation.value,
        sku: selectedVariation.sku,
      };
    }
    setData(updatedData);
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
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 uppercase tracking-wider">
                #
              </th>
              {columns
                .filter(
                  (column) =>
                    column.key !== "stock_in_date" && column.key !== "supplier"
                ) // Exclude stock_in_date and supplier
                .map((column) => (
                  <th
                    className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 uppercase tracking-wider"
                    key={column.key}
                  >
                    {column.header}
                  </th>
                ))}
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-md font-semibold text-gray-600 uppercase tracking-wider">
                Delete
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  {index + 1}
                </td>

                {/* Variation Dropdown */}
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  <select
                    value={item.var_ID || ""}
                    onChange={(e) =>
                      handleVariationChange(index, e.target.value)
                    }
                    className="w-64 border border-gray-200 rounded px-2 py-1 text-left appearance-none"
                  >
                    <option value="" disabled>
                      Select Variation
                    </option>
                    {productVariations.map((variation, idx) => (
                      <option key={idx} value={variation.variation_id}>
                        {`${variation.name} - ${variation.type}: ${variation.value}`}
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
                        const updatedData = [...data];
                        updatedData[index]["quantity"] = value;
                        setData(updatedData);
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
      <div className="flex flex-row mt-4 gap-2">
        <button className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600">
          Save
        </button>
        <Link to="/stockinhistory">
          <button className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600">
            View History
          </button>
        </Link>
      </div>
    </div>
  );
};

export default StockInTable;
