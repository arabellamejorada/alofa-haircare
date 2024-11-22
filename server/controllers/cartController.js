const pool = require('../db.js');

// Utility function to create a new cart
const createNewCart = async (customer_id) => {
    try {
        const result = await pool.query(
            `INSERT INTO cart (customer_id, created_at, last_activity, status)
             VALUES ($1, NOW(), NOW(), 'active') RETURNING *`,
            [customer_id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creating cart:', error.message);
        throw error;
    }
};

// Controller to handle cart creation
const createCart = async (req, res) => {
    const { customer_id } = req.body;

    try {
        const newCart = await createNewCart(customer_id);
        return res.status(201).json(newCart);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create cart' });
    }
};


const addCartItem = async (req, res) => {
    console.log("Request Add Item", req.params, req.body);
    const { variation_id, quantity } = req.body;
    let { cart_id } = req.params;
    const { customer_id } = req.body; // Allow customer_id to be provided in the body

    try {
        // Check if stock is available
        const stockResult = await pool.query(
            `SELECT stock_quantity FROM inventory WHERE variation_id = $1`,
            [variation_id]
        );

        if (stockResult.rowCount === 0) {
            return res.status(404).json({ error: 'Variation not found in inventory' });
        }

        const availableStock = stockResult.rows[0].stock_quantity;
        console.log('Available stock:', availableStock);

        // If cart_id is not provided, create a new cart (guest user)
        if (!cart_id) {
            const newCart = await createNewCart(customer_id || null); // Create guest or customer cart
            cart_id = newCart.cart_id;
        }

        // Check if the item already exists in the cart
        const existingItem = await pool.query(
            `SELECT * FROM cart_items WHERE cart_id = $1 AND variation_id = $2`,
            [cart_id, variation_id]
        );

        if (existingItem.rowCount > 0) {
            // Check if the quantity exceeds the available stock
            const currentCartQuantity = existingItem.rows[0].quantity;
            if (currentCartQuantity+1 > availableStock) {
                console.log('Insufficient stock quantity');
                return res.status(400).json({ error: 'Insufficient stock quantity' });
            }

            // If item exists, update the quantity
            const updatedItem = await pool.query(
                `UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND variation_id = $3 RETURNING *`,
                [quantity, cart_id, variation_id]
            );

            await pool.query(
                `UPDATE cart SET last_activity = NOW() WHERE cart_id = $1`,
                [cart_id]
            );

            console.log("Updated Item", updatedItem.rows[0]);
            return res.status(200).json(updatedItem.rows[0]);
        } else {
            // If item does not exist, add a new cart item
            const newItem = await pool.query(
                `INSERT INTO cart_items (cart_id, variation_id, quantity) 
                 VALUES ($1, $2, $3) RETURNING *`,
                [cart_id, variation_id, quantity]
            );

            await pool.query(
                `UPDATE cart SET last_activity = NOW() WHERE cart_id = $1`,
                [cart_id]
            );

            console.log("New Item", newItem.rows[0]);
            return res.status(201).json(newItem.rows[0]);
        }
    } catch (error) {
        console.error('Error adding cart item:', error.message);
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
};

const getCartByCustomerId = async (req, res) => {
    const { profile_id } = req.params;

      // Fetch the customer ID based on profile ID
    const result = await pool.query(
        `SELECT customer_id FROM customer WHERE profile_id = $1`,
        [profile_id]
    );
    const customer_id = result.rows.length > 0 ? result.rows[0].customer_id : null;
    
    try {

        // Fetch the active cart for the given customer with time conversion
        const cartResult = await pool.query(
            `SELECT 
                cart_id, 
                customer_id, 
                to_char(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila', 'MM-DD-YYYY, HH:MI:SS AM') AS created_at,
                to_char(last_activity AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila', 'MM-DD-YYYY, HH:MI:SS AM') AS last_activity,
                status 
            FROM 
                cart 
            WHERE 
                customer_id = $1 
                AND status = 'active'`,
            [customer_id]
        );


        // Check if the cart exists
        if (cartResult.rowCount === 0) {
            return res.status(404).json({ error: 'No active cart found for this customer' });
        }

        const cart = cartResult.rows[0];

        // Fetch the items in the cart
        const cartItemsResult = await pool.query(
            `SELECT 
                ci.cart_item_id, 
                ci.variation_id, 
                ci.quantity, 
                p.name AS name,
                pv.value AS value,
                pv.image,
                pv.unit_price, 
                (ci.quantity * pv.unit_price) AS item_total
            FROM cart_items ci
            JOIN product_variation pv ON ci.variation_id = pv.variation_id
            JOIN product p ON p.product_id = pv.product_id
            WHERE ci.cart_id = $1`,
            [cart.cart_id]
        );
        // make sure unit price and item total are numbers
        cartItemsResult.rows.forEach((item) => {
            item.unit_price = Number(item.unit_price);
            item.item_total = Number(item.item_total);
        });

        const cartItems = cartItemsResult.rows;

        // Calculate the subtotal of the cart
        const cartTotalResult = await pool.query(
            `SELECT SUM(ci.quantity * pv.unit_price) AS subtotal
             FROM cart_items ci
             JOIN product_variation pv ON ci.variation_id = pv.variation_id
             WHERE ci.cart_id = $1`,
            [cart.cart_id]
        );

        const subtotal = cartTotalResult.rows[0].subtotal || 0; // Default to 0 if no subtotal

    // Respond with the cart details, items, and subtotal
    return res.status(200).json({
      cart: { ...cart, subtotal }, // Include subtotal in the cart object
      items: cartItems,
    });
  } catch (error) {
    console.error('Error getting cart by customer ID:', error);
    return res.status(500).json({ error: 'Failed to retrieve cart' });
  }
};

const getAllCarts = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                c.cart_id, 
                c.customer_id,
                to_char(c.created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila', 'MM-DD-YYYY, HH:MI:SS AM') AS created_at,
                to_char(c.last_activity AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila', 'MM-DD-YYYY, HH:MI:SS AM') AS last_activity,
                c.status,
                COALESCE(SUM(ci.quantity * pv.unit_price), 0) AS subtotal
            FROM 
                cart c
            LEFT JOIN 
                cart_items ci ON c.cart_id = ci.cart_id
            LEFT JOIN 
                product_variation pv ON ci.variation_id = pv.variation_id
            GROUP BY 
                c.cart_id;`
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'No carts found' });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error getting all carts:', error);
        res.status(500).json({ error: 'Failed to retrieve carts' });
    }
};

// Get a cart by its ID
const getCartById = async (req, res) => {
    const { cart_id } = req.params;

    try {
        // Get the cart by ID
        const cart = await pool.query(
              `SELECT 
                cart_id, 
                customer_id, 
                to_char(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila', 'MM-DD-YYYY, HH:MI:SS AM') AS created_at,
                to_char(last_activity AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila', 'MM-DD-YYYY, HH:MI:SS AM') AS last_activity,
                status 
            FROM 
                cart 
            WHERE 
                cart_id = $1 
                AND status = 'active'`,
            [cart_id]
        );

        if (cart.rowCount === 0) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Get the items in the cart by joining with product_variation and product tables
        const cartItems = await pool.query(
            `SELECT 
                ci.cart_item_id, 
                ci.variation_id, 
                ci.quantity, 
                p.name AS name,
                pv.value AS value,
                pv.image,
                pv.unit_price, 
                (ci.quantity * pv.unit_price) AS item_total
            FROM cart_items ci
            JOIN product_variation pv ON ci.variation_id = pv.variation_id
            JOIN product p ON p.product_id = pv.product_id
            WHERE ci.cart_id = $1`,
            [cart_id]
        );

        // Convert item prices and totals to numbers
        cartItems.rows.forEach((item) => {
            item.unit_price = Number(item.unit_price);
            item.item_total = Number(item.item_total);
        });

        res.status(200).json({ cart: cart.rows[0], items: cartItems.rows });
    } catch (error) {
        console.error('Error getting cart by ID:', error);
        res.status(500).json({ error: 'Failed to retrieve cart' });
    }
};

// Update an existing cart item from the cart
const updateCartItem = async (req, res) => {
  const { cart_id } = req.params;
  const { variation_id, quantity } = req.body;

  console.log("Updating cart item:", cart_id, variation_id, quantity);

  try {
    // Fetch current stock and cart quantity
    const stockResult = await pool.query(
      `SELECT stock_quantity FROM inventory WHERE variation_id = $1`,
      [variation_id]
    );

    const cartItemResult = await pool.query(
      `SELECT quantity FROM cart_items WHERE cart_id = $1 AND variation_id = $2`,
      [cart_id, variation_id]
    );

    if (stockResult.rowCount === 0) {
      return res.status(404).json({ error: "Variation not found in inventory." });
    }

    if (cartItemResult.rowCount === 0) {
      return res.status(404).json({ error: "Cart item not found." });
    }

    const availableStock = stockResult.rows[0].stock_quantity;
    const currentCartQuantity = cartItemResult.rows[0].quantity;

    // Validate stock only when increasing quantity
    if (quantity > currentCartQuantity && quantity > availableStock) {
      return res.status(400).json({ error: "Insufficient stock quantity." });
    }

    // Update the cart item
    const updatedItem = await pool.query(
      `UPDATE cart_items 
       SET quantity = $1 
       WHERE cart_id = $2 AND variation_id = $3 
       RETURNING *`,
      [quantity, cart_id, variation_id]
    );

    if (updatedItem.rowCount === 0) {
      return res.status(404).json({ error: "Cart item not found." });
    }

    await pool.query(
      `UPDATE cart SET last_activity = NOW() WHERE cart_id = $1`,
      [cart_id]
    );

    console.log("Updated item:", updatedItem.rows[0]);
    res.status(200).json(updatedItem.rows[0]);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ error: "Failed to update cart item." });
  }
};


// Delete a cart item from order by its ID
const deleteCartItem = async (req, res) => {
    const { cart_id, variation_id } = req.params;
    console.log('Deleting cart item:', cart_id, variation_id);
    try {
        const deletedItem = await pool.query(
            `DELETE FROM cart_items
                WHERE cart_id = $1 AND variation_id = $2
                RETURNING *`,
            [cart_id, variation_id]
        );

        if (deletedItem.rowCount === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        await pool.query(
            `UPDATE cart SET last_activity = NOW() WHERE cart_id = $1`,
            [cart_id]
        );

        console.log('Deleted item:', deletedItem.rows[0]);
        res.status(200).json({ message: 'Cart item deleted successfully' });
    } catch (error) {
        console.error('Error deleting cart item:', error.message);
        res.status(500).json({ error: 'Failed to delete cart item' });
    }
};
  
const deleteCart = async (req, res) => {
    const { cart_id } = req.params;

    try {
        await pool.query('BEGIN');

        await pool.query(
            `DELETE FROM cart_items WHERE cart_id = $1`,
            [cart_id]
        );

        const deletedCart = await pool.query(
            `DELETE FROM cart WHERE cart_id = $1 RETURNING *`,
            [cart_id]
        );

        await pool.query('COMMIT');

        // Check if the cart was found and deleted
        if (deletedCart.rowCount === 0) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        res.status(200).json({ message: 'Cart and its items deleted successfully' });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error deleting cart:', error);
        res.status(500).json({ error: 'Failed to delete cart' });
    }
};

const mergeCarts = async (req, res) => {
    const { guest_cart_id, profile_id } = req.body;

    console.log('Merging carts:', req.body);

    // Start a transaction
    const client = await pool.connect();
    try {
        // Fetch the customer ID based on profile ID
        const result = await client.query(
            `SELECT customer_id FROM customer WHERE profile_id = $1`,
            [profile_id]
        );
        const customer_id = result.rows.length > 0 ? result.rows[0].customer_id : null;

        console.log('customer_id:', customer_id);

        // Validate that both IDs are provided
        if (!guest_cart_id || !customer_id) {
            return res.status(400).json({ error: 'Guest cart ID or customer ID is missing' });
        }

        await client.query('BEGIN'); // Start the transaction

        // Fetch the guest cart
        const guestCart = await client.query(
            `SELECT * FROM cart WHERE cart_id = $1 AND (customer_id IS NULL OR customer_id = $2)`,
            [guest_cart_id, customer_id]
        );

        if (guestCart.rowCount === 0) {
            await client.query('ROLLBACK'); // Rollback the transaction
            return res.status(404).json({ error: 'Guest cart not found or not associated with the customer' });
        }

        // Fetch the customer's active cart or create a new one
        let customerCart = await client.query(
            `SELECT * FROM cart WHERE customer_id = $1 AND status = 'active'`,
            [customer_id]
        );

        if (customerCart.rowCount === 0) {
            // Create a new cart directly within the transaction if no active cart exists
            const newCartResult = await client.query(
                `INSERT INTO cart (customer_id, created_at, last_activity, status)
                 VALUES ($1, NOW(), NOW(), 'active') RETURNING *`,
                [customer_id]
            );
            customerCart = newCartResult; // Reassign customerCart to the newly created cart
            console.log('Created new customer cart:', customerCart.rows[0]);
        }

        const loggedInCartId = customerCart.rows[0].cart_id;
        console.log('loggedInCartId:', loggedInCartId);
        
        // Merge guest cart items into the customer's (logged-in) cart
        await client.query(
            `INSERT INTO cart_items (cart_id, variation_id, quantity)
             SELECT $1, variation_id, quantity
             FROM cart_items
             WHERE cart_id = $2
             ON CONFLICT (cart_id, variation_id) 
             DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
            [loggedInCartId, guest_cart_id]
        );

        // Delete the guest cart and its items after merging
        await client.query(`DELETE FROM cart_items WHERE cart_id = $1`, [guest_cart_id]);
        await client.query(`DELETE FROM cart WHERE cart_id = $1`, [guest_cart_id]);

        // Fetch the updated cart items from the customer's cart
        const updatedCartItems = await client.query(
            `SELECT ci.cart_item_id, ci.variation_id, ci.quantity, pv.unit_price, 
                    p.name, pv.value, (ci.quantity * pv.unit_price) AS item_total
             FROM cart_items ci
             JOIN product_variation pv ON ci.variation_id = pv.variation_id
             JOIN product p ON pv.product_id = p.product_id
             WHERE ci.cart_id = $1`,
            [loggedInCartId]
        );

        // Commit the transaction
        await client.query('COMMIT');

        console.log('Carts merged successfully. Updated Cart:', updatedCartItems.rows);
        res.status(200).json({ 
            message: 'Carts merged successfully', 
            mergedCart: updatedCartItems.rows 
        });
    } catch (error) {
        // Rollback transaction if an error occurs
        await client.query('ROLLBACK');
        console.error('Error merging carts:', error);
        res.status(500).json({ error: 'Failed to merge carts' });
    } finally {
        // Release the client back to the pool
        client.release();
    }
};




module.exports = {
    createCart,
    addCartItem,
    mergeCarts,
    getAllCarts,
    getCartById,
    getCartByCustomerId,
    updateCartItem,
    deleteCartItem,
    deleteCart,
};
