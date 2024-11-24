const pool = require('../db.js');

// Update voucher status based on validity period
const updateVoucherStatus = async () => {
  await pool.query(`
    UPDATE vouchers
    SET is_active = CASE
        WHEN valid_from <= NOW() AND valid_until >= NOW() THEN true
        ELSE false
    END
    WHERE (is_active = true AND valid_until < NOW()) 
       OR (is_active = false AND valid_from <= NOW() AND valid_until >= NOW())
  `);
};

// Get all vouchers
const getAllVouchers = async (req, res) => {
  try {
    await updateVoucherStatus();

    // Fetch all vouchers with the updated status
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
        current_uses,
        is_active,
        to_char(valid_from, 'MM-DD-YYYY, HH:MI AM') AS valid_from,
        to_char(valid_until, 'MM-DD-YYYY, HH:MI AM') AS valid_until,
        discount_scope
      FROM vouchers
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    res.status(500).json({ error: 'Failed to fetch vouchers' });
  }
};

// Get a voucher by ID  
const getVoucherById = async (req, res) => {
  const { id } = req.params;
  
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
        current_uses,
        is_active,
        to_char(valid_from, 'MM-DD-YYYY, HH:MI AM') AS valid_from,
        to_char(valid_until, 'MM-DD-YYYY, HH:MI AM') AS valid_until,
        discount_scope
      FROM vouchers
      WHERE voucher_id = $1`, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Voucher not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching voucher:', error);
    res.status(500).json({ error: 'Failed to fetch voucher' });
  }
};

// Get product variations associated with a voucher
const getVoucherProductVariations = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT 
          pv.variation_id,
          pv.sku, 
          p.name,
          pv.value, 
          pv.unit_price 
        FROM voucher_product_variation vpv
        JOIN product_variation pv ON vpv.variation_id = pv.variation_id
        JOIN product p ON pv.product_id = p.product_id
        WHERE vpv.voucher_id = $1`,
      [id]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching product variations:', error);
    res.status(500).json({ error: 'Failed to fetch product variations' });
  }
};

// Get All Used Vouchers
const getAllUsedVouchers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        uv.*,
        v.code
      FROM used_vouchers uv
      JOIN vouchers v ON uv.voucher_id = v.voucher_id
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching used vouchers:', error);
    res.status(500).json({ error: 'Failed to fetch used vouchers' });
  }
};

// Create a new voucher
const createVoucher = async (req, res) => {
  console.log('Creating voucher:', req.body);
  const {
    code,
    type,
    discount_value,
    min_spend,
    max_discount,
    total_limit,
    max_use_per_user,
    is_active,
    valid_from,
    valid_until,
    discount_scope,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO vouchers
        (code, type, discount_value, min_spend, max_discount, total_limit, max_use_per_user, is_active, valid_from, valid_until, discount_scope)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [
          code,
          type,
          discount_value,
          min_spend || 0,
          max_discount || null,
          total_limit,
          max_use_per_user ||1,
          is_active,
          valid_from,
          valid_until,
          discount_scope,
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
  console.log('Updating voucher:', req.body);
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
    valid_from,
    valid_until,
    discount_scope,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE vouchers
        SET code = $1,
            type = $2,
            discount_value = $3,
            min_spend = $4,
            max_discount = $5,
            total_limit = $6,
            max_use_per_user = $7,
            is_active = $8,
            valid_from = $9,
            valid_until = $10,
            discount_scope = $11
        WHERE voucher_id = $12 RETURNING *`,
        [
          code,
          type,
          discount_value,
          min_spend || null,
          max_discount || null,
          total_limit,
          max_use_per_user,
          is_active,
          valid_from,
          valid_until,
          discount_scope,
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

// Delete a voucher if it exists and if it has not been used
const deleteVoucher = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the voucher has been used
    const usedVoucherResult = await pool.query(
      `SELECT * FROM used_vouchers WHERE voucher_id = $1`,
      [id]
    );

    if (usedVoucherResult.rowCount > 0) {
      return res.status(400).json({ error: 'Voucher has been used and cannot be deleted' });
    }

    const result = await pool.query(
      `DELETE FROM vouchers WHERE voucher_id = $1 RETURNING *`,
      [id]
    );

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
  const { code, subtotal, customer_id, cartItems = [] } = req.body;
  console.log('Applying voucher:', code, cartItems, subtotal, customer_id);

  try {
    // Step 1: Validate and update voucher status
    await updateVoucherStatus();

    // Step 2: Fetch the voucher by code and check if it's active
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

    // Check validity period
    const currentDate = new Date();
    const validFrom = new Date(voucher.valid_from);
    const validUntil = new Date(voucher.valid_until);
    if (currentDate < validFrom || currentDate > validUntil) {
      return res.status(400).json({ error: 'Voucher is not valid at this time' });
    }

    // Check minimum spend
    const minSpend = voucher.min_spend ? Number(voucher.min_spend) : 0;
    if (minSpend && subtotal < minSpend) {
      console.error(`Minimum spend requirement not met. Required: ${minSpend}, Subtotal: ${subtotal}`);
      return res.status(400).json({
        error: `Minimum spend of ₱${minSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} is required to use this voucher.`,
      });
    }

    // Check usage limits per customer and total limit
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

    if (voucher.max_use_per_user !== null && customerVoucherUsage >= voucher.max_use_per_user) {
      console.error('Voucher usage limit per customer has been reached');
      return res.status(400).json({ error: 'Voucher usage limit per customer has been reached' });
    }

    if (voucher.total_limit !== null && voucher.current_uses >= voucher.total_limit) {
      console.error('Voucher has reached its total limit');
      return res.status(400).json({ error: 'Voucher has reached its total limit' });
    }

    // Step 3: Calculate the discount based on the voucher
    const discountValue = Number(voucher.discount_value);
    const maxDiscount = voucher.max_discount ? Number(voucher.max_discount) : 0;
    let discount = 0;

    // Fetch applicable variations if the discount scope is for product_variation
    let applicableVariationIds = [];
    if (voucher.discount_scope === 'product_variation') {
      const applicableItems = await pool.query(
        `SELECT pv.variation_id FROM voucher_product_variation vpv
        JOIN product_variation pv ON vpv.variation_id = pv.variation_id
        WHERE vpv.voucher_id = $1`,
        [voucher.voucher_id]
      );

      applicableVariationIds = applicableItems.rows.map(row => row.variation_id);
    } else if (voucher.discount_scope === 'total') {
      // Apply discount to all items
      applicableVariationIds = cartItems.map(item => item.variation_id);
    }

    // Check if any items in the cart match the applicable variations
    const matchingItems = cartItems.filter(item => applicableVariationIds.includes(item.variation_id));
    if (matchingItems.length === 0) {
      console.log('No items in the cart match the voucher criteria');
      return res.status(400).json({ error: 'No items in the cart match the voucher criteria'});
    } else {
      console.log('Matching items:', matchingItems);
    }

    // Calculate total cart price for proportional distribution
    const totalPrice = cartItems.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);
    console.log('Total cart price:', totalPrice);

    // Determine the total discount based on the voucher type and apply the cap if maxDiscount > 0
    let totalDiscount = 0;
    if (voucher.discount_scope === 'total') {
      if (voucher.type === "percentage") {
        totalDiscount = (totalPrice * discountValue) / 100;
        console.log('Calculated total percentage discount:', totalDiscount);
      } else if (voucher.type === "flat") {
        totalDiscount = discountValue;
        console.log('Calculated total flat discount:', totalDiscount);
      }

      // Apply max discount cap only if it's greater than 0
      if (maxDiscount > 0) {
        totalDiscount = Math.min(totalDiscount, maxDiscount);
      }
      console.log('Total discount after applying cap:', totalDiscount);
    }

    // Proceed with applying the discount if totalDiscount is greater than 0
    const updatedCartItems = cartItems.map((item) => {
      let discounted_price = null; // Default to null for non-discounted items
      let itemDiscount = 0;

      if (applicableVariationIds.includes(item.variation_id)) {
        if (voucher.discount_scope === 'product_variation') {
          console.log('Applying discount to item:', item.variation_id);

          // Step 1: Calculate the total price of applicable items
          const totalPriceOfApplicableItems = cartItems
            .filter(i => applicableVariationIds.includes(i.variation_id))
            .reduce((acc, i) => acc + i.unit_price * i.quantity, 0);

          // Step 2: Calculate the initial total discount based on percentage or flat type
          let totalDiscount = 0;
          if (voucher.type === "percentage") {
            totalDiscount = (totalPriceOfApplicableItems * discountValue) / 100;
          } else if (voucher.type === "flat") {
            totalDiscount = discountValue * item.quantity;
          }

          // Step 3: Apply the max discount cap if totalDiscount exceeds it
          if (maxDiscount > 0) {
            totalDiscount = Math.min(totalDiscount, maxDiscount);
          }
          console.log('Total discount after applying max cap:', totalDiscount);

          // Step 4: Calculate the item discount proportionally
          const itemSubtotal = item.unit_price * item.quantity;
          const itemProportion = itemSubtotal / totalPriceOfApplicableItems;
          itemDiscount = itemProportion * totalDiscount; // Proportionally allocate the capped discount

          console.log('Item Subtotal:', itemSubtotal);
          console.log('Item Proportion:', itemProportion);
          console.log('Proportionally distributed item discount:', itemDiscount);

        } else if (voucher.discount_scope === 'total') {
          // For 'total' scope, distribute the total discount across all items in the cart
          console.log('Applying total discount to item:', item.variation_id);

          // Calculate the total cart price
          const totalCartPrice = cartItems.reduce((acc, i) => acc + i.unit_price * i.quantity, 0);
          
          // Step 1: Calculate total discount based on the voucher type
          let totalDiscount = 0;
          if (voucher.type === "percentage") {
            totalDiscount = (totalCartPrice * discountValue) / 100;
          } else if (voucher.type === "flat") {
            totalDiscount = discountValue;
          }

          // Apply max discount cap if needed
          if (maxDiscount > 0) {
            totalDiscount = Math.min(totalDiscount, maxDiscount);
          }

          // Step 2: Distribute the capped discount proportionally based on each item's price contribution
          const itemSubtotal = item.unit_price * item.quantity;
          const itemProportion = itemSubtotal / totalCartPrice;
          itemDiscount = itemProportion * totalDiscount;

          console.log('Item Subtotal:', itemSubtotal);
          console.log('Item Proportion:', itemProportion);
          console.log('Item Discount:', itemDiscount);
        }

        // Calculate the discounted price per unit for this item
        discounted_price = Math.max(item.unit_price - (itemDiscount / item.quantity), 0);
        console.log('Discounted price per unit for item:', discounted_price);

        // Accumulate the total discount for tracking
        discount += itemDiscount;
      }

      // Return the item with discounted price or null if not applicable
      return {
        ...item,
        discounted_price: discounted_price !== null ? parseFloat(discounted_price.toFixed(2)) : null
      };
    });

    // Calculate the new total after applying the discount
    const totalAmount = subtotal - discount;
    console.log('Total amount after discount:', totalAmount);

    // Send response with updated cart items
    res.status(200).json({
      message: 'Voucher applied successfully',
      discount,
      totalAmount,
      voucher_id: voucher.voucher_id,
      updatedCartItems: updatedCartItems, // Updated cart items with discounted prices
    });
  } catch (error) {
    console.error('Error applying voucher:', error);
    res.status(500).json({ error: 'Failed to apply voucher' });
  }
};



// CRUD operations for voucher-product variation relationships
const addVoucherProductVariation = async (req, res) => {
  const { voucher_id, variation_id } = req.body;

  console.log('Adding product variation to voucher:', voucher_id, variation_id);
  try {
    // Step 1: Check the voucher's discount_scope
    const voucherResult = await pool.query(
      `SELECT discount_scope FROM vouchers WHERE voucher_id = $1`,
      [voucher_id]
    );

    if (voucherResult.rowCount === 0) {
      return res.status(404).json({ error: 'Voucher not found' });
    }

    const { discount_scope } = voucherResult.rows[0];

    // Step 2: Restrict addition if scope is "total"
    if (discount_scope === 'total') {
      console.error('Cannot add product variations to a voucher with a "total" discount scope');

      return res.status(400).json({
        error: 'Cannot add product variations to a voucher with a "total" discount scope'
      });
    }

    // Step 3: Proceed with adding the product variation if scope is "product_variation"
    await pool.query(
      `INSERT INTO voucher_product_variation (voucher_id, variation_id) VALUES ($1, $2)`,
      [voucher_id, variation_id]
    );

    res.status(201).json({ message: 'Product variation added to voucher' });
  } catch (error) {
    console.error('Error adding product variation to voucher:', error);
    res.status(500).json({ error: 'Failed to add product variation to voucher' });
  }
};


const removeVoucherProductVariation = async (req, res) => {
  const { voucher_id, variation_id } = req.body;
  try {
    await pool.query(
      `DELETE FROM voucher_product_variation WHERE voucher_id = $1 AND variation_id = $2`,
      [voucher_id, variation_id]
    );
    console.log('Product variation removed from voucher:', voucher_id, variation_id);
    res.status(200).json({ message: 'Product variation removed from voucher' });
  } catch (error) {
    console.error('Error removing product variation from voucher:', error);
    res.status(500).json({ error: 'Failed to remove product variation from voucher' });
  }
};

const manageVoucherVariations = async (req, res) => {
  const { voucher_id, variations = [] } = req.body;
  console.log('Managing voucher variations:', voucher_id, variations);

  try {
    // Step 1: Validate the voucher's discount_scope
    const voucherResult = await pool.query(
      `SELECT discount_scope FROM vouchers WHERE voucher_id = $1`,
      [voucher_id]
    );

    if (voucherResult.rowCount === 0) {
      return res.status(404).json({ error: 'Voucher not found' });
    }

    const { discount_scope } = voucherResult.rows[0];

    // Restrict management if the discount scope is "total"
    if (discount_scope === 'total') {
      console.error('Cannot manage product variations for a voucher with a "total" discount scope');
      return res.status(400).json({
        error: 'Cannot manage product variations for a voucher with a "total" discount scope'
      });
    }

    // Step 2: Fetch existing product variations associated with the voucher
    const existingVariationsResult = await pool.query(
      `SELECT variation_id FROM voucher_product_variation WHERE voucher_id = $1`,
      [voucher_id]
    );

    const existingVariations = existingVariationsResult.rows.map(row => row.variation_id);

    // Determine variations to add or remove
    const variationsToAdd = variations.filter(variation => !existingVariations.includes(variation));
    const variationsToRemove = existingVariations.filter(variation => !variations.includes(variation));

    // Insert new variations if any
    if (variationsToAdd.length > 0) {
      const addPromises = variationsToAdd.map(variation_id =>
        pool.query(
          `INSERT INTO voucher_product_variation (voucher_id, variation_id) VALUES ($1, $2)`,
          [voucher_id, variation_id]
        )
      );
      await Promise.all(addPromises);
    }

    // Remove variations if any
    if (variationsToRemove.length > 0) {
      const removePromises = variationsToRemove.map(variation_id =>
        pool.query(
          `DELETE FROM voucher_product_variation WHERE voucher_id = $1 AND variation_id = $2`,
          [voucher_id, variation_id]
        )
      );
      await Promise.all(removePromises);
    }

    res.status(200).json({ message: 'Voucher variations managed successfully' });
  } catch (error) {
    console.error('Error managing voucher variations:', error);
    res.status(500).json({ error: 'Failed to manage voucher variations' });
  }
};


module.exports = {
  getAllVouchers,
  getVoucherProductVariations,
  getVoucherById,
  getAllUsedVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  applyVoucher,
  addVoucherProductVariation,
  removeVoucherProductVariation,
  manageVoucherVariations,
};