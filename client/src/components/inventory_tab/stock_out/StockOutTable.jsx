// StockOutTable.jsx
import { MdDelete, MdAddBox } from "react-icons/md";

const StockOutTable = ({
  columns,
  productVariations,
  inventories,
  stockOutProducts,
  setStockOutProducts,
}) => {
  // Handle adding a new row
  const handleAddRow = () => {
    const newRow = {
      product_name: "",
      sku: "",
      quantity: 1,
      reason: "",
    };
    setStockOutProducts([...stockOutProducts, newRow]);
  };

  // Handle deleting a row
  const handleDeleteRow = (index) => {
    const updatedData = stockOutProducts.filter((_, i) => i !== index);
    setStockOutProducts(updatedData);
  };

  // Handle product variation change
  const handleVariationChange = (index, variationId) => {
    const selectedVariation = productVariations.find(
      (variation) => variation.variation_id === parseInt(variationId),
    );

    const updatedData = [...stockOutProducts];
    if (selectedVariation) {
      updatedData[index] = {
        ...updatedData[index],
        variation_id: selectedVariation.variation_id,
        product_name: selectedVariation.product_name,
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
  };

  // Handle reason change
  const handleReasonChange = (index, reason) => {
    const updatedData = [...stockOutProducts];
    updatedData[index].reason = reason;
    setStockOutProducts(updatedData);
  };

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
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gradient-to-b from-pink-400 to-pink-500 text-gray-100 text-left text-md font-semibold  uppercase tracking-wider">
                #
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gradient-to-b from-pink-400 to-pink-500 text-gray-100 text-left text-md font-semibold  uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gradient-to-b from-pink-400 to-pink-500 text-gray-100 text-center text-md font-semibold  uppercase tracking-wider">
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
                {/* Variation Dropdown */}
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  <select
                    value={item.variation_id || ""}
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
                        {`${variation.product_name} - ${variation.type}: ${variation.value}`}
                      </option>
                    ))}
                  </select>
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
