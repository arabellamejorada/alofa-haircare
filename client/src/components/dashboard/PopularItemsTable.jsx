import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

const PopularItemsTable = ({ fetchOrdersWithItems, selectedMonth }) => {
  const [variations, setVariations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPopularVariations = async () => {
      try {
        setLoading(true);

        const response = await fetchOrdersWithItems();
        const orders = response.orders;

        const selectedDate = new Date(selectedMonth);
        const filteredOrders = orders.filter((order) => {
          const orderDate = new Date(order.date_ordered);
          return (
            orderDate.getMonth() === selectedDate.getMonth() &&
            orderDate.getFullYear() === selectedDate.getFullYear()
          );
        });

        const variationCounts = {};
        filteredOrders.forEach((order) => {
          order.items.forEach((item) => {
            const variationKey = item.variation_id;
            if (!variationCounts[variationKey]) {
              variationCounts[variationKey] = {
                productName: item.product_name || "Unknown Item",
                variationType: item.variation_type || "Type",
                variationValue: item.variation_value || "Value",
                totalOrders: 0,
                totalQuantity: 0,
              };
            }
            variationCounts[variationKey].totalOrders += 1;
            variationCounts[variationKey].totalQuantity += item.quantity;
          });
        });

        const sortedVariations = Object.values(variationCounts)
          .sort((a, b) => b.totalOrders - a.totalOrders)
          .slice(0, 8); // Limit to a maximum of 8 items

        setVariations(sortedVariations);
      } catch (error) {
        console.error("Error fetching popular variations:", error);
      } finally {
        setLoading(false);
      }
    };

    getPopularVariations();
  }, [fetchOrdersWithItems, selectedMonth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full mt-[5%]">
        <ClipLoader size={50} color={"#E53E3E"} loading={true} />
      </div>
    );
  }

  return (
    <div className="mt-2">
      <h2 className="text-xl font-bold text-gray-700 mb-2">Popular Items</h2>
      {variations.length === 0 ? (
        <div className="text-center text-gray-500">No items found.</div>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="px-6 py-2 border-b-2 border-gray-200 bg-alofa-pink text-white text-left text-sm font-semibold">
                Item
              </th>
              <th className="px-6 py-2 border-b-2 border-gray-200 bg-alofa-pink text-white text-right text-sm font-semibold">
                Total Orders
              </th>
            </tr>
          </thead>
          <tbody>
            {variations.map((variation, index) => (
              <tr key={index} className="h-10">
                <td className="px-6 py-2 border-b text-left">
                  <div className="flex flex-col">
                    <div>{variation.productName}</div>
                    <div className="text-gray-500">
                      {variation.variationType}: {variation.variationValue}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-2 border-b text-right">
                  {variation.totalOrders}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PopularItemsTable;
