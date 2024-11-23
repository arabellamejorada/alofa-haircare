import axios from "./axios";

// Function to create a new order
export const createOrder = async (formData) => {
  try {
    const response = await axios.post("/order/checkout", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
    // console.log("Orders fetched: ", response.data);
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
    return response.data;
  } catch (error) {
    console.error("Error fetching order items: ", error);
    throw error;
  }
};

// Function to update order remarks
export const updateOrderRemarks = async (orderId, remarks) => {
  try {
    const response = await axios.put(`/order/${orderId}/remarks`, {
      remarks,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating order remarks: ", error);
    throw error;
  }
};

// Function to update payment status of an order
export const updateOrderPaymentStatus = async (orderId, paymentStatusId) => {
  try {
    const response = await axios.put(`/order/${orderId}/payment-status`, {
      payment_status_id: paymentStatusId,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating order payment status: ", error);
    throw error;
  }
};

// Function to update order status
export const updateOrderStatus = async (
  orderId,
  orderStatusId,
  trackingNumber,
) => {
  try {
    const response = await axios.put(`/order/${orderId}/order-status`, {
      order_status_id: orderStatusId,
      tracking_number: trackingNumber,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating order status and tracking number:", error);
    throw error;
  }
};

// Function to update shipping status and tracking number
export const updateShippingStatusAndTrackingNumber = async (
  shippingId,
  orderStatusId,
  trackingNumber,
) => {
  try {
    const response = await axios.put(`/shipping/${shippingId}/status`, {
      order_status_id: orderStatusId,
      tracking_number: trackingNumber,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating shipping status and tracking number:", error);
    throw error;
  }
};

// REFUND FUNCTIONS
export const createRefundRequest = async (formData) => {
  try {
    const response = await axios.post("/refund", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating refund request: ", error);
    throw error;
  }
};

export const getRefundRequestsByProfileId = async (profile_id) => {
  try {
    const response = await axios.get(`/refund/requests/${profile_id}`);
    const formattedTransactions = response.data.map((transaction) => ({
      ...transaction,
      total_refund_amount: Number(transaction.total_refund_amount),
      refund_items: transaction.refund_items.map((item) => ({
        ...item,
        item_subtotal: Number(item.item_subtotal),
        unit_price: Number(item.unit_price),
      })),
    }));
    return formattedTransactions;
  } catch (error) {
    console.error("Error fetching refund requests by profile ID:", error);
    throw error;
  }
};

export const getAllRefundRequests = async () => {
  try {
    const response = await axios.get("/requests");
    const formattedRefunds = response.data.map((refund) => ({
      ...refund,
      total_refund_amount: Number(refund.total_refund_amount),
      refund_items: refund.refund_items.map((item) => ({
        ...item,
        item_subtotal: Number(item.item_subtotal),
      })),
    }));
    return formattedRefunds;
  } catch (error) {
    console.error("Error fetching all refund requests:", error);
    throw error;
  }
};

export const getAllOrderStatuses = async () => {
  try {
    const response = await axios.get("/order-status");
    return response.data;
  } catch (error) {
    console.error("Error fetching order statuses: ", error);
    throw error;
  }
}

export const updateRefundStatus = async (refundRequestId, statusId) => {
  try {
    const response = await axios.put(`/refunds/${refundRequestId}/status`, {
      status_id: statusId,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating refund status: ", error);
    throw error;
  }
};

export const getSalesMetrics = async (startDate, endDate) => {
  try {
    const response = await axios.get("/sales-metrics", {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching sales metrics:", error);
    throw error;
  }
};
