// note: nasa orderRoutes and routes for refund
const pool = require("../db.js");

const createRefundRequest = async (req, res) => {
  const { order_id, customer_id, reason, refund_items } = req.body; // Extract fields
  const files = req.files || []; // Extract uploaded files

  console.log("Request body:", req.body);
  console.log("Files:", files);
  try {
    // Validate required fields
    if (!order_id || !reason || !refund_items || files.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: order_id, reason, refund_items, or proofs.",
      });
    }

    // Check if a refund request already exists for the order
    const existingRefund = await pool.query(
      `SELECT id FROM refund_request WHERE order_id = $1`,
      [order_id]
    );
    if (existingRefund.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "A refund request already exists for this order.",
      });
    }

    // Calculate total_refund_amount
    const parsedRefundItems =
      typeof refund_items === "string" ? JSON.parse(refund_items) : refund_items;

    const totalRefundAmount = parsedRefundItems.reduce(
      (total, item) => total + item.unit_price * item.quantity,
      0
    );

    console.log("Total refund amt:", totalRefundAmount);
    // Generate proofs array
    const proofs = files.map((file) => `/uploads/refund/${file.filename}`);

    // Insert refund request into the database
    const refundResult = await pool.query(
      `INSERT INTO refund_request (order_id, customer_id, reason, proofs, total_refund_amount, requested_at, updated_at)
       VALUES ($1, $2, $3, $4::TEXT[], $5, NOW(), NOW())
       RETURNING id`,
      [order_id, customer_id, reason, proofs, totalRefundAmount]
    );

    const refundRequestId = refundResult.rows[0].id;

    // Insert refund items into the refund_items table
    const refundItemsInsertQueries = parsedRefundItems.map((item) => {
      return pool.query(
        `INSERT INTO refund_items (refund_request_id, order_item_id, variation_id, quantity, item_subtotal)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          refundRequestId,
          item.order_item_id,
          item.variation_id,
          item.quantity,
          item.unit_price * item.quantity,
        ]
      );
    });
    await Promise.all(refundItemsInsertQueries);

    res.status(201).json({
      success: true,
      message: "Refund request created successfully",
      data: {
        refund_request_id: refundRequestId,
        order_id,
        customer_id,
        reason,
        proofs,
        total_refund_amount: totalRefundAmount,
      },
    });
  } catch (error) {
    console.error("Error creating refund request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create refund request",
      error: error.message,
    });
  }
};

const getRefundRequestsByProfileId = async (req, res) => {
  const { profile_id } = req.params;

  try {
      const refundResult = await pool.query(
        `SELECT 
              rr.id as refund_request_id,
              rr.order_id,
              rr.customer_id,
              rr.reason,
              rr.proofs,
              rr.total_refund_amount,
              to_char(rr.requested_at, 'MM-DD-YYYY, HH:MI AM') AS requested_at,
              to_char(rr.updated_at, 'MM-DD-YYYY, HH:MI AM') AS updated_at,
              p.first_name AS profile_first_name,
              p.last_name AS profile_last_name,
              o.order_status_id,
              os.status_name AS order_status_name,
              JSON_AGG(
                JSON_BUILD_OBJECT(
                  'refund_item_id', ri.id,
                  'order_item_id', ri.order_item_id,
                  'variation_id', ri.variation_id,
                  'quantity', ri.quantity,
                  'item_subtotal', ri.item_subtotal,
                  'value', pv.value,
                  'image', pv.image,
                  'product_name', pr.name,
                  'sku', pv.sku
                ) ORDER BY ri.id ASC
              ) AS refund_items
          FROM 
              refund_request rr
          LEFT JOIN refund_items ri ON rr.id = ri.refund_request_id
          LEFT JOIN product_variation pv ON ri.variation_id = pv.variation_id
          LEFT JOIN product pr ON pv.product_id = pr.product_id
          LEFT JOIN orders o ON rr.order_id = o.order_id
          LEFT JOIN customer c ON o.customer_id = c.customer_id
          LEFT JOIN profiles p ON c.profile_id = p.id
          LEFT JOIN order_status os ON o.order_status_id = os.status_id
          WHERE p.id = $1
          GROUP BY
              rr.id,
              p.first_name,
              p.last_name,
              o.order_status_id,
              os.status_name
          ORDER BY rr.requested_at DESC
        `,
        [profile_id]
      );

      if (refundResult.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "No refund requests found for this customer" });
    }

     const refunds = refundResult.rows.map((refund) => {
      refund.customer_name = `${refund.profile_first_name || ""} ${refund.profile_last_name || ""}`;
      delete refund.profile_first_name;
      delete refund.profile_last_name;
      return refund;
    });

    res.status(200).json(refunds);
  } catch (error) {
    console.error("Error fetching refund requests by profile ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch refund requests",
      error: error.message,
    });
  }
}

module.exports = {
  createRefundRequest,
  getRefundRequestsByProfileId,
};