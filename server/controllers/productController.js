const pool = require('../db.js');

const createProduct = async (req, res) => {
    const client = await pool.connect();
    const { name, description, product_category_id, product_status_id } = req.body;

    console.log('Request Body:', req.body);
    if (!name || !description || !product_category_id || !product_status_id) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        await client.query('BEGIN');

        const results = await client.query(
            `INSERT INTO product (name, description, product_category_id, product_status_id)
            VALUES ($1, $2, $3, $4)
            RETURNING product_id`,
            [name, description, product_category_id, product_status_id]
        );
        await client.query('COMMIT'); 

        res.status(201).json({ message: 'Product added', product_id: results.rows[0].product_id });
    } catch (error) {
        await client.query('ROLLBACK'); 
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product', error: error.message });
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
    const { name, description, product_status_id, product_category_id } = req.body;

    try {
        const query = `
            UPDATE product
            SET
                name = COALESCE($1, name),
                description = COALESCE($2, description),
                product_status_id = COALESCE($3, product_status_id),
                product_category_id = COALESCE($4, product_category_id)
            WHERE product_id = $5
            RETURNING *;
        `;

        const values = [
            name || null,
            description || null,
            product_status_id || null,
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
            SET product_status_id = 4
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


// PRODUCT STATUS CRUD
const getAllProductStatus = async (req, res) => {
    const client = await pool.connect();

    try {
        const results = await client.query('SELECT * FROM product_status');
        res.status(200).json(results.rows);
    } catch (error) {
        console.error('Error fetching product statuses:', error);
        res.status(500).json({ message: 'Error fetching product statuses', error: error.message });
    } finally {
        client.release();
    }
};

const getProductStatusById = async (req, res) => {
    const client = await pool.connect();
    const product_status_id = parseInt(req.params.id);

    try {
        const results = await client.query('SELECT * FROM product_status WHERE product_status_id = $1', [product_status_id]);
        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Product status not found' });
        }
        res.status(200).json(results.rows[0]);
    } catch (error) {
        console.error('Error fetching product status:', error);
        res.status(500).json({ message: 'Error fetching product status', error: error.message });
    } finally {
        client.release();
    }
};

const updateProductStatus = async (req, res) => {
    const client = await pool.connect();
    const product_status_id = parseInt(req.params.id);
    const { status } = req.body;

    try {
        const results = await client.query(
            `UPDATE product_status
            SET status = $1 WHERE product_status_id = $2
            RETURNING *`,
            [status, product_status_id]
        );

        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Product status not found' });
        }

        res.status(200).json(results.rows[0]);
    } catch (error) {
        console.error('Error updating product status:', error);
        res.status(500).json({ message: 'Error updating product status', error: error.message });
    } finally {
        client.release();
    }
};

const deleteAllProductStatus = async (req, res) => { 
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        await client.query('DELETE FROM product_status');
        await client.query('ALTER SEQUENCE product_status_product_status_id_seq RESTART WITH 1');
        await client.query('COMMIT');
        res.status(200).json({ message: 'All product statuses deleted and sequence reset' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error deleting all product statuses:', error);
        res.status(500).json({ message: 'Error deleting all product statuses', error: error.message });
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

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    archiveProduct,
    deleteProduct,
    getAllProductStatus,
    getProductStatusById,
    updateProductStatus,
    deleteAllProductStatus,
    createProductCategory,
    getAllProductCategories,
    getProductCategoryById,
    updateProductCategory,
    deleteProductCategory
};