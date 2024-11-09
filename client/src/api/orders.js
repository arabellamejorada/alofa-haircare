// order.js

import axios from "./axios";

// Function to create a new order
export const createOrder = async (formData) => {
  try {
    const response = await axios.post("/order/checkout", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Order created: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating order: ", error);
    throw error;
  }
};

// Function to get all orders with their items
export const getAllOrdersWithItems = async () => {
  try {
    const response = await axios.get("/order/all");
    console.log("Orders fetched: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders: ", error);
    throw error;
  }
};

// Function to get orders by customer ID
export const getOrdersByCustomerId = async (customerId) => {
  try {
    const response = await axios.get(`/order/customer/${customerId}`);
    console.log("Orders fetched for customer: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders for customer: ", error);
    throw error;
  }
};

// Function to get a specific order by order ID
export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`/order/${orderId}`);
    console.log("Order fetched: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching order: ", error);
    throw error;
  }
};

// Function to get order items by order ID
export const getOrderItemsByOrderId = async (orderId) => {
  try {
    const response = await axios.get(`/order/${orderId}/items`);
    console.log("Order items fetched: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching order items: ", error);
    throw error;
  }
};

// Functions to update payment and order status (if routes are added)
export const updateOrderPaymentStatus = async (orderId, paymentStatusId) => {
  try {
    const response = await axios.put(`/order/${orderId}/payment-status`, {
      payment_status_id: paymentStatusId,
    });
    console.log("Order payment status updated: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating order payment status: ", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, orderStatusId) => {
  try {
    const response = await axios.put(`/order/${orderId}/order-status`, {
      order_status_id: orderStatusId,
    });
    console.log("Order status updated: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating order status: ", error);
    throw error;
  }
};
