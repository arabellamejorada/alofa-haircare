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


const applyVoucher = async (req, res) => {
  const { code, subtotal, customer_id } = req.body;
  console.log('Applying voucher:', code, subtotal, customer_id);

  try {
    // Step 1: Fetch the voucher by code and check if it's active
    const voucherResult = await pool.query(
      `SELECT * FROM vouchers WHERE code = $1 AND is_active = true`,
      [code]
    );

    if (voucherResult.rowCount === 0) {
      console.error('Voucher not found or inactive');
      return res.status(404).json({ error: 'Voucher not found or inactive' });
    }

    const voucher = voucherResult.rows[0];
    console.log('Voucher details:', voucher);

    // Step 2: Check if the voucher has expired
    const currentDate = new Date();
    const expirationDate = new Date(voucher.expiration_date);
    if (expirationDate < currentDate) {
      console.error('Voucher has expired');
      return res.status(400).json({ error: 'Voucher has expired' });
    }

    const minSpend = voucher.min_spend ? Number(voucher.min_spend) : 0;
    // Step 3: Check minimum spend requirement
    if (minSpend && subtotal < minSpend) {
      console.error(`Minimum spend requirement not met. Required: ${minSpend}, Subtotal: ${subtotal}`);
      return res.status(400).json({
      error: `Minimum spend of ₱${minSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} is required to use this voucher.`,
      });
    }

    // Step 4: Retrieve the customer's used vouchers count from the `used_vouchers` table
    let customerVoucherUsage = 0;
    try {
      const customerUsageResult = await pool.query(
        `SELECT COUNT(*) AS usage_count FROM used_vouchers WHERE customer_id = $1 AND voucher_id = $2`,
        [customer_id, voucher.voucher_id]
      );

      customerVoucherUsage = parseInt(customerUsageResult.rows[0].usage_count, 10);
      console.log('Customer voucher usage count:', customerVoucherUsage);
    } catch (usageError) {
      console.error('Error retrieving customer usage count:', usageError);
      return res.status(500).json({ error: 'Error retrieving customer usage count' });
    }

    // Step 5: Check the per-customer usage limit
    if (voucher.max_use_per_user !== null && customerVoucherUsage >= voucher.max_use_per_user) {
      console.error('Voucher usage limit per customer has been reached');
      return res.status(400).json({ error: 'Voucher usage limit per customer has been reached' });
    }

 // Convert discount_value and max_discount to numbers, setting defaults if undefined
const discountValue = voucher.discount_value ? Number(voucher.discount_value) : 0;
const maxDiscount = voucher.max_discount ? Number(voucher.max_discount) : 0;

// Step 6: Calculate the discount based on voucher type
let discount = 0;

if (voucher.type === 'percentage') {
  // Calculate percentage-based discount
  discount = (subtotal * discountValue) / 100;

  // Apply max discount cap if it’s defined and discount exceeds it
  if (maxDiscount > 0 && discount > maxDiscount) {
    discount = maxDiscount;
  }
} else if (voucher.type === 'flat') {
  // Apply flat discount directly
  discount = discountValue;

  // Apply max discount cap if it’s defined and discount exceeds it
  if (maxDiscount > 0 && discount > maxDiscount) {
    discount = maxDiscount;
  }
}

// Log the calculated discount for debugging purposes
console.log('Calculated discount:', discount);

    // Step 7: Calculate the new total after applying the discount
    const totalAmount = subtotal - discount;
    console.log('Total amount after discount:', totalAmount);

    // Step 8: Insert the voucher usage record into the `used_vouchers` table
    try {
      await pool.query(
        `INSERT INTO used_vouchers (customer_id, voucher_id, used_at) VALUES ($1, $2, NOW())`,
        [customer_id, voucher.voucher_id]
      );
      console.log('Voucher usage record inserted');
    } catch (insertError) {
      console.error('Error inserting voucher usage record:', insertError);
      return res.status(500).json({ error: 'Error recording voucher usage' });
    }

    // Step 9: Return success response
    res.status(200).json({
      message: 'Voucher applied successfully',
      discount,
      totalAmount,
    });
  } catch (error) {
    console.error('Error applying voucher:', error);
    res.status(500).json({ error: 'Failed to apply voucher' });
  }
};

module.exports = {
  getAllVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  applyVoucher
};
