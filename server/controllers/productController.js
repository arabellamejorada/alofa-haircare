const pool = require('../db.js');
const createProductWithVariationAndInventory = async (req, res) => {
  const client = await pool.connect();
  const { name, description, product_category_id, product_status_id, product_id } = req.body;
  
  // Handle variations parsing
  let { variations } = req.body;

  if (typeof variations === 'string') {
    try {
      variations = JSON.parse(variations); // Parse if it's a string
    } catch (error) {
      return res.status(400).json({ message: 'Invalid format for variations' });
    }
  }

  if (!Array.isArray(variations)) {
    return res.status(400).json({ message: 'Variations must be an array' });
  }

  const uploadedFiles = req.files;  // Array of uploaded images

  console.log('Uploaded Files:', uploadedFiles);
  console.log('Request Body:', req.body);
  if (!product_id) {
    if (!name || !description || !product_category_id || !product_status_id || !variations) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  }

  try {
    await client.query('BEGIN');
    console.log('Transaction started');
    // Insert or find product
    let productId;
    let productResult;
    if (product_id) {
      productId = product_id;
    } else {
      productResult = await client.query(
        `INSERT INTO product (name, description, product_category_id, product_status_id)
        VALUES ($1, $2, $3, $4)
        RETURNING product_id`,
        [name, description, product_category_id, product_status_id]
      );

      if (productResult.rows.length === 0) {
        throw new Error('Product insertion failed');
      }

      productId = productResult.rows[0].product_id;
      console.log('Product Insert Result:', productResult);
    }

    console.log('Product ID:', productId);

    const insertedVariations = [];
    const insertedInventories = [];

    // Get ID for "available" product status
    const productStatusResult = await client.query(`
        SELECT status_id 
        FROM product_status 
        WHERE LOWER(description) = 'available'
    `);
    const availableStatusId = productStatusResult.rows[0]?.status_id;

    if (!availableStatusId) {
      throw new Error('Status "available" not found in the product_status table');
    }

    const productQueryResult = await client.query(`SELECT name FROM product WHERE product_id = $1`, [productId]);
    if (productQueryResult.rows.length === 0) {
      throw new Error('Product retrieval failed');
    }
    const product_name = productQueryResult.rows[0].name || 'default-product';

    // Insert product variations and inventory
    for (let i = 0; i < variations.length; i++) {
      const variation = variations[i];
      const { type, value, unit_price } = variation;
      let { sku, product_status_id } = variation;
      const image = uploadedFiles && uploadedFiles[i] ? uploadedFiles[i].path : null;  // Assign corresponding image

      // If no SKU provided, generate one based on product name, type, value, and product ID
      if (!sku) {
        sku = generateSKU(product_name, type, value, productId);
      }

      // Default product status to "available" 
      product_status_id = availableStatusId;

      // Create SAVEPOINT before each variation insertion
      await client.query('SAVEPOINT before_variation_insert');

      try {
        // Insert into product_variation
        const productVariationResult = await client.query(
          `INSERT INTO product_variation (product_id, type, value, sku, unit_price, product_status_id, image)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING variation_id`,
          [productId, type, value, sku, unit_price || 0, product_status_id, image]
        );

        if (productVariationResult.rows.length === 0) {
          throw new Error(`Product variation insertion failed for variation ${i + 1}`);
        }

        const variation_id = productVariationResult.rows[0].variation_id;
        const last_updated_date = new Date();
        const stock_quantity = 0;

        // Insert into inventory
        const inventoryResult = await client.query(
          `INSERT INTO inventory (variation_id, stock_quantity, last_updated_date)
           VALUES ($1, $2, $3)
           RETURNING inventory_id`,
          [variation_id, stock_quantity, last_updated_date]
        );

        if (inventoryResult.rows.length === 0) {
          throw new Error(`Inventory insertion failed for variation ${i + 1}`);
        }

        const inventory_id = inventoryResult.rows[0].inventory_id;

        insertedVariations.push({ variation_id, productId, type, value, sku, unit_price, product_status_id, image });
        insertedInventories.push({ inventory_id, variation_id, stock_quantity, last_updated_date });

      } catch (innerError) {
        console.error(`Error inserting variation ${i + 1}:`, innerError);
        // Rollback to the savepoint if the variation insert fails
        await client.query('ROLLBACK TO SAVEPOINT before_variation_insert');
        continue; // Continue to the next variation
      }
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Product and variations created successfully!',
      product_id: productId,
      product_variations: insertedVariations,
      inventories: insertedInventories
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Transaction error:', error);
    res.status(500).json({ message: 'Error creating product and variations', error: error.message });
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


// const createProduct = async (req, res) => {
//     const client = await pool.connect();
//     const { name, description, product_category_id, product_status_id } = req.body;

//     console.log('Request Body:', req.body);
//     if (!name || !description || !product_category_id || !product_status_id) {
//         return res.status(400).json({ message: 'Missing required fields' });
//     }

//     try {
//         await client.query('BEGIN');

//         const results = await client.query(
//             `INSERT INTO product (name, description, product_category_id, product_status_id)
//             VALUES ($1, $2, $3, $4)
//             RETURNING product_id`,
//             [name, description, product_category_id, product_status_id]
//         );
//         await client.query('COMMIT'); 

//         res.status(201).json({ message: 'Product added', product_id: results.rows[0].product_id });
//     } catch (error) {
//         await client.query('ROLLBACK'); 
//         console.error('Error creating product:', error);
//         res.status(500).json({ message: 'Error creating product', error: error.message });
//     } finally {
//         client.release();
//     }
// };

// Get all products with their respective product category and status names
const getAllProducts = async (req, res) => {
    const client = await pool.connect();

    try {
        const results = await client.query(
            `SELECT 
                p.product_id, 
                p.name, 
                p.description, 
                c.product_category_id, 
                c.name AS product_category, 
                s.status_id, 
                s.description AS product_status 
            FROM product p
            JOIN product_category c ON p.product_category_id = c.product_category_id
            JOIN product_status s ON p.product_status_id = s.status_id`
        );
        res.status(200).json(results.rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    } finally {
        client.release();
    }
};

// Get product with its respective product category and status name
const getProductById = async (req, res) => {
    const client = await pool.connect();
    const product_id = parseInt(req.params.id);

    try {
        const results = await client.query(
            `SELECT
                p.product_id,
                p.name,
                p.description,
                c.product_category_id,
                c.name AS product_category,
                s.status_id,
                s.description AS product_status
            FROM product p
            JOIN product_category c ON p.product_category_id = c.product_category_id
            JOIN product_status s ON p.product_status_id = s.status_id
            WHERE p.product_id = $1`,
            [product_id]
        );

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

// Archive product by setting product_status_id to mapped value of 'Archived' in product_status table
const archiveProduct = async (req, res) => {
    const client = await pool.connect();
    const product_id = parseInt(req.params.id);

    try {
        await client.query('BEGIN'); // Start transaction

        // Fetch product status id for 'Archived' status
        const statusResults = await client.query(
            'SELECT status_id FROM product_status WHERE description = $1',
            ['Archived'] // Assuming 'description' is the column name
        );
        
        if (statusResults.rows.length === 0) {
            await client.query('ROLLBACK'); // Rollback in case of failure
            return res.status(404).json({ message: 'Archived status not found' });
        }

        const archivedStatusId = statusResults.rows[0].status_id;

        // Update product status to 'Archived'
        const results = await client.query(
            `UPDATE product
            SET product_status_id = $1
            WHERE product_id = $2
            RETURNING *`,
            [archivedStatusId, product_id]
        );

        if (results.rows.length === 0) {
            await client.query('ROLLBACK'); // Rollback in case of failure
            return res.status(404).json({ message: 'Product not found' });
        }

        await client.query('COMMIT'); // Commit transaction
        res.status(200).json(results.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback in case of error
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
const createProductStatus = async (req, res) => {
    const client = await pool.connect();
    const { status } = req.body;

    try {
        const results = await client.query(
            `INSERT INTO product_status (status)
            VALUES ($1)
            RETURNING product_status_id`,
            [status]
        );
        res.status(201).json({ message: 'Product status added', product_status_id: results.rows[0].product_status_id });
    } catch (error) {
        console.error('Error creating product status:', error);
        res.status(500).json({ message: 'Error creating product status', error: error.message });
    } finally {
        client.release();
    }
};

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
    const product_category_id = parseInt(req.params.id);
  const client = await pool.connect();

  console.log("id", product_category_id); 

  try {
    // First, check if the category has any associated product variations
    const checkVariationsQuery = `
      SELECT COUNT(*) AS variation_count 
      FROM product
      WHERE product_category_id = $1;
    `;
    const checkVariationsResult = await client.query(checkVariationsQuery, [product_category_id]);

    const variationCount = parseInt(checkVariationsResult.rows[0].variation_count, 10);

    if (variationCount > 0) {
      // If there are associated product variations, return an error
      return res.status(400).json({ message: "Cannot delete category with associated product variations." });
    }

    // If no associated product variations, proceed with deletion
    const deleteCategoryQuery = `
      DELETE FROM product_category 
      WHERE product_category_id = $1 
      RETURNING *;
    `;
    const deleteResult = await client.query(deleteCategoryQuery, [product_category_id]);

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ message: "Category not found." });
    }

    return res.status(200).json({ message: "Category deleted successfully." });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Error deleting category." });
  } finally {
    client.release();
  }
};



module.exports = {
    createProductWithVariationAndInventory,
    generateSKU,
    // createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    archiveProduct,
    deleteProduct,
    createProductStatus,
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