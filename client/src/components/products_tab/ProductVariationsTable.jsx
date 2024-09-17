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
    <div className="pt-4">
      <div className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full leading-normal">
          <thead className="w-full">
            <tr>
              <th className="px- py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase">
                #
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase">
                Variation Type
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase">
                Variation Value
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase w-[8rem]">
                Unit Price
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase">
                Image
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {variations.map((variation, index) => (
              <tr key={index}>
                {/* index */}
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-center">
                  {index + 1}
                </td>

                {/* type */}
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-center">
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

                {/* value */}
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

                {/* unit_price */}
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

                {/* product_status */}
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-center">
                  <select
                    value={variation.product_status_id}
                    onChange={(e) =>
                      handleVariationChange(
                        index,
                        "product_status_id",
                        e.target.value
                      )
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

                {/* image */}
                <td className="px-5 py-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(index, e.target.files[0])
                    }
                    className="w-full px-2 py-1 file:mr-2 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-400 file:text-white hover:file:bg-pink-500"
                  />
                </td>

                {/* delete */}
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
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <MdAddBox fontSize={24} className="mr-2" />
          Add More Variation
        </button>
      </div>
    </div>
  );
};

export default ProductVariationsTable;
