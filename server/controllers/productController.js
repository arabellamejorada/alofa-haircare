const pool = require('../db.js');

// PRODUCTS CRUD + INVENTORY CREATE
const createProductWithInventory = async (req, res) => {
    const client = await pool.connect();
    const { name, description, status, unit_price, product_category_id } = req.body;
    const image = req.file ? req.file.filename : '';
    const stock_quantity = 0; // Default stock quantity
    
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    try {
        await client.query('BEGIN');

        // Insert product
        const productResult = await client.query(
            `INSERT INTO product (name, description, status, unit_price, image, product_category_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING product_id`,
            [name, description, status, unit_price, image, product_category_id]
        );
        const product_id = productResult.rows[0].product_id;

        // Insert inventory
        const inventoryResult = await client.query(
            `INSERT INTO inventory (stock_quantity, product_id)
            VALUES ($1, $2)
            RETURNING inventory_id, stock_in_date`,
            [stock_quantity, product_id]
        );
        const inventory_id = inventoryResult.rows[0].inventory_id;

            // Update product with inventory_id
        await client.query(
            `UPDATE product 
            SET inventory_id = $1 
            WHERE product_id = $2`,
            [inventory_id, product_id]
        );

        await client.query('COMMIT');

        res.status(201).json({ message: 'Product and inventory created successfully', product_id, inventory_id });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Transaction error:', error);
        res.status(500).json({ message: 'Error creating product and inventory', error: error.message });
    } finally {
        client.release();
    }
};

const getAllProducts = async (req, res) => {
    const client = await pool.connect();
    try {
        const results = await client.query('SELECT * FROM product ORDER BY product_id ASC');
        res.status(200).json(results.rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    } finally {
        client.release();
    }
};

const getProductById = async (req, res) => {
    const client = await pool.connect();
    const product_id = parseInt(req.params.id);

    try {
        const results = await client.query('SELECT * FROM product WHERE product_id = $1', [product_id]);
        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(results.rows[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    } finally {
        client.release();
    }
};

const updateProduct = async (req, res) => {
    const client = await pool.connect();
    const product_id = parseInt(req.params.id);
    const { name, description, unit_price, status, product_category_id } = req.body;
    const image = req.file ? req.file.path : null; 

    console.log ('Request Body:', req.body);
    console.log ('Uploaded Image:', image);
    
    try {
        const query = `
            UPDATE product
            SET
                name = COALESCE($1, name),
                description = COALESCE($2, description),
                unit_price = COALESCE($3, unit_price),
                image = COALESCE($4, image),
                status = COALESCE($5, status),
                product_category_id = COALESCE($6, product_category_id)
            WHERE product_id = $7
            RETURNING *;
        `;

        const values = [
            name || null,
            description || null,
            unit_price || null,
            image || null,
            status || null,
            product_category_id || null,
            product_id
        ];

        console.log('Query Values:', values);

        const results = await client.query(query, values);

        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(results.rows[0]);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ messag3e: 'Error updating product', error: error.message });
    } finally {
        client.release();
    }
};

const archiveProduct = async (req, res) => {
    const client = await pool.connect();
    const product_id = parseInt(req.params.id);

    try {
        const results = await client.query(
            `UPDATE product
            SET status = 'Archived'
            WHERE product_id = $1
            RETURNING *`,
            [product_id]
        );

        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(results.rows[0]);
    } catch (error) {
        console.error('Error archiving product:', error);
        res.status(500).json({ message: 'Error archiving product', error: error.message });
    } finally {
        client.release();
    }
};

const deleteProduct = async (req, res) => {
    const client = await pool.connect();
    const product_id = parseInt(req.params.id);

    try {
        const results = await client.query(
            `DELETE FROM product 
            WHERE product_id = $1 
            RETURNING product_id`, [product_id]);

        if (results.rowCount === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).send(`Product deleted with ID: ${product_id}`);
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    } finally {
        client.release();
    }
};

// PRODUCT CATEGORIES CRUD
const createProductCategory = async (req, res) => {
    const client = await pool.connect();
    const { name } = req.body;

    try {
        const results = await client.query(
            `INSERT INTO product_category (name) 
            VALUES ($1) 
            RETURNING product_category_id`,
            [name]
        );
        res.status(201).json({ message: 'Product category added', product_category_id: results.rows[0].product_category_id });
    } catch (error) {
        console.error('Error creating product category:', error);
        res.status(500).json({ message: 'Error creating product category', error: error.message });
    } finally {
        client.release();
    }
};

const getAllProductCategories = async (req, res) => {
    const client = await pool.connect();

    try {
        const results = await client.query('SELECT * FROM product_category');
        res.status(200).json(results.rows);
    } catch (error) {
        console.error('Error fetching product categories:', error);
        res.status(500).json({ message: 'Error fetching product categories', error: error.message });
    } finally {
        client.release();
    }
};

const getProductCategoryById = async (req, res) => {
    const client = await pool.connect();
    const product_category_id = parseInt(req.params.id);

    try {
        const results = await client.query('SELECT * FROM product_category WHERE product_category_id = $1', [product_category_id]);
        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Product category not found' });
        }
        res.status(200).json(results.rows[0]);
    } catch (error) {
        console.error('Error fetching product category:', error);
        res.status(500).json({ message: 'Error fetching product category', error: error.message });
    } finally {
        client.release();
    }
};

const updateProductCategory = async (req, res) => {
    const client = await pool.connect();
    const product_category_id = parseInt(req.params.id);
    const { name } = req.body;

    try {
        const results = await client.query(
            `UPDATE product_category
            SET name = $1 WHERE product_category_id = $2 
            RETURNING *`,
            [name, product_category_id]
        );

        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Product category not found' });
        }

        res.status(200).json(results.rows[0]);
    } catch (error) {
        console.error('Error updating product category:', error);
        res.status(500).json({ message: 'Error updating product category', error: error.message });
    } finally {
        client.release();
    }
};

const deleteProductCategory = async (req, res) => {
    const client = await pool.connect();
    const product_category_id = parseInt(req.params.id);

    try {
        const results = await client.query(
            `DELETE FROM product_category 
            WHERE product_category_id = $1 
            RETURNING product_category_id`, 
            [product_category_id]);    

        if (results.rowCount === 0) {
            return res.status(404).json({ message: 'Product category not found' });
        }
        res.status(200).send(`Product category deleted with ID: ${product_category_id}`);
    }
    catch (error) {
        console.error('Error deleting product category:', error);
        res.status(500).json({ message: 'Error deleting product category', error: error.message });
    } finally {
        client.release();
    }
};

// INVENTORY RUD
const getAllInventories = async (req, res) => {
    const client = await pool.connect();

    try {
        const results = await client.query('SELECT * FROM inventory ORDER BY inventory_id ASC');
        res.status(200).json(results.rows);
    } catch (error) {
        console.error('Error getting all inventory:', error);
        res.status(500).json({ message: 'Error getting all inventory ', error: error.message});
    } finally {
        client.release();
    }
};

const getInventoryById = async (req, res) => {
    const client = await pool.connect();
    const inventory_id = parseInt(req.params.id);

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

const updateInventory = async (req, res) => {
    const client = await pool.connect();
    const { product_id, stock_quantity } = req.body;

    try {
        // Validate stock_quantity and convert to integer
        const quantity = parseInt(stock_quantity, 10);
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid stock quantity' });
        }

        // Fetch the current stock quantity
        const inventoryResults = await client.query(
            `SELECT stock_quantity 
             FROM inventory 
             WHERE product_id = $1`,
            [product_id]
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
             WHERE product_id = $2
             RETURNING *`,
            [currentStockQuantity + quantity, product_id]
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


const deleteInventory = async (req, res) => {
    const client = await pool.connect();
    const inventory_id = parseInt(req.params.id);

    try {
        const results = await client.query(
            `DELETE FROM inventory 
            WHERE inventory_id = $1 
            RETURNING inventory_id`, 
            [inventory_id]);    

        if (results.rowCount === 0) {
            return res.status(404).json({ message: 'Inventory not found' });
        }
        res.status(200).send(`Inventory  deleted with ID: ${inventory_id}`);
    }
    catch (error) {
        console.error('Error deleting inventory:', error);
        res.status(500).json({ message: 'Error deleting inventory', error: error.message });
    } finally {
        client.release();
    }
};

module.exports = {
    createProductWithInventory,
    getAllProducts,
    getProductById,
    updateProduct,
    archiveProduct,
    deleteProduct,
    createProductCategory,
    getAllProductCategories,
    getProductCategoryById,
    updateProductCategory,
    deleteProductCategory,
    getAllInventories,
    getInventoryById,
    updateInventory,
    deleteInventory
};