import axios from './axios';

export const getInventory = async () => {
    try {
        const response = await axios.get("/api/inventory");
        return response.data;
    } catch (error) {
        console.error("Error during get inventory:", error);
        return [];
    }
};