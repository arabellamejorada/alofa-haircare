const pool = require('../db.js');

// Create product variations + inventory
const createProductVariationsWithInventory = async (req, res) => {
    const client = await pool.connect();
    const { product_id, variations } = req.body;
    console.log(req.body);
    // Validate that product_id and variations are present
    if (!product_id || !variations || !Array.isArray(variations)) {
        return res.status(400).json({ message: 'Product ID and an array of variations are required.' });
    }
    
    try {
        await client.query('BEGIN');

        const insertedInventories = [];
        const insertedVariations = [];

        // Get product name for SKU generation
        const productResult = await client.query(
            `SELECT name FROM product WHERE product_id = $1`,
            [product_id]
        );
        const product_name = productResult.rows[0].name;
        console.log("Product Name:", product_name);

        // Insert each variation and inventory
        for (let variation of variations) {
            const { 
                name, 
                value, 
                unit_price, 
                product_status_id, 
                image
            } = variation;
    
            // Validate required fields for each variation
            if (!name || !value || !unit_price || !product_status_id) {
                throw new Error('All fields are required for each variation.');
            }
            
            // generate SKU based on product name, var type/value and product_id as counter
            const sku = generateSKU(product_name, name, value, product_id);

            const productVariationResult = await client.query(
                `INSERT INTO product_variation (product_id, name, value, sku, unit_price, product_status_id, image)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING variation_id`,
                [product_id, name, value, sku, unit_price, product_status_id, image]            
            )
            
            const variation_id = productVariationResult.rows[0].variation_id;
            const stock_in_date = new Date();
            const stock_quantity = 0;

            const inventoryResult = await client.query(
                `INSERT INTO inventory (variation_id, stock_quantity, stock_in_date)
                VALUES ($1, $2, $3)
                RETURNING inventory_id`,
                [variation_id, stock_quantity, stock_in_date]
            );

            const inventory_id = inventoryResult.rows[0].inventory_id;
            insertedVariations.push({ variation_id, product_id, name, value, sku, unit_price, product_status_id, image });
            insertedInventories.push({ inventory_id, variation_id, stock_quantity, stock_in_date });
        }
        await client.query('COMMIT');

        // Return the created product variations and inventory details
        res.status(201).json({
            message: 'Product variations and inventories created successfully!',
            product_variations: insertedVariations,
            inventories: insertedInventories
        });        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Transaction error:', error);
        res.status(500).json({ message: 'Error creating product variations and inventories', error: error.message });
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
            '60mL': '60ML',
            '100mL': '100ML',
            '150mL': '150ML'
        }
    };

    // Get product abbreviation, fallback to first three letters if product is new
    const productAbbreviation = abbreviationMap['Name'][product_name] || product_name.toUpperCase().slice(0, 3);

    // Handle different variant types (e.g., color or size)
    let variantAbbreviation = '0000';
    if (variation_type === 'Color') {
        variantAbbreviation = abbreviationMap['Color'][variation_value] || variation_value.toUpperCase().slice(0, 4); // 4 characters max
    } else if (variation_type === 'Size') {
        variantAbbreviation = abbreviationMap['Size'][variation_value] || variation_value.toUpperCase().slice(0, 4); // 4 characters max
    }

    // Format counter as 4 digits
    const formattedCounter = String(counter).padStart(4, '0');

    // Generate SKU in fixed length (12 characters total)
    let sku = `${productAbbreviation}-${variantAbbreviation}-${formattedCounter}`;

    // Ensure SKU is exactly 13 characters
    if (sku.length > 14) {
        sku = sku.slice(0, 13);  // Truncate if necessary
    }

    console.log("Generated SKU:", sku);
    return sku;
};

// Get all product variations
const getAllProductVariations = async (req, res) => {
    try {
        const productVariations = await pool.query(
            `SELECT * FROM product_variation`
        );
        res.status(200).json(productVariations.rows);
    } catch (error) {
        console.error('Error getting product variations:', error);
        res.status(500).json({ message: 'Error getting product variations', error: error.message });
    }
};

// Get product variation by ID
const getProductVariationById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const productVariation = await pool.query(
            `SELECT * FROM product_variation WHERE variation_id = $1`,
            [id]
        );
        res.status(200).json(productVariation.rows);
    } catch (error) {
        console.error('Error getting product variation by ID:', error);
        res.status(500).json({ message: 'Error getting product variation by ID', error: error.message });
    }
};

// Update product variation by ID
const updateProductVariation = async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, value, sku, unit_price, product_status_id, image } = req.body;
    try {
        const updatedProductVariation = await pool.query(
            `UPDATE product_variation
            SET name = $1, value = $2, sku = $3, unit_price = $4, product_status_id = $5, image = $6
            WHERE variation_id = $7
            RETURNING *`,
            [name, value, sku, unit_price, product_status_id, image, id]
        );
        res.status(200).json(updatedProductVariation.rows);
    } catch (error) {
        console.error('Error updating product variation:', error);
        res.status(500).json({ message: 'Error updating product variation', error: error.message });
    }
};

// Delete product variation by ID
const deleteProductVariation = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await pool.query(
            `DELETE FROM product_variation WHERE variation_id = $1`,
            [id]
        );
        res.status(200).json({ message: `Product variation ID ${id} deleted successfully!` });
    } catch (error) {
        console.error('Error deleting product variation:', error);
        res.status(500).json({ message: 'Error deleting product variation', error: error.message });
    }
};

// Delete all product variations and inventories and reset
const deleteAllProductVariations = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('DELETE FROM inventory');
        await client.query('DELETE FROM product_variation');
        await client.query('ALTER SEQUENCE product_variation_variation_id_seq RESTART WITH 1');
        await client.query('ALTER SEQUENCE inventory_inventory_id_seq RESTART WITH 1');
        await client.query('COMMIT');
        res.status(200).json({ message: 'All product variations and inventories deleted successfully!' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error deleting all product variations and inventories:', error);
        res.status(500).json({ message: 'Error deleting all product variations and inventories', error: error.message });
    } finally {
        client.release();
    }
};


module.exports = {
    createProductVariationsWithInventory,
    getAllProductVariations,
    getProductVariationById,
    updateProductVariation,
    deleteProductVariation,
    deleteAllProductVariations
};