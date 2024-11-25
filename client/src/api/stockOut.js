import axios from "axios";

export const createStockOut = async (requestData) => {
    try {
    const response = await axios.post("http://localhost:3001/stock-out", requestData);
        // console.log("Stock Out created: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error stocking out:", error);
        throw error;
    }
};

export const getAllStockOut= async () => {
  try {
    const response = await axios.get("http://localhost:3001/stock-out");
    return response;
  } catch (error) {
    console.error("Error fetching stock-out data:", error);
    throw error;
  }
};


export const getStockOutById = async (id) => {
    try {
    const response = await axios.get("http://localhost:3001/stock-out/" + id);
        return response.data;
    } catch (error) {
        console.error("Error during get stock out by id:", error);
        throw error;
    }
};


