const pool = require('../db.js');

const createOrGetCart = async (req, res) => {
    const { customer_id } = req.body;
    const session_id = req.sessionID;
    const client = await pool.connect();

    // Validate if either session_id or customer_id is present
    if (!session_id && !customer_id) {
        return res.status(400).json({
            message: 'Session ID or Customer ID is required to create or retrieve a cart.',
        });
    }

    try {

        // Find cart by customer ID or session ID
        const cartQuery = await client.query(`
            SELECT * FROM cart
            WHERE (customer_id = $1 OR session_id = $2) AND status = 'active'`,
            [customer_id || null, session_id]
        );

        let cart;
        if (cartQuery.rows.length === 0) {
            // If no cart found, create a new cart
            const newCartQuery = await client.query(`
                INSERT INTO cart (customer_id, session_id)
                VALUES ($1, $2)
                RETURNING *`,
                [customer_id || null, session_id]
            );
            cart = newCartQuery.rows[0];
        } else {
            // Use the existing cart
            cart = cartQuery.rows[0];
        }

        res.status(200).json({ message: 'Cart retrieved/created successfully', cart });        
    } catch (error) {
        console.error('Error creating or getting cart: ', error);
        res.status(500).json({ message: "Error creating/retrieving cart", error: error.message });
    } finally {
       client.release();
    }
};


const addItemToCart = async (req, res) => {
    const { variation_id, quantity } = req.body;
    const session_id = req.sessionID;

    try {
        const client = await pool.connect();

        const cartResult = await client.query(`
            SELECT * FROM cart
            WHERE session_id = $1 AND status = 'active'`,
            [session_id]
        );

        if (cartResult.rows.length === 0) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }

        const cart_id = cartResult.rows[0].cart_id;

        // Check if item already exists in cart
        const existingItem = await client.query(`
            SELECT * FROM cart_items
            WHERE cart_id = $1 AND variation_id = $2`,
            [cart_id, variation_id]
        );

        if (existingItem.rows.length > 0) {
            const newQuantity = existingItem.rows[0].quantity + quantity;
            const updateItem = await client.query(`
                UPDATE cart_items
                SET quantity = $1
                WHERE cart_id = $2 AND variation_id = $3
                RETURNING *`,
                [newQuantity, cart_id, variation_id]
            );
            res.status(200).json({ message: "Item quantity updated", cartItem: updateItem.rows[0] });
            return;
        }

        const newItem = await client.query(`
            INSERT INTO cart_items (cart_id, variation_id, quantity)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [cart_id, variation_id, quantity]
        );

        res.status(201).json({ message: "Item added to cart", cartItem: newItem.rows[0] });

    } catch (error) {
        console.error('Error adding item to cart: ', error);
        res.status(500).json({ message: "Error adding item to cart", error: error.message });
    }
};

// get all cart table
const getAllCarts = async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM cart');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error getting cart: ', error);
        res.status(500).json({ message: "Error getting cart", error: error.message });
    }
};

const viewCartItemsById = async (req, res) => {
    const session_id = req.sessionID;

    try {
        const client = await pool.connect();

        const cartResult = await client.query(`
            SELECT * FROM cart
            WHERE session_id = $1 AND status = 'active'`,
            [session_id]
        );

        if (cartResult.rows.length === 0) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }

        const cart_id = cartResult.rows[0].cart_id;

        const cartItems = await client.query(`
         SELECT
            ci.cart_item_id, 
            ci.quantity, 
            pv.unit_price, 
            p.name || ' - ' || pv.value AS product_name,
            pv.image,
            SUM(ci.quantity * pv.unit_price) AS subtotal
        FROM 
            cart_items ci
        JOIN 
            product_variation pv ON ci.variation_id = pv.variation_id
        JOIN 
            product p ON pv.product_id = p.product_id
        WHERE 
            ci.cart_id = $1
        GROUP BY 
            ci.cart_item_id, ci.quantity, pv.unit_price, p.name, pv.value, pv.image;
        `, [cart_id]
        );

        res.status(200).json({ cartItems: cartItems.rows });

    } catch (error) {
        console.error('Error viewing cart: ', error);
        res.status(500).json({ message: "Error viewing cart", error: error.message });
    }
};

const checkoutCart = async (req, res) => {
    const session_id = req.sessionID;

    try {
        const client = await pool.connect();

        const cartResult = await client.query(`
            SELECT * FROM cart
            WHERE session_id = $1 AND status = 'active'`,
            [session_id]
        );

        if (cartResult.rows.length === 0) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }

        const cart_id = cartResult.rows[0].cart_id;

        const checkoutQuery = await client.query(`
            UPDATE cart
            SET status = 'checked_out'
            WHERE cart_id = $1
            RETURNING *`,
            [cart_id]
        );

        res.status(200).json({ message: "Cart checked out", cart: checkoutQuery.rows[0] });

    } catch (error) {
        console.error('Error checking out cart: ', error);
        res.status(500).json({ message: "Error checking out cart", error: error.message });
    }
};

module.exports = {
    createOrGetCart,
    addItemToCart,
    getAllCarts,
    viewCartItemsById,
    checkoutCart
};