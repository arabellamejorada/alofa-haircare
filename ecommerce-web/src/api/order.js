import axios from './axios';

export const createOrder = async (formData) => {
  try {
    console.log("Creating order...", formData); 
    const response = await axios.post("/order/checkout", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};
