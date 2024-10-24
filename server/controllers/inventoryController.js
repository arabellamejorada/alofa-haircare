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

// Get inventory history by variation ID
const getInventoryHistoryByVariationId = async (req, res) => {
    const client = await pool.connect();
    try {
        const id = parseInt(req.params.id, 10); // Ensure variation_id is an integer
        const query = `
            SELECT 
                si.reference_number AS reference_number,
                sii.variation_id AS variation_id,
                sii.quantity AS quantity,
                NULL AS reason,
                si.stock_in_date AS date
            FROM stock_in_items sii
            JOIN stock_in si ON sii.stock_in_id = si.stock_in_id
            WHERE sii.variation_id = $1

            UNION ALL

            SELECT 
                so.reference_number AS reference_number,
                soi.variation_id AS variation_id,
                (-1) * soi.quantity AS quantity, 
                soi.reason AS reason,
                so.stock_out_date AS date
            FROM stock_out_items soi
            JOIN stock_out so ON soi.stock_out_id = so.stock_out_id
            WHERE soi.variation_id = $1

            ORDER BY date;
        `;
        const result = await client.query(query, [id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching inventory history by id:', err.message);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
};

const getAllInventoryHistory = async (req, res) => {
  const client = await pool.connect();
  try {
   const query = `
    SELECT 
        si.reference_number AS reference_number,
        sii.variation_id AS variation_id,
        sii.quantity AS quantity,
        NULL AS reason,
        si.stock_in_date AS date,
        e.first_name || ' ' || e.last_name AS employee_name
    FROM stock_in_items sii
    JOIN stock_in si ON sii.stock_in_id = si.stock_in_id
    JOIN employee e ON si.employee_id = e.employee_id

    UNION ALL

    SELECT 
        so.reference_number AS reference_number,
        soi.variation_id AS variation_id,
        (-1) * soi.quantity AS quantity, 
        soi.reason AS reason,
        so.stock_out_date AS date,
        e.first_name || ' ' || e.last_name AS employee_name
    FROM stock_out_items soi
    JOIN stock_out so ON soi.stock_out_id = so.stock_out_id
    JOIN employee e ON so.employee_id = e.employee_id

    ORDER BY date DESC;
    `;


    const result = await client.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching all inventory history:", err.message);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};


module.exports = {
    getAllInventories,
    getInventoryById,
    updateInventoryById,
    getInventoryHistoryByVariationId,
    getAllInventoryHistory,
};