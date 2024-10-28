const pool = require('../db.js');

const createCart = async (req, res) => {
    const { customer_id } = req.body;

    try {
        // Create a new cart in the database
        const result = await pool.query(
            `INSERT INTO cart (customer_id, created_at, last_activity, status)
             VALUES ($1, NOW(), NOW(), 'active') RETURNING *`,
            [customer_id]
        );

        // Extract the new cart object and send as response
        const newCart = result.rows[0];
        return res.status(201).json(newCart);
    } catch (error) {
        console.error('Error creating cart:', error.message);
        return res.status(500).json({ error: 'Failed to create cart' });
    }
};


const addCartItem = async (req, res) => {
    console.log("Request Add Item", req.params, req.body);
    const { variation_id, quantity } = req.body;
    let { cart_id } = req.params;

    try {
        // If cart_id is not provided, create a new cart (guest user)
        if (!cart_id) {
            const newCart = await createCart(customer_id);
            cart_id = newCart.cart_id;
        }

        // Check if the item already exists in the cart
        const existingItem = await pool.query(
            `SELECT * FROM cart_items WHERE cart_id = $1 AND variation_id = $2`,
            [cart_id, variation_id]
        );

        if (existingItem.rowCount > 0) {
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
    const { customer_id } = req.params;

    try {
        // Fetch the active cart for the given customer
        const cartResult = await pool.query(
            `SELECT * FROM cart WHERE customer_id = $1 AND status = 'active'`,
            [customer_id]
        );

        // Check if the cart exists
        if (cartResult.rowCount === 0) {
            return res.status(404).json({ error: 'No active cart found for this customer' });
        }

        const cart = cartResult.rows[0];

        // Fetch the items in the cart
        const cartItemsResult = await pool.query(
            `SELECT ci.cart_item_id, ci.variation_id, ci.quantity, pv.unit_price,
                    (ci.quantity * pv.unit_price) AS item_total
             FROM cart_items ci
             JOIN product_variation pv ON ci.variation_id = pv.variation_id
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

        // Respond with the cart details and items
        return res.status(200).json({
            cart,
            items: cartItems,
        });
    } catch (error) {
        console.error('Error getting cart by customer ID:', error);
        return res.status(500).json({ error: 'Failed to retrieve cart' });
    }
};


// Get all carts (for admin or debugging purposes)// Get all carts (for admin or debugging purposes)
const getAllCarts = async (req, res) => {
    try {
        // Get all carts
        const carts = await pool.query(`SELECT * FROM cart`);

        if (carts.rowCount === 0) {
            return res.status(404).json({ error: 'No carts found' });
        }

        // Calculate subtotal for each cart
        const cartWithSubtotals = await Promise.all(
            carts.rows.map(async (cart) => {
                const cartTotal = await pool.query(
                    `SELECT SUM(ci.quantity * pv.unit_price) AS subtotal
                     FROM cart_items ci
                     JOIN product_variation pv ON ci.variation_id = pv.variation_id
                     WHERE ci.cart_id = $1`,
                    [cart.cart_id]
                );

                // Add subtotal to cart object
                cart.subtotal = cartTotal.rows[0].subtotal || 0; // Set to 0 if subtotal is null
                return cart;
            })
        );

        res.status(200).json(cartWithSubtotals);
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
            `SELECT * FROM cart WHERE cart_id = $1`,
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

    console.log('Updating cart item:', cart_id, variation_id, quantity);
    try {
        const updatedItem = await pool.query(
            `UPDATE cart_items 
            SET quantity = $1 
            WHERE cart_id = $2 AND variation_id = $3 
            RETURNING *`,
            [quantity, cart_id, variation_id]
        );

        if (updatedItem.rowCount === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        await pool.query(
            `UPDATE cart SET last_activity = NOW() WHERE cart_id = $1`,
            [cart_id]
        );
        
        
        console.log('Updated item:', updatedItem.rows[0]);
        res.status(200).json(updatedItem.rows[0]);
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ error: 'Failed to update cart item' });
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

// Merge two carts into one (cart added when user is logged out and logged in)
const mergeCarts = async (req, res) => {
    const { guest_cart_id, customer_id } = req.body;

    try {
        console.log('Received guest_cart_id:', guest_cart_id, 'and customer_id:', customer_id);

        // Check if the guest cart exists and is not associated with another customer
        const guestCart = await pool.query(
            `SELECT * FROM cart WHERE cart_id = $1 AND (customer_id IS NULL OR customer_id = $2)`,
            [guest_cart_id, customer_id]
        );

        console.log('Guest cart:', guestCart.rows);
        if (guestCart.rowCount === 0) {
            return res.status(400).json({ error: 'Guest cart does not exist or is not associated with the specified customer' });
        }

        // Get the logged-in user's active cart
        let customerCart = await pool.query(
            `SELECT * FROM cart WHERE customer_id = $1 AND status = 'active'`,
            [customer_id]
        );

        // Create a new cart if none exists for the customer
        if (customerCart.rowCount === 0) {
            customerCart = await pool.query(
                `INSERT INTO cart (customer_id, created_at, last_activity, status) 
                 VALUES ($1, NOW(), NOW(), 'active') RETURNING *`,
                [customer_id]
            );
        }

        console.log('Customer cart:', customerCart.rows);

        const loggedInCartId = customerCart.rows[0].cart_id;

        // Merge guest cart items into the logged-in user's cart
        await pool.query(
            `INSERT INTO cart_items (cart_id, variation_id, quantity)
             SELECT $1, variation_id, quantity
             FROM cart_items
             WHERE cart_id = $2
             ON CONFLICT (cart_id, variation_id) 
             DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
            [loggedInCartId, guest_cart_id]
        );

        // Delete the guest cart and its items after merging
        await pool.query(`DELETE FROM cart_items WHERE cart_id = $1`, [guest_cart_id]);
        await pool.query(`DELETE FROM cart WHERE cart_id = $1`, [guest_cart_id]);

        res.status(200).json({ message: 'Carts merged successfully' });
    } catch (error) {
        console.error('Error merging carts:', error); // Log the specific error
        res.status(500).json({ error: 'Failed to merge carts' });
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
