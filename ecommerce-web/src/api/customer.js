// File path: ./customer.js
import axios from "./axios"; // Importing a configured axios instance

// Fetch all customers with their profile info
export const getCustomers = async () => {
  try {
    const response = await axios.get("/customer");
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
    const response = await axios.get(`/customer/${customerId}`);
    console.log("Customer fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw error;
  }
};

export const getCustomerByProfileId = async (profile_id) => {
  try {
    console.log("Fetching customer with profile ID:", profile_id);
    const response = await axios.get(`/customer/profile/${profile_id}`);
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
    const response = await axios.post("/customer", customerData);
    console.log("Customer created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

export const updateCustomerProfile = async (customerId, updatedProfile) => {
  try {
    console.log("Updating customer profile:", updatedProfile);
    console.log("Customer ID:", customerId);
    const response = await axios.put(`/customer/${customerId}`, updatedProfile);
    return response.data;
  } catch (error) {
    console.error("Error updating customer profile:", error);
    throw error;
  }
};


// Delete a customer and its associated profile
export const deleteCustomer = async (customerId) => {
  try {
    const response = await axios.delete(`/customer/${customerId}`);
    console.log("Customer deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};
