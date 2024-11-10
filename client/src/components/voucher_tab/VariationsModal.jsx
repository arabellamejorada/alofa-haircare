import React, { useEffect, useState } from "react";
import Modal from "../modal/Modal";
import { getAllProductVariations } from "../../api/products";

const VariationsModal = ({ isOpen, onClose, voucherVariations, onSave }) => {
  const [allVariations, setAllVariations] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchVariations = async () => {
      const variations = await getAllProductVariations();
      setAllVariations(variations);
    };

    if (isOpen) {
      fetchVariations();

      // Initialize selected variations
      const initialSelectedIds = voucherVariations
        ? voucherVariations.map((v) =>
            typeof v === "object" ? v.variation_id : v,
          )
        : [];
      setSelectedVariations(initialSelectedIds);
    } else {
      // Clear the search query when modal is closed
      setSearchQuery("");
    }
  }, [isOpen, voucherVariations]);

  const handleCheckboxChange = (variation_id) => {
    setSelectedVariations((prevSelected) =>
      prevSelected.includes(variation_id)
        ? prevSelected.filter((id) => id !== variation_id)
        : [...prevSelected, variation_id],
    );
  };

  const handleSave = () => {
    onSave(selectedVariations);
    onClose();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Separate selected and unselected variations
  const selectedVariationData = allVariations.filter((variation) =>
    selectedVariations.includes(variation.variation_id),
  );

  const unselectedVariationData = allVariations.filter(
    (variation) =>
      !selectedVariations.includes(variation.variation_id) &&
      (variation.sku.toLowerCase().includes(searchQuery) ||
        variation.product_name.toLowerCase().includes(searchQuery) ||
        variation.value.toLowerCase().includes(searchQuery)),
  );

  return (
    <Modal isVisible={isOpen} onClose={onClose}>
      <div
        className="p-4 w-full max-w-3xl mx-auto fixed-size-modal"
        style={{ maxWidth: "800px", height: "500px" }}
      >
        <h2 className="text-xl font-bold mb-4">Select Product Variations</h2>
        {/* Search Input with Clear Button */}
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Search variations"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border rounded-l-lg"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="px-4 py-2 bg-gray-200 rounded-r-lg hover:bg-alofa-pink"
            >
              Clear
            </button>
          )}
        </div>

        {/* Scrollable Table with Fixed Height */}
        <div className="overflow-y-auto max-h-64 border rounded-lg">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-2 py-1 text-left text-sm font-semibold w-32">
                  SKU
                </th>
                <th className="px-2 py-1 text-left text-sm font-semibold w-40">
                  Name
                </th>
                <th className="px-2 py-1 text-left text-sm font-semibold w-32">
                  Variation
                </th>
                <th className="px-2 py-1 text-left text-sm font-semibold w-24">
                  Price
                </th>
                <th className="px-2 py-1 text-center text-sm font-semibold w-20">
                  Select
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Render selected variations first */}
              {selectedVariationData.map((variation) => (
                <tr key={variation.variation_id} className="hover:bg-gray-100">
                  <td className="px-2 py-1 border-b w-32">{variation.sku}</td>
                  <td className="px-2 py-1 border-b w-40">
                    {variation.product_name}
                  </td>
                  <td className="px-2 py-1 border-b w-32">{variation.value}</td>
                  <td className="px-2 py-1 border-b w-24">
                    ₱{Number(variation.unit_price).toFixed(2)}
                  </td>
                  <td className="px-2 py-1 border-b text-center w-20">
                    <input
                      type="checkbox"
                      checked={selectedVariations.includes(
                        variation.variation_id,
                      )}
                      onChange={() =>
                        handleCheckboxChange(variation.variation_id)
                      }
                    />
                  </td>
                </tr>
              ))}

              {/* Render filtered unselected variations below */}
              {unselectedVariationData.map((variation) => (
                <tr key={variation.variation_id} className="hover:bg-gray-100">
                  <td className="px-2 py-1 border-b w-32">{variation.sku}</td>
                  <td className="px-2 py-1 border-b w-40">
                    {variation.product_name}
                  </td>
                  <td className="px-2 py-1 border-b w-32">{variation.value}</td>
                  <td className="px-2 py-1 border-b w-24">
                    ₱{Number(variation.unit_price).toFixed(2)}
                  </td>
                  <td className="px-2 py-1 border-b text-center w-20">
                    <input
                      type="checkbox"
                      checked={selectedVariations.includes(
                        variation.variation_id,
                      )}
                      onChange={() =>
                        handleCheckboxChange(variation.variation_id)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Save Button */}
        <div className="flex justify-end mt-4">
          <button
            className="bg-alofa-pink text-white px-4 py-2 rounded hover:bg-alofa-dark"
            onClick={handleSave}
          >
            Apply Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default VariationsModal;
