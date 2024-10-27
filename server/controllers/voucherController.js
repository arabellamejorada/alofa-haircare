const pool = require('../db.js');

const getAllVouchers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        voucher_id,
        code,
        type,
        discount_value,
        min_spend,
        max_discount,
        total_limit,
        max_use_per_user,
        is_active,
        to_char(expiration_date, 'MM-DD-YYYY, HH:MI AM') AS expiration_date
      FROM vouchers
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    res.status(500).json({ error: 'Failed to fetch vouchers' });
  }
};

module.exports = {
  getAllVouchers,
};


// Get a voucher by ID
const getVoucherById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM vouchers WHERE voucher_id = $1`, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Voucher not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching voucher:', error);
    res.status(500).json({ error: 'Failed to fetch voucher' });
  }
};

// Create a new voucher
const createVoucher = async (req, res) => {
  const {
    code,
    type,
    discount_value,
    min_spend,
    max_discount,
    total_limit,
    max_use_per_user,
    is_active,
    expiration_date,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO vouchers (code, type, discount_value, min_spend, max_discount, total_limit, max_use_per_user, is_active, expiration_date, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING *`,
      [
        code,
        type,
        discount_value,
        min_spend || null,
        max_discount || null,
        total_limit || null,
        max_use_per_user || null,
        is_active,
        expiration_date,
      ]
    );
    res.status(201).json({ message: 'Voucher created successfully', voucher: result.rows[0] });
  } catch (error) {
    console.error('Error creating voucher:', error);
    res.status(500).json({ error: 'Failed to create voucher' });
  }
};

// Update an existing voucher
const updateVoucher = async (req, res) => {
  const { id } = req.params;
  const {
    code,
    type,
    discount_value,
    min_spend,
    max_discount,
    total_limit,
    max_use_per_user,
    is_active,
    expiration_date,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE vouchers
       SET code = $1, type = $2, discount_value = $3, min_spend = $4, max_discount = $5, total_limit = $6,
           max_use_per_user = $7, is_active = $8, expiration_date = $9
       WHERE voucher_id = $10 RETURNING *`,
      [
        code,
        type,
        discount_value,
        min_spend,
        max_discount,
        total_limit,
        max_use_per_user,
        is_active,
        expiration_date,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Voucher not found' });
    }

    res.status(200).json({ message: 'Voucher updated successfully', voucher: result.rows[0] });
  } catch (error) {
    console.error('Error updating voucher:', error);
    res.status(500).json({ error: 'Failed to update voucher' });
  }
};

// Delete a voucher
const deleteVoucher = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`DELETE FROM vouchers WHERE voucher_id = $1 RETURNING *`, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Voucher not found' });
    }

    res.status(200).json({ message: 'Voucher deleted successfully' });
  } catch (error) {
    console.error('Error deleting voucher:', error);
    res.status(500).json({ error: 'Failed to delete voucher' });
  }
};

module.exports = {
  getAllVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher,
};
