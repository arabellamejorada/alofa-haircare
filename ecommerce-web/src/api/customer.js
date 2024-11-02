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


// SHIPPING ADDRESS
// Fetch all shipping addresses of a customer
export const getShippingAddressesByCustomerId = async (customer_id) => {
  try {
    console.log("Fetching shipping addresses for customer ID:", customer_id);
    const response = await axios.get(`/address/${customer_id}`);
    
    // Check if the response contains an empty array
    if (response.data.length === 0) {
      console.log("No shipping addresses found.");
      return []; // Return an empty array if no addresses are found
    }

    console.log("Shipping addresses fetched:", response.data);
    return response.data;
  } catch (error) {
    // Check if the error is a 404, meaning no addresses were found
    if (error.response && error.response.status === 404) {
      console.log("No shipping addresses found (404).");
      return []; // Return an empty array if 404 is encountered
    }

    // For other errors, throw the error as usual
    console.error("Error fetching shipping addresses:", error);
    throw error;
  }
};


// Create a new shipping address for a customer
export const createShippingAddress = async (addressData) => {
  try {
    const response = await axios.post("/address", addressData);
    console.log("Shipping address created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating shipping address:", error);
    throw error;
  }
};

// Update a shipping address
export const updateShippingAddress = async (addressId, updatedAddress) => {
  try {
    const response = await axios.put(`/address/${addressId}`, updatedAddress);
    console.log("Shipping address updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating shipping address:", error);
    throw error;
  }
};

// Delete a shipping address
export const deleteShippingAddress = async (addressId) => {
  try {
    const response = await axios.delete(`/address/${addressId}`);
    console.log("Shipping address deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting shipping address:", error);
    throw error;
  }
};
