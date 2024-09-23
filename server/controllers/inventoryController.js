const pool = require('../db.js');

// Get all inventories with product name and variation details
const getAllInventories = async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `SELECT inventory.*, product_variation.*, product.name AS product_name
            FROM inventory
            JOIN product_variation ON inventory.variation_id = product_variation.variation_id
            JOIN product ON product_variation.product_id = product.product_id`
        );

        // Format the date (assuming `last_updated_date` is a timestamp in the `inventory` table)
        const formattedResult = result.rows.map(row => {
            if (row.last_updated_date) {
                // Convert timestamp to the desired format
                const date = new Date(row.last_updated_date);
                const options = {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                };

                const formattedDate = date.toLocaleString('en-US', options)
                    .replace('/', '-')
                    .replace('/', '-')
                    .replace(', ', ', ')
                    .toUpperCase();

                // Assign the formatted date back to the row
                row.last_updated_date = formattedDate;
            }
            return row;
        });

        res.json(formattedResult);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
};


// Get inventory by ID merge with product name and variation details
const getInventoryById = async (req, res) => {
    const client = await pool.connect();
    try {
        const id = parseInt(req.params.id);
        const result = await client.query(
            `SELECT inventory.*, product_variation.*, product.name AS product_name
            FROM inventory
            JOIN product_variation ON inventory.variation_id = product_variation.variation_id
            JOIN product ON product_variation.product_id = product.product_id
            WHERE inventory_id = $1`,
            [id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
};

// Update inventory quantity by ID
const updateInventoryById = async (req, res) => {
    const client = await pool.connect();
    try {
        const id = parseInt(req.params.id);
        const { quantity } = req.body;
        const result = await client.query(
            `UPDATE inventory
            SET quantity = $1, last_updated_date = NOW()
            WHERE inventory_id = $2
            RETURNING *`,
            [quantity, id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
};

module.exports = {
    getAllInventories,
    getInventoryById,
    updateInventoryById
};