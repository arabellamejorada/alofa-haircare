import React from "react";
import { MdDelete } from "react-icons/md";

const ProductVariationsTable = ({
  variations,
  handleVariationChange,
  handleImageChange,
  addVariation,
  deleteVariation,
}) => {
  return (
    <div className="pt-4 w-full max-w-full">
      <div className="w-full bg-white shadow-md rounded-lg overflow-hidden">
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
                SKU*
              </th>
              <th className="px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-center text-md font-semibold text-gray-600 uppercase">
                Image
              </th>
              <th className="px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-center text-md font-semibold text-gray-600 uppercase">
                Delete
              </th>
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
                    className="w-full border border-gray-200 rounded px-2 py-1 text-center appearance-none"
                  >
                    <option value="">Select Type</option>
                    <option value="Size">Size</option>
                    <option value="Color">Color</option>
                  </select>
                </td>

                {/* Variation Value */}
                <td className="px-2 py-1 border-b border-gray-200 text-sm text-center">
                  <input
                    type="text"
                    value={variation.value}
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
                    className="w-full border border-gray-200 rounded px-2 py-1 text-center"
                  />
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
                    className="w-full border border-gray-200 rounded px-2 py-1 text-center"
                  />
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
                      <label className="flex items-center px-4 py-2 text-sm font-medium text-white bg-pink-500 rounded-lg cursor-pointer hover:bg-pink-600">
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
                <td className="px-2 py-1 border-b border-gray-200 text-sm text-center">
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteVariation(index)}
                  >
                    <MdDelete fontSize={24} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add More Variation Button */}
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={addVariation}
          className="flex items-center gap-2 px-6 py-2 text-white bg-pink-500 hover:bg-pink-600 rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105"
        >
          <span>+</span> Add More Variation
        </button>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        *Leave SKU blank if not provided
      </p>
    </div>
  );
};

export default ProductVariationsTable;
