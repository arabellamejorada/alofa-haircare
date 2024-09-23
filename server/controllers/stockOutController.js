const pool = require('../db.js');

const createStockOut = async (req, res) => {
  const client = await pool.connect();
  const { stockOutProducts, order_transaction_id } = req.body;
  const reference_number = null;

  if (!stockOutProducts || stockOutProducts.length === 0 ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await client.query('BEGIN');

    if(order_transaction_id) {
      // Check if the order transaction exists, the REF NO. is the REF NO. in order transaction table
       reference_number = await client.query(`
        SELECT reference_number 
        FROM order_transaction 
        WHERE order_transaction_id = $1;`,
        [order_transaction_id]);
    } else {
      // Generate a reference number if order transaction id is not provided
       reference_number = await client.query(`
        SELECT 'ADJ-' || to_char(NOW(), 'YYYYMMDD') || '-' || nextval('stock_out_ref_num_seq');
      `);
    }

    // Insert stock_out record and explicitly set the stock_out_date
    const stockOutResult = await client.query(
      `
      INSERT INTO stock_out (reference_number, stock_out_date, order_transaction_id)
      VALUES ($1, $2, $3) RETURNING stock_out_id;
      `,
      [reference_number, new Date().toISOString(), order_transaction_id || null]
    );

    const stock_out_id = stockOutResult.rows[0].stock_out_id;

    // Insert the stock_out_products data and update inventory
    for (const product of stockOutProducts) {
      await client.query(
        `
        INSERT INTO stock_out_items (stock_out_id, variation_id, quantity, reason)
        VALUES ($1, $2, $3, $4);
        `,
        [stock_out_id, product.variation_id, product.quantity, product.reason]
      );

      // Update inventory quantity by subtracting the stock_out quantity from current inventory
      await client.query(
        `
        UPDATE inventory
        SET stock_quantity = stock_quantity - $1
        WHERE variation_id = $2;
        `,
        [product.quantity, product.variation_id]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Stock Out recorded successfully',
      stock_out_id,
      reference_number,
      stock_out_date: new Date().toISOString()
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error during stock out:", error);
    res.status(500).json({ message: "Error during stock out", error: error.message });
  } finally {
    client.release();
  }
};


const getAllStockOut = async (req, res) => {
  const client = await pool.connect();

  try {
    const stockInResult = await client.query(`
      SELECT 
          so.stock_out_id, 
          so.reference_number, 
          so.stock_out_date AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila' AS stock_out_date,
          soi.variation_id,
          soi.quantity,
          soi.reason,
          pv.type, 
          pv.value, 
          pv.sku,
          p.name,
          soi.quantity
      FROM 
          stock_out so
      JOIN 
          stock_out_items soi ON so.stock_out_id = soi.stock_out_id
      JOIN 
          product_variation pv ON soi.variation_id = pv.variation_id
      JOIN
          product p ON pv.product_id = p.product_id
      ORDER BY 
          so.stock_out_date DESC
    `);

    res.status(200).json(stockInResult.rows);
  } catch (error) {
    console.error("Error during get all stock in:", error);
    res.status(500).json({ message: "Error during get all stock in", error: error.message });
  } finally {
    client.release();
  }
};


const getStockOutById = async (req, res) => {
  const client = await pool.connect();
  const stock_out_id = req.params.id;

  try {
    const stockOutResult = await client.query(
      `
      SELECT 
        so.stock_out_id, 
        so.reference_number, 
        so.stock_out_date, 
        soi.variation_id, 
        soi.quantity, 
        soi.reason
      FROM 
        stock_out so
      JOIN 
        stock_out_items soi ON so.stock_out_id = soi.stock_out_id
      WHERE 
        so.stock_out_id = $1;
      `,
      [stock_out_id]
    );

    const stockOutData = stockOutResult.rows;
    res.status(200).json(stockOutData);

  } catch (error) {
    console.error("Error during fetching stock out data:", error);
    res.status(500).json({ message: "Error during fetching stock out data", error: error.message });
  } finally {
    client.release();
  }
};

module.exports = {
  createStockOut,
  getAllStockOut,
  getStockOutById
}
