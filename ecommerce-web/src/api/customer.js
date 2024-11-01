// File path: ./customer.js
import axios from "./axios"; // Importing a configured axios instance

// Fetch all customers with their profile info
export const getCustomers = async () => {
  try {
    const response = await axios.get("/customers");
    console.log("Customers fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

// Fetch a single customer by ID
export const getCustomerById = async (customerId) => {
  try {
    const response = await axios.get(`/customers/${customerId}`);
    console.log("Customer fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw error;
  }
};

// Create a new customer with a profile
export const createCustomer = async (customerData) => {
  try {
    const response = await axios.post("/customers", customerData);
    console.log("Customer created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

// Update an existing customer's profile
export const updateCustomer = async (customerId, profileData) => {
  try {
    const response = await axios.put(`/customers/${customerId}`, profileData);
    console.log("Customer updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

// Delete a customer and its associated profile
export const deleteCustomer = async (customerId) => {
  try {
    const response = await axios.delete(`/customers/${customerId}`);
    console.log("Customer deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};
