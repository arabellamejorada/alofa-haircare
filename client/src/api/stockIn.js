import axios from "axios";

export const createStockIn = async (requestData) => {
    try {
    const response = await axios.post("http://localhost:3001/stock-in", requestData);
        console.log("Stock In created: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating Stock In:", error);
        throw error;
    }
};

export const getAllStockIn = async () => {
    try {
        const response = await axios.get("/stock-in");
        return response.data;
    } catch (error) {
        console.error("Error during get all stock in:", error);
        return [];
    }
};

export const getStockInById = async (id) => {
    try {
        const response = await axios.get(`/stock-in/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error during get stock in by id:", error);
        throw error;
    }
};
