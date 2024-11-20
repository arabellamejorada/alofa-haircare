const pool = require("../db.js");

const createOrder = async (req, res) => {
  const orderDetails = JSON.parse(req.body.orderDetails);
  const cartItems = JSON.parse(req.body.cartItems);
  const proofImage = req.file ? req.file.path : null;

  console.log("Order details received:", orderDetails);
  console.log("Cart items received:", cartItems);
  console.log("Proof image path:", proofImage);

  try {
    // Start a transaction
    await pool.query("BEGIN");

    // Look for J&T Express shipping method
    const shippingMethodResult = await pool.query(
      `SELECT * FROM shipping_method WHERE courier = 'J&T Express'`,
    );

    // Step 1: Insert shipping details and get the shipping_id
    const shippingResult = await pool.query(
      `INSERT INTO shipping (shipping_date, shipping_fee, tracking_number, shipping_method_id, shipping_address_id)
       VALUES (NOW(), $1, $2, $3, $4)
       RETURNING *`,
      [
        orderDetails.shipping_fee || 200, // Default shipping fee
        orderDetails.tracking_number || null,
        orderDetails.shipping_method_id ||
          shippingMethodResult.rows[0].shipping_method_id,
        orderDetails.shipping_address_id,
      ],
    );

    const shipping = shippingResult.rows[0];
    const shipping_id = shipping.shipping_id;
    console.log("Generated shipping_id:", shipping_id);

    // Get payment_method_id from payment_method table based on method_name
    const paymentMethodResult = await pool.query(
      "SELECT method_id FROM payment_method WHERE method_name = $1",
      [orderDetails.paymentMethod],
    );
    if (paymentMethodResult.rowCount === 0) {
      throw new Error(
        `Payment method '${orderDetails.paymentMethod}' not found`,
      );
    }
    const payment_method_id = paymentMethodResult.rows[0].method_id;

    // Get payment_status_id for 'Pending'
    const paymentStatusResult = await pool.query(
      "SELECT status_id FROM payment_status WHERE status_name = $1",
      ["Pending"],
    );
    if (paymentStatusResult.rowCount === 0) {
      throw new Error(`Payment status 'Pending' not found`);
    }
    const payment_status_id = paymentStatusResult.rows[0].status_id;

    // Get order_status_id for 'Pending'
    const orderStatusResult = await pool.query(
      "SELECT status_id FROM order_status WHERE status_name = $1",
      ["Pending"],
    );
    if (orderStatusResult.rowCount === 0) {
      throw new Error(`Order status 'Pending' not found`);
    }
    const order_status_id = orderStatusResult.rows[0].status_id;

    // Step 2: Insert order details with the generated shipping_id
    const orderResult = await pool.query(
      `INSERT INTO orders (
        customer_id, total_amount, date_ordered, proof_image, shipping_id, subtotal, voucher_id, total_discount,
        order_status_id, payment_method_id, payment_status_id
      )
       VALUES ($1, $2, NOW(), $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        orderDetails.customer_id, // $1
        orderDetails.total_amount, // $2
        proofImage || null, // $3
        shipping_id, // $4
        orderDetails.subtotal, // $5
        orderDetails.voucher_id || null, // $6
        orderDetails.total_discount || 0, // $7
        order_status_id, // $8
        payment_method_id, // $9
        payment_status_id, // $10
      ],
    );

    const newOrder = orderResult.rows[0];
    console.log("New order:", newOrder);

    // Step 3: Insert order items with discounted price if applicable
    const orderItemsValues = cartItems.flatMap((item) => [
      newOrder.order_id,
      item.variation_id,
      item.quantity,
      item.discounted_price !== null && item.discounted_price !== undefined
        ? item.discounted_price
        : item.unit_price,
    ]);

    const placeholders = cartItems
      .map(
        (_, i) =>
          `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`,
      )
      .join(", ");

    await pool.query(
      `INSERT INTO order_items (order_id, variation_id, quantity, price) VALUES ${placeholders}`,
      orderItemsValues,
    );

    const orderItemsWithDetails = await getOrderItemsWithDetails(
      newOrder.order_id,
    );

    // Update current_uses of voucher and set it to inactive if it reached its limit
    if (orderDetails.voucher_id) {
      await pool.query(
        `INSERT INTO used_vouchers (voucher_id, customer_id, used_at) VALUES ($1, $2, NOW())`,
        [orderDetails.voucher_id, orderDetails.customer_id],
      );

      await pool.query(
        `UPDATE vouchers SET current_uses = current_uses + 1 WHERE voucher_id = $1`,
        [orderDetails.voucher_id],
      );

      const voucherResult = await pool.query(
        `SELECT * FROM vouchers WHERE voucher_id = $1`,
        [orderDetails.voucher_id],
      );

      const voucher = voucherResult.rows[0];
      if (voucher.current_uses >= voucher.max_uses) {
        await pool.query(
          `UPDATE vouchers SET is_active = false WHERE voucher_id = $1`,
          [orderDetails.voucher_id],
        );
      }
    }

    // Step 4: Delete all items in the cart for this order
    for (const item of cartItems) {
      await deleteCartItems(item.cart_item_id);
    }

    // Fetch the full order details with joined information
    const orderWithDetailsResult = await pool.query(
      `SELECT o.*, 
              o.date_ordered AS order_date,
              pm.method_name AS payment_method_name,
              ps.status_name AS payment_status_name,
              os.status_name AS order_status_name,
              s.shipping_fee,
              s.tracking_number,
              p.first_name AS customer_first_name,
              p.last_name AS customer_last_name
       FROM orders o
       LEFT JOIN payment_method pm ON o.payment_method_id = pm.method_id
       LEFT JOIN payment_status ps ON o.payment_status_id = ps.status_id
       LEFT JOIN order_status os ON o.order_status_id = os.status_id
       LEFT JOIN shipping s ON o.shipping_id = s.shipping_id
       LEFT JOIN customer c ON o.customer_id = c.customer_id
       LEFT JOIN profiles p ON c.profile_id = p.id
       WHERE o.order_id = $1`,
      [newOrder.order_id],
    );

    const order = orderWithDetailsResult.rows[0];

    // Add customer_name to the order object
    order.customer_name = `${order.customer_first_name} ${order.customer_last_name}`;

    // Remove individual customer name fields
    delete order.customer_first_name;
    delete order.customer_last_name;

    // Commit the transaction
    await pool.query("COMMIT");

    res.status(201).json({
      message: "Order created successfully",
      order: order, // Use the full order details with customer_name
      order_items: orderItemsWithDetails,
    });
  } catch (error) {
    // Rollback the transaction in case of an error
    await pool.query("ROLLBACK");
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

const getOrderItemsWithDetails = async (order_id) => {
  try {
    const result = await pool.query(
      `
      SELECT 
          oi.order_id,
          oi.quantity,
          oi.price,
          p.name AS product_name,
          pv.type AS variation_type,
          pv.value AS variation_value,
          pv.image AS image
      FROM 
          order_items oi
      JOIN 
          product_variation pv ON oi.variation_id = pv.variation_id
      JOIN 
          product p ON pv.product_id = p.product_id
      WHERE 
          oi.order_id = $1
    `,
      [order_id],
    );

    return result.rows; // This will contain each item with its product and variation details
  } catch (error) {
    console.error("Error fetching order items with details:", error);
    throw error;
  }
};

const deleteCartItems = async (cart_item_id) => {
  console.log("Deleting cart item:", cart_item_id);
  try {
    await pool.query(`DELETE FROM cart_items WHERE cart_item_id = $1`, [
      cart_item_id,
    ]);
    console.log("Cart item deleted successfully");
  } catch (error) {
    console.error("Error deleting cart item:", error);
    throw error;
  }
};

// Get Orders by Customer ID with order_items
const getOrderByProfileId = async (req, res) => {
  const { profile_id } = req.params;
  try {
    const ordersResult = await pool.query(
      `
      SELECT 
        o.*,
        to_char(o.date_ordered, 'MM-DD-YYYY, HH:MI AM') AS date_ordered,
        os.status_name AS order_status_name,
        pm.method_name AS payment_method_name,
        ps.status_name AS payment_status_name,
        p.first_name AS profile_first_name,
        p.last_name AS profile_last_name,
        s.tracking_number,
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'order_item_id', oi.order_item_id,
                'variation_id', oi.variation_id,
                'quantity', oi.quantity,
                'unit_price', oi.price,
                'item_subtotal', oi.price * oi.quantity,
                'image', pv.image,
                'value', pv.value,
                'sku', pv.sku,
                'product_name', pr.name
            )
        ) AS order_items
    FROM orders o
    LEFT JOIN order_status os ON o.order_status_id = os.status_id
    LEFT JOIN payment_method pm ON o.payment_method_id = pm.method_id
    LEFT JOIN payment_status ps ON o.payment_status_id = ps.status_id
    LEFT JOIN customer c ON o.customer_id = c.customer_id
    LEFT JOIN profiles p ON c.profile_id = p.id
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN product_variation pv ON oi.variation_id = pv.variation_id
    LEFT JOIN product pr ON pv.product_id = pr.product_id
    LEFT JOIN shipping s ON o.shipping_id = s.shipping_id
    WHERE p.id = $1
    GROUP BY 
        o.order_id, 
        os.status_name, 
        pm.method_name, 
        ps.status_name, 
        p.first_name, 
        p.last_name,
        s.tracking_number
    ORDER BY o.order_id;
    `,
      [profile_id],
    );

    if (ordersResult.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "No orders found for this customer" });
    }

    const orders = ordersResult.rows.map((order) => {
      order.customer_name = `${order.profile_first_name || ""} ${order.profile_last_name || ""}`;
      delete order.profile_first_name;
      delete order.profile_last_name;
      return order;
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Get All Orders with Order Items
const getAllOrdersWithOrderItems = async (req, res) => {
  try {
    const ordersResult = await pool.query(`
      SELECT 
        o.*,
        to_char(o.date_ordered, 'MM-DD-YYYY, HH:MI AM') AS order_date,
        os.status_name AS order_status_name,
        pm.method_name AS payment_method_name,
        ps.status_name AS payment_status_name,
        p.first_name AS profile_first_name,
        p.last_name AS profile_last_name,
        s.tracking_number,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'order_item_id', oi.order_item_id,
            'variation_id', oi.variation_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'product_name', pr.name,
            'variation_type', pv.type,
            'variation_value', pv.value,
            'image', pv.image
          )
        ) AS items
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN product_variation pv ON oi.variation_id = pv.variation_id
      LEFT JOIN product pr ON pv.product_id = pr.product_id
      LEFT JOIN order_status os ON o.order_status_id = os.status_id
      LEFT JOIN payment_method pm ON o.payment_method_id = pm.method_id
      LEFT JOIN payment_status ps ON o.payment_status_id = ps.status_id
      LEFT JOIN customer c ON o.customer_id = c.customer_id
      LEFT JOIN profiles p ON c.profile_id = p.id
      LEFT JOIN shipping s ON o.shipping_id = s.shipping_id
      GROUP BY 
        o.order_id, 
        os.status_name, 
        pm.method_name, 
        ps.status_name, 
        p.first_name, 
        p.last_name, 
        s.tracking_number
      ORDER BY o.order_id;
    `);

    if (ordersResult.rowCount === 0) {
      return res.status(200).json({ orders: [] }); // Return an empty array if no results
    }

    // Map orders to include customer_name for convenience
    const orders = ordersResult.rows.map((order) => {
      order.customer_name = `${order.profile_first_name || ""} ${order.profile_last_name || ""}`;
      delete order.profile_first_name;
      delete order.profile_last_name;
      return order;
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching all orders with items:", error);
    res.status(500).json({ error: "Failed to fetch orders with items" });
  }
};

// Get Order with Order items by Order IDD
const getOrderByOrderId = async (req, res) => {
  const { order_id } = req.params;

  try {
    const orderResult = await pool.query(
      `
      SELECT 
        o.*, 
        o.date_ordered AS order_date,
        os.status_name AS order_status_name,
        pm.method_name AS payment_method_name,
        ps.status_name AS payment_status_name,
        s.shipping_fee,
        s.tracking_number,
        sa.first_name,
        sa.last_name,
        sa.address_line,
        sa.barangay,
        sa.city,
        sa.province,
        sa.region,
        sa.zip_code,
        sa.phone_number,
        p.email AS customer_email,
        p.first_name AS profile_first_name,
        p.last_name AS profile_last_name
      FROM orders o
      LEFT JOIN order_status os ON o.order_status_id = os.status_id
      LEFT JOIN payment_method pm ON o.payment_method_id = pm.method_id
      LEFT JOIN payment_status ps ON o.payment_status_id = ps.status_id
      LEFT JOIN shipping s ON o.shipping_id = s.shipping_id
      LEFT JOIN shipping_address sa ON s.shipping_address_id = sa.shipping_address_id
      LEFT JOIN customer c ON o.customer_id = c.customer_id
      LEFT JOIN profiles p ON c.profile_id = p.id
      WHERE o.order_id = $1
    `,
      [order_id],
    );

    if (orderResult.rowCount === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderResult.rows[0];

    // Structure the shipping address
    order.shipping_address = {
      first_name: order.first_name,
      last_name: order.last_name,
      address_line: order.address_line,
      barangay: order.barangay,
      city: order.city,
      province: order.province,
      region: order.region,
      zip_code: order.zip_code,
      phone_number: order.phone_number,
    };

    // Remove the individual address fields from order object
    delete order.first_name;
    delete order.last_name;
    delete order.address_line;
    delete order.barangay;
    delete order.city;
    delete order.province;
    delete order.region;
    delete order.zip_code;
    delete order.phone_number;

    // Add customer_name to the order object
    order.customer_name = `${order.profile_first_name || ""} ${order.profile_last_name || ""}`;

    // Remove individual customer name fields
    delete order.profile_first_name;
    delete order.profile_last_name;

    const orderItemsResult = await pool.query(
      `
      SELECT 
        oi.*, 
        p.name AS product_name, 
        pv.type AS variation_type, 
        pv.value AS variation_value, 
        pv.image AS image
      FROM order_items oi
      JOIN product_variation pv ON oi.variation_id = pv.variation_id
      JOIN product p ON pv.product_id = p.product_id
      WHERE oi.order_id = $1
    `,
      [order_id],
    );

    res.status(200).json({ order: order, order_items: orderItemsResult.rows });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

// Get Order Items by Order ID
const getOrderItemsByOrderId = async (req, res) => {
  const { order_id } = req.params;

  try {
    const orderItemsResult = await pool.query(
      `SELECT 
          oi.*, 
          p.name AS product_name, 
          pv.type AS variation_type, 
          pv.value AS variation_value, 
          pv.image AS image
       FROM order_items oi
       JOIN product_variation pv ON oi.variation_id = pv.variation_id
       JOIN product p ON pv.product_id = p.product_id
       WHERE oi.order_id = $1`,
      [order_id],
    );

    if (orderItemsResult.rowCount === 0) {
      return res.status(404).json({ error: "No items found for this order" });
    }

    res.status(200).json({ order_items: orderItemsResult.rows });
  } catch (error) {
    console.error("Error fetching order items:", error);
    res.status(500).json({ error: "Failed to fetch order items" });
  }
};

// Update Order Payment Status
const updateOrderPaymentStatus = async (req, res) => {
  const { order_id } = req.params;
  const { payment_status_id } = req.body;

  try {
    await pool.query(
      `UPDATE orders SET payment_status_id = $1 WHERE order_id = $2`,
      [payment_status_id, order_id],
    );

    res
      .status(200)
      .json({ message: "Order payment status updated successfully" });
  } catch (error) {
    console.error("Error updating order payment status:", error);
    res.status(500).json({ error: "Failed to update order payment status" });
  }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
  const { order_id } = req.params;
  const { order_status_id } = req.body;
  console.log("received", order_id, order_status_id);
  try {
    await pool.query(
      `UPDATE orders SET order_status_id = $1 WHERE order_id = $2`,
      [order_status_id, order_id],
    );

    if (order_status_id === 4) {
      await pool.query(
        `UPDATE orders SET date_delivered = NOW() WHERE order_id = $1`,
        [order_id],
      );
    }

    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
};

const updateShippingStatusAndTrackingNumber = async (req, res) => {
  const { shipping_id } = req.params;
  const { order_status_id, tracking_number } = req.body;

  try {
    await pool.query("BEGIN");

    // Update the order status in the orders table
    await pool.query(
      `UPDATE orders SET order_status_id = $1 WHERE shipping_id = $2`,
      [order_status_id, shipping_id],
    );

    // Update the tracking number in the shipping table
    await pool.query(
      `UPDATE shipping SET tracking_number = $1 WHERE shipping_id = $2`,
      [tracking_number, shipping_id],
    );

    await pool.query("COMMIT");

    res.status(200).json({
      message: "Order status and tracking number updated successfully",
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error updating order status and tracking number:", error);
    res
      .status(500)
      .json({ error: "Failed to update order status and tracking number" });
  }
};

module.exports = {
  createOrder,
  getOrderByProfileId,
  getAllOrdersWithOrderItems,
  getOrderByOrderId,
  getOrderItemsByOrderId,
  updateOrderPaymentStatus,
  updateOrderStatus,
  updateShippingStatusAndTrackingNumber,
};
