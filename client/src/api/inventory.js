import axios from './axios';

export const getInventory = async () => {
    try {
        const response = await axios.get("/inventory");
        console.log("Inventory fetched: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error during get inventory:", error);
        return [];
    }
};

export const getInventoryHistoryByVariationId = async (variationId) => {
    try {
        const response = await axios.get(`/inventory/history/${variationId}`);
        return response.data;
    } catch (error) {
        console.error("Error during get inventory history:", error);
        return [];
    }
};

export const getAllInventoryHistory= async () => {
  try {
    const response = await axios.get("/inventory-history");
    return response;
  } catch (error) {
    console.error("Error fetching inventory history:", error);
    throw error;
  }
};