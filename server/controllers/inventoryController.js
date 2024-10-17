const pool = require('../db.js');

// Get all inventories with product name and variation details
const getAllInventories = async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `SELECT 
                inventory.*, 
                product_variation.*, 
                product.name AS product_name, 
                product_status.description AS product_status,
                CONCAT(product_variation.type, ' - ', product_variation.value) AS variation
            FROM 
                inventory
            JOIN 
                product_variation ON inventory.variation_id = product_variation.variation_id
            JOIN 
                product ON product_variation.product_id = product.product_id
            JOIN 
                product_status ON product_variation.product_status_id = product_status.status_id;`
        );

        const formattedResult = result.rows.map(row => {
            if (row.last_updated_date) {
                // Convert timestamp to the desired format
                const date = new Date(row.last_updated_date);
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const year = date.getFullYear();
                let hours = date.getHours();
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const ampm = hours >= 12 ? 'PM' : 'AM';

                // Convert hours to 12-hour format
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                const formattedDate = `${month}-${day}-${year}, ${hours}:${minutes} ${ampm}`;

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