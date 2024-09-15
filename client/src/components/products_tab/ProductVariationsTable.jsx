import React from "react";
import { MdAddBox, MdDelete } from "react-icons/md";

const ProductVariationsTable = ({
  variations,
  statuses,
  handleVariationChange,
  handleImageChange,
  addVariation,
  deleteVariation,
}) => {
  return (
    <div className="overflow-x-auto pt-4">
      <div className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                #
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Variation Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Variation Value
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Unit Price
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Image
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {variations.map((variation, index) => (
              <tr key={index}>
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-center">
                  {index + 1}
                </td>
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-center">
                  <input
                    type="text"
                    value={variation.type}
                    onChange={(e) =>
                      handleVariationChange(index, "name", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded px-2 py-1 text-center"
                  />
                </td>
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-center">
                  <input
                    type="text"
                    value={variation.value}
                    onChange={(e) =>
                      handleVariationChange(index, "value", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded px-2 py-1 text-center"
                  />
                </td>
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-center">
                  <input
                    type="text"
                    value={variation.sku}
                    onChange={(e) =>
                      handleVariationChange(index, "sku", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded px-2 py-1 text-center"
                  />
                </td>
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-center">
                  <input
                    type="number"
                    value={variation.unit_price}
                    onChange={(e) =>
                      handleVariationChange(index, "unit_price", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded px-2 py-1 text-center"
                  />
                </td>
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-center">
                  <select
                    value={variation.product_status_id}
                    onChange={(e) =>
                      handleVariationChange(index, "product_status_id", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded px-2 py-1 text-center appearance-none"
                  >
                    <option value="">Select Status</option>
                    {statuses.map((status) => (
                      <option key={status.status_id} value={status.status_id}>
                        {status.description}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(index, e.target.files[0])}
                    className="w-full border border-gray-200 rounded px-2 py-1"
                  />
                </td>
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-center">
                  <button
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
      <div className="flex justify-end mt-2">
        <button
          type="button"
          onClick={addVariation}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          <MdAddBox fontSize={24} className="mr-2" />
          Add Variation
        </button>
      </div>
    </div>
  );
};

export default ProductVariationsTable;
