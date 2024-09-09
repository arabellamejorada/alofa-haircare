const pool = require('../db.js');

// INVENTORY RUD

// Read all inventories with product name and variation name
const getAllInventories = async (req, res) => {
    const client = await pool.connect();

    try {
        const query = `
            SELECT i.inventory_id, i.variation_id, i.stock_quantity, i.stock_in_date, 
                   p.name AS product_name, p.
                   v.name AS variation_name
            FROM inventory i
            JOIN product_variation v ON i.variation_id = v.variation_id
            JOIN product p ON v.product_id = p.product_id
            ORDER BY i.inventory_id
        `;

        const results = await client.query(query);
        res.status(200).json(results.rows);
    } catch (error) {
        console.error('Error fetching inventories:', error);
        res.status(500).json({ message: 'Error fetching inventories', error: error.message });
    } finally {
        client.release();
    }
};

// Read an inventory by ID
const getInventoryById = async (req, res) => {
    const client = await pool.connect();
    const inventory_id = parseInt(req.params.id, 10);

    try {
        const results = await client.query('SELECT * FROM inventory WHERE inventory_id = $1', [inventory_id]);

        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        res.status(200).json(results.rows[0]);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ message: 'Error fetching inventory', error: error.message });
    } finally {
        client.release();
    }
};

// Update inventory quantity
const updateInventory = async (req, res) => {
    const client = await pool.connect();
    const { variation_id, stock_quantity } = req.body;

    try {
        // Validate stock_quantity and convert to integer
        const quantity = parseInt(stock_quantity, 10);
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid stock quantity' });
        }

        // Fetch the current stock quantity
        const inventoryResults = await client.query(
            'SELECT stock_quantity FROM inventory WHERE variation_id = $1',
            [variation_id]
        );

        if (inventoryResults.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found in inventory' });
        }

        const currentStockQuantity = inventoryResults.rows[0].stock_quantity;

        // Update inventory with the new stock quantity
        const results = await client.query(
            `UPDATE inventory 
             SET stock_quantity = $1, 
                 stock_in_date = CURRENT_TIMESTAMP
             WHERE variation_id = $2
             RETURNING *`,
            [currentStockQuantity + quantity, variation_id]
        );

        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        res.status(200).json(results.rows[0]);
    } catch (error) {
        console.error('Error updating inventory:', error);
        res.status(500).json({ message: 'Error updating inventory', error: error.message });
    } finally {
        client.release();
    }
};

// Delete an inventory record
const deleteInventory = async (req, res) => {
    const client = await pool.connect();
    const inventory_id = parseInt(req.params.id, 10);

    try {
        const results = await client.query(
            `DELETE FROM inventory 
            WHERE inventory_id = $1 
            RETURNING inventory_id`, 
            [inventory_id]
        );

        if (results.rowCount === 0) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        res.status(200).send(`Inventory deleted with ID: ${inventory_id}`);
    } catch (error) {
        console.error('Error deleting inventory:', error);
        res.status(500).json({ message: 'Error deleting inventory', error: error.message });
    } finally {
        client.release();
    }
};

module.exports = {
    getAllInventories,
    getInventoryById,
    updateInventory,
    deleteInventory
};
