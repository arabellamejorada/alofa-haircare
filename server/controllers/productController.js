const pool = require('../db.js');

// PRODUCTS CRUD + CREATE VARIATION + CREATE INVENTORY
const createProductWithVariationsInventory = async (req, res) => {
    const client = await pool.connect();
    const { name, description, product_category_id, product_status_id, variations } = req.body;

    try {
        await client.query('BEGIN');

        // Insert product (without image at the product level)
        const productResult = await client.query(
            `INSERT INTO product (name, description, product_category_id, product_status_id)
            VALUES ($1, $2, $3, $4)
            RETURNING product_id`,
            [name, description, product_category_id, product_status_id]
        );
        const product_id = productResult.rows[0].product_id;

        // Ensure variations is an array and not empty
        if (!Array.isArray(variations) || variations.length === 0) {
            throw new Error('Invalid variations data');
        }

        // Insert each variation
        for (let i = 0; i < variations.length; i++) {
            const variation = variations[i];

            // Validate variation fields
            if (!variation.name || !variation.value || !variation.unit_price || !variation.product_status_id) {
                throw new Error(`Invalid variation data: ${JSON.stringify(variation)}`);
            }

            // Get the corresponding uploaded file for the variation
            const variationImage = req.files && req.files[`variation_${i}_image`] ? req.files[`variation_${i}_image`].filename : '';

            // Generate SKU
            const sku = generateSKU(name, variation.name, variation.value, product_id);

            // Insert variation with the associated image
            const variationResult = await client.query(
                `INSERT INTO product_variation (product_id, name, value, unit_price, product_status_id, sku, image)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING variation_id`,
                [product_id, variation.name, variation.value, variation.unit_price, variation.product_status_id, sku, variationImage]
            );
            const variation_id = variationResult.rows[0].variation_id;

            // Insert inventory for the variation
            const stock_quantity = variation.stock_quantity || 0; // Default to 0 if not provided
            await client.query(
                `INSERT INTO inventory (variation_id, stock_quantity, stock_in_date)
                VALUES ($1, $2, $3)`,
                [variation_id, stock_quantity, new Date()]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Product, variations, and inventory created successfully', product_id });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Transaction error:', error);
        res.status(500).json({ message: 'Error creating product, variations, and inventory', error: error.message });
    } finally {
        client.release();
    }
};

// Generate SKU with abbreviation mappings
const generateSKU = (product_name, variation_type, variation_value, counter) => {
    const abbreviationMap = {
        'Name': {
            'Flower Hair Clip': 'FHC',
            'Mini Flower Hair Clip': 'MFH',
            'Orchid Hair Clamp': 'OHC',
            'Hair Oil': 'OIL',
            'Bamboo Brush': 'BRS',
            'Hair Mist': 'MST',
            'Scalp Massager': 'MSG',
            'Jade Comb': 'CMB'
        },
        'Color': {
            'Sunrise': 'SUNR',
            'Sunset': 'SUNS',
            'Seaside': 'SEAS',
            'Blossom': 'BLOS',
            'Meadow': 'MEAD',
            'Midnight': 'MIDN',
            'Clementine': 'CLEM',
            'Lilac': 'LILA',
            'Moss': 'MOSS',
            'Shoreline': 'SHOR'
        },
        'Size': {
            '30mL': '30ML',
            '50mL': '50ML',
            '60mL': '60ML'
        }
    };
    
    // Convert product name and variation type to abbreviation
    const productAbbreviation = abbreviationMap['Name'][product_name] || product_name.toUpperCase().slice(0, 3);
    const variationAbbreviation = abbreviationMap[variation_type]?.[variation_value] || variation_value.toUpperCase().slice(0, 3);
    
    // Ensure counter is 4 digits
    const formattedCounter = String(counter).padStart(4, '0');
    
    // Generate SKU in the format: PRODUCTABBREVIATION-VARIATIONABBREVIATION-COUNTER
    const sku = `${productAbbreviation}${variationAbbreviation}${formattedCounter}`;
    
    console.log("Generated SKU:", sku);
    return sku;
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
            WHERE product_id = $7
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

const deleteProductStatus = async (req, res) => {
    const client = await pool.connect();
    const product_status_id = parseInt(req.params.id);

    try {
        const results = await client.query(
            `DELETE FROM product_status
            WHERE product_status_id = $1
            RETURNING product_status_id`,
            [product_status_id]
        );

        if (results.rowCount === 0) {
            return res.status(404).json({ message: 'Product status not found' });
        }

        res.status(200).send(`Product status deleted with ID: ${product_status_id}`);
    } catch (error) {
        console.error('Error deleting product status:', error);
        res.status(500).json({ message: 'Error deleting product status', error: error.message });
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

// PRODUCT VARIATIONS RUD
const getAllProductVariations = async (req, res) => {
    const client = await pool.connect();

    try {
        const results = await client.query('SELECT * FROM product_variation');
        res.status(200).json(results.rows);
    } catch (error) {
        console.error('Error fetching product variations:', error);
        res.status(500).json({ message: 'Error fetching product variations', error: error.message });
    } finally {
        client.release();
    }
};

const getProductVariationById = async (req, res) => {
    const client = await pool.connect();
    const variation_id = parseInt(req.params.id);

    try {
        const results = await client.query('SELECT * FROM product_variation WHERE variation_id = $1', [variation_id]);
        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Product variation not found' });
        }
        res.status(200).json(results.rows[0]);
    } catch (error) {
        console.error('Error fetching product variation:', error);
        res.status(500).json({ message: 'Error fetching product variation', error: error.message });
    } finally {
        client.release();
    }
};

const updateProductVariation = async (req, res) => {
    const client = await pool.connect();
    const variation_id = parseInt(req.params.id);
    const { name, value, unit_price } = req.body;

    try {
        const results = await client.query(
            `UPDATE product_variation
            SET name = $1, value = $2, unit_price = $3
            WHERE variation_id = $4
            RETURNING *`,
            [name, value, unit_price, variation_id]
        );

        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Product variation not found' });
        }

        res.status(200).json(results.rows[0]);
    } catch (error) {
        console.error('Error updating product variation:', error);
        res.status(500).json({ message: 'Error updating product variation', error: error.message });
    } finally {
        client.release();
    }
};

const deleteProductVariation = async (req, res) => {
    const client = await pool.connect();
    const variation_id = parseInt(req.params.id);

    try {
        const results = await client.query(
            `DELETE FROM product_variation 
            WHERE variation_id = $1 
            RETURNING variation_id`,
            [variation_id]
        );

        if (results.rowCount === 0) {
            return res.status(404).json({ message: 'Product variation not found' });
        }

        res.status(200).send(`Product variation deleted with ID: ${variation_id}`);
    } catch (error) {
        console.error('Error deleting product variation:', error);
        res.status(500).json({ message: 'Error deleting product variation', error: error.message });
    } finally {
        client.release();
    }
};

module.exports = {
    createProductWithVariationsInventory,
    getAllProducts,
    getProductById,
    updateProduct,
    archiveProduct,
    deleteProduct,
    getAllProductStatus,
    getProductStatusById,
    updateProductStatus,
    deleteProductStatus,
    createProductCategory,
    getAllProductCategories,
    getProductCategoryById,
    updateProductCategory,
    deleteProductCategory,
    getAllProductVariations,
    getProductVariationById,
    updateProductVariation,
    deleteProductVariation
};