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

export const getOrderByProfileId = async (profile_id) => {
  try {
    console.log("Fetching orders by customer profile ID...", profile_id);
    const response = await axios.get(`/order/customer/${profile_id}`);

    const formattedTransactions = response.data.map((transaction) => ({
      ...transaction,
      total_amount: Number(transaction.total_amount),
      total_discount: Number(transaction.total_discount),
      subtotal: Number(transaction.subtotal),
      order_items: transaction.order_items.map((item) => ({
        ...item,
        item_subtotal: Number(item.item_subtotal),
        unit_price: Number(item.unit_price)
      })),
    }));

    return formattedTransactions;
  } catch (error) {
    console.error("Error fetching orders by  profile ID:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    console.log("Updating order status...", orderId, status);
    const response = await axios.put(`/order/${orderId}/order-status`, {
      order_status_id: status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};


// REFUND
export const createRefundRequest = async (refundData) => {
  try {
    console.log("Creating refund request...", refundData);
    const response = await axios.post("/refund", refundData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating refund request:", error);
    throw error;
  }
}

