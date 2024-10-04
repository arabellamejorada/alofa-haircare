const pool = require('../db.js');

const createOrder = async (req, res) => {
  const { shipping_id, payment_method, proof_image } = req.body;
  const session_id = req.sessionID;

  try {
    const client = await pool.connect();

    // Get the active cart for the current session
    const cartResult = await client.query(`
      SELECT * FROM cart
      WHERE session_id = $1 AND status = 'active'
    `, [session_id]);

    if (cartResult.rows.length === 0) {
      return res.status(404).json({ message: "Cart not found or already checked out" });
    }

    const cart_id = cartResult.rows[0].cart_id;
    const customer_id = cartResult.rows[0].customer_id;

    // Get the cart items
    const cartItemsResult = await client.query(`
      SELECT ci.quantity, pv.unit_price
      FROM cart_items ci
      JOIN product_variation pv ON ci.variation_id = pv.variation_id
      WHERE ci.cart_id = $1
    `, [cart_id]);

    const cartItems = cartItemsResult.rows;

    // Calculate the total amount based on the cart items
    const totalAmount = cartItems.reduce((total, item) => {
      return total + (item.quantity * item.unit_price);
    }, 0);

    // Insert a new order_transaction record
    const orderTransactionResult = await client.query(`
      INSERT INTO order_transaction (customer_id, cart_id, total_amount, date_ordered, is_verified, shipping_id, payment_method, payment_status, proof_image, order_status)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5, $6, 'pending', $7, 'pending')
      RETURNING *;
    `, [
      customer_id,
      cart_id,
      totalAmount,
      false,  // is_verified
      shipping_id,
      payment_method,
      proof_image
    ]);

    const orderTransaction = orderTransactionResult.rows[0];

    // Mark the cart as checked out
    await client.query(`
      UPDATE cart
      SET status = 'checked_out'
      WHERE cart_id = $1
    `, [cart_id]);

    res.status(201).json({
      message: 'Order transaction created successfully',
      orderTransaction
    });
  } catch (error) {
    console.error('Error creating order transaction: ', error);
    res.status(500).json({ message: 'Error creating order transaction', error: error.message });
  } finally {
    client.release();
  }
};

const getOrderByCustomerId = async (req, res) => {
  const { customer_id } = req.params;

  try {
    const client = await pool.connect();

    const orderResult = await client.query(`
      SELECT ot.*, s.shipping_method, s.shipping_address, s.shipping_status
      FROM order_transaction ot
      JOIN shipping s ON ot.shipping_id = s.shipping_id
      WHERE ot.customer_id = $1
    `, [customer_id]);

    const orders = orderResult.rows;

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders: ', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  } finally {
    client.release();
  }
};

const getOrderByOrderId = async (req, res) => {
  const { order_id } = req.params;

  try {
    const client = await pool.connect();

    const orderResult = await client.query(`
      SELECT ot.*, s.shipping_method, s.shipping_address, s.shipping_status
      FROM order_transaction ot
      JOIN shipping s ON ot.shipping_id = s.shipping_id
      WHERE ot.order_id = $1
    `, [order_id]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderResult.rows[0];

    res.status(200).json({ order });
  } catch (error) {
    console.error('Error fetching order: ', error);
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  } finally {
    client.release();
  }
};

const getAllOrders = async (req, res) => {
  try {
    const client = await pool.connect();

    const orderResult = await client.query(`
      SELECT ot.*, s.shipping_method, s.shipping_address, s.shipping_status
      FROM order_transaction ot
      JOIN shipping s ON ot.shipping_id = s.shipping_id
    `);

    const orders = orderResult.rows;

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders: ', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  } finally {
    client.release();
  }
};

// Verify payment and update order status
// If payment is verified, update payment status to 'paid' and order status to 'processing'
// If payment is not verified, update payment status to 'failed' and order status remains 'pending'


module.exports = {
  createOrder,
  getOrderByCustomerId,
  getOrderByOrderId,
  getAllOrders
};
