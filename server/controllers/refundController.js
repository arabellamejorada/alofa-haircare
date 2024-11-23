const pool = require("../db.js");

const formatDate = (date, options = {}) => {
  if (!date) return null;

  const defaultOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Manila",
  };

  const formatOptions = { ...defaultOptions, ...options };

  return new Date(date).toLocaleString("en-PH", formatOptions).replace(",", "");
};
// Modify createRefundRequest to include refund_status_id
const createRefundRequest = async (req, res) => {
  const { order_id, customer_id, reason, refund_items } = req.body; // Extract fields
  const files = req.files || []; // Extract uploaded files

  console.log("Request body:", req.body);
  console.log("Files:", files);
  try {
    // Validate required fields
    const missingFields = [];
    if (!order_id) missingFields.push("order_id");
    if (!reason) missingFields.push("reason");
    if (!refund_items) missingFields.push("refund_items");
    if (files.length === 0) missingFields.push("proof files");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing or invalid fields: ${missingFields.join(", ")}`,
      });
    }

    // Check if a refund request already exists for the order
    const existingRefund = await pool.query(
      `SELECT id FROM refund_request WHERE order_id = $1`,
      [order_id],
    );
    if (existingRefund.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "A refund request already exists for this order.",
      });
    }

    const parsedRefundItems =
      typeof refund_items === "string"
        ? JSON.parse(refund_items)
        : refund_items;

    if (!Array.isArray(parsedRefundItems) || parsedRefundItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing refund_items.",
      });
    }

    const totalRefundAmount = parsedRefundItems.reduce(
      (total, item) => total + item.unit_price * item.quantity,
      0,
    );

    console.log("Total refund amt:", totalRefundAmount);
    // Generate proofs array
    const proofs = files.map((file) => `/uploads/refund/${file.filename}`);

    // Insert refund request into the database
    const refundResult = await pool.query(
      `INSERT INTO refund_request (order_id, customer_id, reason, proofs, total_refund_amount, refund_status_id, requested_at, updated_at)
       VALUES ($1, $2, $3, $4::TEXT[], $5, $6, NOW(), NOW())
       RETURNING id`,
      [order_id, customer_id, reason, proofs, totalRefundAmount, 1], // 1 corresponds to "Processing" status
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
        ],
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

// Modify getRefundRequestsByProfileId to include refund_status
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
            rr.requested_at,
            rr.updated_at,
            rr.refund_status_id,
            rs.status_name AS refund_status_name,
            p.first_name AS profile_first_name,
            p.last_name AS profile_last_name,
            o.order_id,
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
                'sku', pv.sku,
                'unit_price', oi.price
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
        LEFT JOIN refund_status rs ON rr.refund_status_id = rs.status_id
        LEFT JOIN order_items oi ON ri.order_item_id = oi.order_item_id
        WHERE p.id = $1
        GROUP BY
            rr.id,
            rr.refund_status_id,
            rs.status_name,
            p.first_name,
            p.last_name,
            o.order_id,
            o.order_status_id,
            os.status_name
        ORDER BY rr.requested_at DESC
      `,
      [profile_id],
    );

    if (refundResult.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "No refund requests found for this customer" });
    }

    const refunds = refundResult.rows.map((refund) => {
      refund.customer_name = `${
        refund.profile_first_name || ""
      } ${refund.profile_last_name || ""}`;
      (refund.requested_at = formatDate(refund.requested_at)),
      (refund.updated_at = formatDate(refund.updated_at)),
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
};

// Modify getAllRefundRequests to include refund_status
const getAllRefundRequests = async (req, res) => {
  try {
    const refundResult = await pool.query(
      `SELECT 
            rr.id as refund_request_id,
            rr.order_id,
            rr.customer_id,
            rr.reason,
            rr.proofs,
            rr.total_refund_amount,
            rr.requested_at,
            rr.updated_at,
            rr.refund_status_id,
            rs.status_name AS refund_status_name,
            p.first_name AS profile_first_name,
            p.last_name AS profile_last_name,
            p.email AS profile_email, -- Include email here
            o.order_status_id,
            os.status_name AS order_status_name,
            ps.status_name AS payment_status_name,
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
        LEFT JOIN payment_status ps ON o.payment_status_id = ps.status_id
        LEFT JOIN refund_status rs ON rr.refund_status_id = rs.status_id
        GROUP BY
            rr.id,
            rr.refund_status_id,
            rs.status_name,
            p.first_name,
            p.last_name,
            p.email, -- Add email to GROUP BY
            o.order_status_id,
            os.status_name,
            ps.status_name
        ORDER BY rr.requested_at DESC
      `,
    );

    if (refundResult.rowCount === 0) {
      return res.status(200).json([]); // Return empty array
    }

    const refunds = refundResult.rows.map((refund) => {
      refund.customer_name = `${
        refund.profile_first_name || ""
      } ${refund.profile_last_name || ""}`;
      refund.customer_email = refund.profile_email; // Map the email
      refund.requested_at = formatDate(refund.requested_at);
      refund.updated_at = formatDate(refund.updated_at);
      delete refund.profile_first_name;
      delete refund.profile_last_name;
      delete refund.profile_email; // Optional: Remove raw email field
      return refund;
    });

    res.status(200).json(refunds);
  } catch (error) {
    console.error("Error fetching all refund requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch refund requests",
      error: error.message,
    });
  }
};

const updateRefundStatus = async (req, res) => {
  const { refund_request_id } = req.params;
  const { status_id } = req.body;

  try {
    // Update refund status in the database
    const result = await pool.query(
      `UPDATE refund_request 
       SET refund_status_id = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status_id, refund_request_id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Refund request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Refund status updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating refund status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update refund status",
      error: error.message,
    });
  }
};

const checkIfOrderIdExists = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await pool.query(
      `SELECT id FROM refund_request WHERE order_id = $1`,
      [orderId],
    );
    const exists = result.rows.length > 0;
    res.status(200).json({ exists });
  } catch (error) {
    console.error("Error checking if order ID exists:", error);
    res.status(500).json({ error: "Failed to check if order ID exists." });
  }
};

module.exports = {
  createRefundRequest,
  getRefundRequestsByProfileId,
  getAllRefundRequests,
  updateRefundStatus,
  checkIfOrderIdExists,
};
