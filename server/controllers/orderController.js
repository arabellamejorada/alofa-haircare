const pool = require('../db.js');

const createOrder = async (req, res) => {
  const { orderDetails, cartItems  } = req.body;

  console.log('orderDetails received:', orderDetails);
  console.log('cartItems received:', cartItems);
  try {
    // Start a transaction
    await pool.query('BEGIN');

    // Step 1: Insert order details
    const orderResult = await pool.query(
      `INSERT INTO orders (customer_id, total_amount, date_ordered, order_status, payment_method, payment_status, proof_image, shipping_id, subtotal, voucher_id, total_discount)
       VALUES ($1, $2, NOW(), 'pending', $3, 'pending', $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        orderDetails.customer_id,
        orderDetails.total_amount,
        orderDetails.payment_method,
        orderDetails.proof_image,
        orderDetails.shipping_id,
        orderDetails.subtotal,
        orderDetails.voucher_id,
        orderDetails.total_discount,
      ]
    );

    const newOrder = orderResult.rows[0];
    console.log('New order:', newOrder);

    // Step 2: Insert order items
    const orderItemsValues = cartItems.map(item => [
      newOrder.order_id,
      item.variation_id,
      item.quantity,
      item.price,
    ]);

    const placeholders = cartItems
      .map((_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`)
      .join(', ');

    await pool.query(
      `INSERT INTO order_items (order_id, variation_id, quantity, price) VALUES ${placeholders}`,
      orderItemsValues
    );

    // Commit the transaction
    await pool.query('COMMIT');

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    // Rollback the transaction in case of an error
    await pool.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Get Orders by Customer ID
const getOrderByCustomerId = async (req, res) => {
  const { customer_id } = req.params;

  try {
    const ordersResult = await pool.query(
      `SELECT * FROM orders WHERE customer_id = $1`,
      [customer_id]
    );

    if (ordersResult.rowCount === 0) {
      return res.status(404).json({ error: 'No orders found for this customer' });
    }

    res.status(200).json({ orders: ordersResult.rows });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get All Orders with Order Items
const getAllOrdersWithOrderItems = async (req, res) => {
  try {
    const ordersResult = await pool.query(`
      SELECT o.*, oi.order_item_id, oi.variation_id, oi.quantity, oi.price
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      ORDER BY o.order_id;
    `);

    if (ordersResult.rowCount === 0) {
      return res.status(404).json({ error: 'No orders found' });
    }

    const orders = {};

    // Group order items by order ID
    ordersResult.rows.forEach(row => {
      if (!orders[row.order_id]) {
        orders[row.order_id] = {
          order_id: row.order_id,
          customer_id: row.customer_id,
          subtotal: row.subtotal,
          discount_amount: row.discount_amount,
          total_amount: row.total_amount,
          discount_code: row.discount_code,
          date_ordered: row.date_ordered,
          order_status: row.order_status,
          payment_method: row.payment_method,
          payment_status: row.payment_status,
          shipping_id: row.shipping_id,
          items: []
        };
      }

      orders[row.order_id].items.push({
        order_item_id: row.order_item_id,
        variation_id: row.variation_id,
        quantity: row.quantity,
        price: row.price
      });
    });

    res.status(200).json({ orders: Object.values(orders) });
  } catch (error) {
    console.error('Error fetching all orders with items:', error);
    res.status(500).json({ error: 'Failed to fetch orders with items' });
  }
};

// Get Order with Order items by Order ID
const getOrderByOrderId = async (req, res) => {
  const { order_id } = req.params;

  try {
    const orderResult = await pool.query(
      `SELECT * FROM orders WHERE order_id = $1`,
      [order_id]
    );

    if (orderResult.rowCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderItemsResult = await pool.query(
      `SELECT * FROM order_items WHERE order_id = $1`,
      [order_id]
    );

    res.status(200).json({ order: orderResult.rows[0], order_items: orderItemsResult.rows });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

// Get Order Items by Order ID
const getOrderItemsByOrderId = async (req, res) => {
  const { order_id } = req.params;

  try {
    const orderItemsResult = await pool.query(
      `SELECT * FROM order_items WHERE order_id = $1`,
      [order_id]
    );

    if (orderItemsResult.rowCount === 0) {
      return res.status(404).json({ error: 'No items found for this order' });
    }

    res.status(200).json({ order_items: orderItemsResult.rows });
  } catch (error) {
    console.error('Error fetching order items:', error);
    res.status(500).json({ error: 'Failed to fetch order items' });
  }
};

module.exports = {
  createOrder,
  getOrderByCustomerId,
  getAllOrdersWithOrderItems,
  getOrderByOrderId,
  getOrderItemsByOrderId,
};
