const pool = require('../db.js');

// do something with the date bc it doesnt display the time !!
const createStockIn = async (req, res) => {
  const client = await pool.connect();
  const { employee_id, supplier_id, stockInProducts, reference_number, stock_in_date } = req.body;

  
  if (!employee_id || !supplier_id || !stockInProducts || stockInProducts.length === 0 || !reference_number || !stock_in_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await client.query('BEGIN');

    // Insert stock_in record and get the stock_in_id
    const stockInResult = await client.query(
      `
      INSERT INTO stock_in (employee_id, supplier_id, stock_in_date, reference_number)
      VALUES ($1, $2, $3, $4) RETURNING stock_in_id;
      `,
      [employee_id,supplier_id, stock_in_date, reference_number] 
    );

    const stock_in_id = stockInResult.rows[0].stock_in_id;

    // Insert the stock_in_products data
    for (const product of stockInProducts) {
      await client.query(
        `
        INSERT INTO stock_in_items (stock_in_id, variation_id, quantity)
        VALUES ($1, $2, $3);
        `, 
        [stock_in_id, product.variation_id, product.quantity]
      );

     // Update inventory quantity by adding the stock_in quantity to current inventory
      await client.query(
        `
        UPDATE inventory
        SET stock_quantity = stock_quantity + $1,
        last_updated_date = $2
        WHERE variation_id = $3;
        `,
        [product.quantity, stock_in_date, product.variation_id]
      );      
    }
    
    await client.query('COMMIT');

    res.status(201).json({
      message: 'Stock In recorded successfully',
      stock_in_id,
      reference_number,
      stock_in_date
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error during stock in:", error);
    res.status(500).json({ message: "Error during stock in", error: error.message });
  } finally {
    client.release();
  }
};

const getAllStockIn = async (req, res) => {
  const client = await pool.connect();

  try {
    const stockInResult = await client.query(`
      SELECT 
          si.stock_in_id, 
          si.reference_number,
          si.employee_id,
          to_char(si.stock_in_date, 'MM-DD-YYYY, HH:MI AM') AS stock_in_date,
          s.supplier_id, 
          s.supplier_name, 
          pv.type, 
          pv.value, 
          pv.sku,
          p.name,
          sii.quantity,
          e.first_name || ' ' || e.last_name AS employee_name
      FROM 
          stock_in si
      JOIN 
          supplier s ON si.supplier_id = s.supplier_id
      JOIN 
          stock_in_items sii ON si.stock_in_id = sii.stock_in_id
      JOIN 
          product_variation pv ON sii.variation_id = pv.variation_id
      JOIN
          product p ON pv.product_id = p.product_id
      JOIN 
          employee e ON si.employee_id = e.employee_id
      ORDER BY 
          si.stock_in_date DESC
    `);

    res.status(200).json(stockInResult.rows);
  } catch (error) {
    console.error("Error during get all stock in:", error);
    res.status(500).json({ message: "Error during get all stock in", error: error.message });
  } finally {
    client.release();
  }
};

const getStockInById = async (req, res) => {
  const client = await pool.connect();
  const { id } = req.params;

  try {
    const stockInResult = await client.query(`
      SELECT 
          si.stock_in_id, 
          si.reference_number, 
          si.stock_in_date, 
          si.employee_id,
          sii.quantity,
          e.first_name || ' ' || e.last_name AS employee_name,
          s.supplier_id, 
          s.supplier_name, 
          pv.type, 
          pv.value, 
          pv.sku,
          p.name
      FROM 
          stock_in si
      JOIN 
          supplier s ON si.supplier_id = s.supplier_id
      JOIN 
          stock_in_items sii ON si.stock_in_id = sii.stock_in_id
      JOIN 
          employee e ON so.employee_id = e.employee_id
      JOIN
          product_variation pv ON sii.variation_id = pv.variation_id
      JOIN
          product p ON pv.product_id = p.product_id
      WHERE 
          si.stock_in_id = $1
      ORDER BY 
          si.stock_in_date DESC, 
          si.stock_in_id ASC;
    `, [id]);

    res.status(200).json(stockInResult.rows);
  } catch (error) {
    console.error("Error during get stock in by id:", error);
    res.status(500).json({ message: "Error during get stock in by id", error: error.message });
  } finally {
    client.release();
  }
};


module.exports = {
    createStockIn,
    getAllStockIn,
    getStockInById
}
