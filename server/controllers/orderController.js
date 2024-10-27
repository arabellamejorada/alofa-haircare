const pool = require('../db.js');

// Validate if the cart belongs to the customer and is active
const validateCart = async (cart_id, customer_id) => {
  const result = await pool.query(
    `SELECT * FROM cart WHERE cart_id = $1 AND customer_id = $2 AND status = 'active'`,
    [cart_id, customer_id]
  );
  return result.rowCount > 0;
};

// Calculate the subtotal of the cart items
const calculateSubtotal = async (cart_id) => {
  const result = await pool.query(
    `SELECT SUM(ci.quantity * pv.unit_price) AS subtotal
     FROM cart_items ci
     JOIN product_variation pv ON ci.variation_id = pv.variation_id
     WHERE ci.cart_id = $1`,
    [cart_id]
  );
  return result.rows[0].subtotal || 0;
};

// Apply the voucher code and calculate discount// Apply the voucher code and calculate discount with limits
const applyVoucher = async (subtotal, discount_code, customer_id) => {
  if (!discount_code) return { discountAmount: 0, totalAmount: subtotal };

  const voucherResult = await pool.query(
    `SELECT * FROM vouchers WHERE code = $1 AND is_active = true AND expiration_date >= NOW()`,
    [discount_code]
  );

  if (voucherResult.rowCount === 0) {
    throw new Error('Invalid or expired discount voucher code');
  }

  const voucher = voucherResult.rows[0];

  // Check total usage limit
  if (voucher.total_limit !== null && voucher.current_uses >= voucher.total_limit) {
    throw new Error('Voucher usage limit reached');
  }

  // Check per-user usage limit
  const userVoucherUsage = await pool.query(
    `SELECT COUNT(*) AS usage_count FROM orders WHERE customer_id = $1 AND discount_code = $2`,
    [customer_id, discount_code]
  );

  if (voucher.max_use_per_user !== null && userVoucherUsage.rows[0].usage_count >= voucher.max_use_per_user) {
    throw new Error('Voucher usage limit reached for this user');
  }

  // Check minimum spend
  if (voucher.min_spend !== null && subtotal < voucher.min_spend) {
    throw new Error(`Minimum spend of ${voucher.min_spend} required to use this voucher`);
  }

  // Calculate discount amount
  let discountAmount = 0;
  if (voucher.type === 'flat') {
    discountAmount = Math.min(voucher.discount_value, subtotal); // Flat discount
  } else if (voucher.type === 'percentage') {
    discountAmount = (subtotal * voucher.discount_value) / 100; // Percentage discount
  }

  // Cap discount to max_discount
  if (voucher.max_discount !== null) {
    discountAmount = Math.min(discountAmount, voucher.max_discount);
  }

  const totalAmount = subtotal - discountAmount;

  // Update voucher usage count
  await pool.query(
    `UPDATE vouchers SET current_uses = current_uses + 1 WHERE code = $1`,
    [discount_code]
  );

  return { discountAmount, totalAmount };
};


// Insert a new order into the database
const insertOrder = async (customer_id, subtotal, discountAmount, totalAmount, payment_method, shipping_id, discount_code) => {
  const result = await pool.query(
    `INSERT INTO orders (customer_id, total_amount, discount_amount, subtotal, date_ordered, order_status, payment_method, payment_status, shipping_id, discount_code)
     VALUES ($1, $2, $3, $4, NOW(), 'pending', $5, 'unpaid', $6, $7) RETURNING *`,
    [customer_id, totalAmount, discountAmount, subtotal, payment_method, shipping_id, discount_code]
  );
  return result.rows[0];
};

// Move cart items to order_items
const moveCartItemsToOrderItems = async (orderId, cart_id) => {
  await pool.query(
    `INSERT INTO order_items (order_id, variation_id, quantity, price)
     SELECT $1, ci.variation_id, ci.quantity, pv.unit_price
     FROM cart_items ci
     JOIN product_variation pv ON ci.variation_id = pv.variation_id
     WHERE ci.cart_id = $2`,
    [orderId, cart_id]
  );
};

// Clear the cart after creating the order
const clearCart = async (cart_id) => {
  await pool.query(`DELETE FROM cart_items WHERE cart_id = $1`, [cart_id]);
  await pool.query(`UPDATE cart SET status = 'checked_out' WHERE cart_id = $1`, [cart_id]);
};

// Main createOrder function that uses the modular functions
const createOrder = async (req, res) => {
  const { cart_id, customer_id, payment_method, shipping_id, discount_code } = req.body;

  try {
    // Start a transaction
    await pool.query('BEGIN');

    // Step 1: Validate cart
    const isCartValid = await validateCart(cart_id, customer_id);
    if (!isCartValid) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ error: 'Invalid cart or customer mismatch' });
    }

    // Step 2: Calculate subtotal
    const subtotal = await calculateSubtotal(cart_id);
    if (!subtotal) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ error: 'Cart is empty or invalid' });
    }

    // Step 3: Apply voucher and calculate discount
    let discountAmount = 0;
    let totalAmount = subtotal;
    if (discount_code) {
      try {
        const voucherResult = await applyVoucher(subtotal, discount_code);
        discountAmount = voucherResult.discountAmount;
        totalAmount = voucherResult.totalAmount;
      } catch (error) {
        await pool.query('ROLLBACK');
        return res.status(400).json({ error: error.message });
      }
    }

    // Step 4: Insert order
    const newOrder = await insertOrder(customer_id, subtotal, discountAmount, totalAmount, payment_method, shipping_id, discount_code);
    const orderId = newOrder.order_id;

    // Step 5: Move cart items to order_items
    await moveCartItemsToOrderItems(orderId, cart_id);

    // Step 6: Clear the cart
    await clearCart(cart_id);

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
