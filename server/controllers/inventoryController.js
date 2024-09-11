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
        res.json(result.rows);
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
const updateInventoryQuantityById = async (req, res) => {
    const client = await pool.connect();
    try {
        const id = parseInt(req.params.id);
        const { quantity } = req.body;
        const result = await client.query(
            `UPDATE inventory
            SET quantity = $1
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
    updateInventoryQuantityById
};