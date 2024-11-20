import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

const PopularItemsTable = ({ fetchOrdersWithItems }) => {
  const [variations, setVariations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPopularVariations = async () => {
      try {
        setLoading(true);

        // Fetch orders with items using the provided API function
        const response = await fetchOrdersWithItems();
        console.log("API Response:", response); // Log the full API response
        const orders = response.orders;

        // Get the current date and calculate the date 1 month ago
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        // Filter orders within the last month
        const recentOrders = orders.filter((order) => {
          const orderDate = new Date(order.date_ordered);
          return orderDate >= oneMonthAgo;
        });

        console.log("Recent Orders (Last Month):", recentOrders); // Log filtered orders

        // Count variation popularity (product name, variation type, value, total orders, total quantity)
        const variationCounts = {};
        recentOrders.forEach((order) => {
          order.items.forEach((item) => {
            console.log("Processing Item:", item); // Log each item being processed
            const variationKey = item.variation_id; // Group by variation_id
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

        console.log("Variation Counts:", variationCounts); // Log the aggregated variations

        // Convert variationCounts object into a sorted array by total orders
        const sortedVariations = Object.values(variationCounts).sort(
          (a, b) => b.totalOrders - a.totalOrders,
        );

        console.log("Sorted Variations:", sortedVariations); // Log the final sorted array

        // Take the top 5 most popular variations
        setVariations(sortedVariations.slice(0, 5));
      } catch (error) {
        console.error("Error fetching popular variations:", error);
      } finally {
        setLoading(false);
      }
    };

    getPopularVariations();
  }, [fetchOrdersWithItems]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full mt-[5%]">
        <ClipLoader size={50} color={"#E53E3E"} loading={true} />
      </div>
    );
  }

  return (
    <div className="mt-2">
      <h2 className="text-xl font-bold text-gray-700 mb-2">
        Popular Items This Month
      </h2>
      {loading ? (
        <div className="flex items-center justify-center h-full mt-[5%]">
          <ClipLoader size={50} color={"#E53E3E"} loading={true} />
        </div>
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
