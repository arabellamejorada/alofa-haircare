const pool = require('../db.js');

// Create product variations + inventory
const createProductVariationsWithInventory = async (req, res) => {
    const client = await pool.connect();
    const { product_id, variations } = req.body;
    const uploadedFiles = req.files;  // Array of uploaded images
  
    if (!product_id || !variations || !Array.isArray(variations)) {
      return res.status(400).json({ message: 'Product ID and an array of variations are required.' });
    }
  
    console.log("Request Body:", req.body);
    console.log("Received product name:", req.body.name);
    console.log("Uploaded Files:", uploadedFiles);

    try {
      await client.query('BEGIN');
  
      const insertedInventories = [];
      const insertedVariations = [];
  
      const productResult = await client.query(`SELECT name FROM product WHERE product_id = $1`, [product_id]);
      const product_name = productResult.rows[0].name || 'default-product';
        
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

      
      for (let i = 0; i < variations.length; i++) {
        const variation = variations[i];
        const { type, value, unit_price } = variation;
        let { sku, product_status_id } = variation;
        const image = uploadedFiles[i] ? uploadedFiles[i].path : null;  // Assign corresponding image
  
        // If no SKU provided, generate one based on product name, type, value, and product ID
        if (!sku) {
          sku = generateSKU(product_name, type, value, product_id);
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
            [product_id, type, value, sku, unit_price || 0, product_status_id, image]
          );
  
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
  
          const inventory_id = inventoryResult.rows[0].inventory_id;
  
          insertedVariations.push({ variation_id, product_id, type, value, sku, unit_price, product_status_id, image });
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

// Get all product variations join with product name and status description
const getAllProductVariations = async (req, res) => {
    try {
        const productVariations = await pool.query(
            `SELECT 
                product_variation.*,                     
                product.name AS product_name,            
                product_status.description AS status_description  
            FROM 
                product_variation
            JOIN 
                product ON product_variation.product_id = product.product_id
            JOIN 
                product_status ON product_variation.product_status_id = product_status.status_id
            ORDER BY 
                product_variation.variation_id ASC;`
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

// Update product variation by ID including image(if uploaded a new one)
const updateProductVariation = async (req, res) => {
  const id = parseInt(req.params.id);
  const { type, value, unit_price, product_status_id, sku } = req.body;
  let image = req.file ? req.file.path : null;

  console.log("Request Body:", req.body);
  console.log("Uploaded Image File:", req.file); // Check if multer processed the file
  console.log("Received product name:", req.body.name);
  console.log("Image Path from req.file:", image);

  if (!image && req.body.image) {
    image = req.body.image; // Use the existing image path if no new file was uploaded
  }
  // In your controller, before accessing req.file
console.log("Multer processed file:", req.file);


  try {
    // Fetch the existing variation to get the current image path
    const existingVariationResult = await pool.query(
      `SELECT pv.product_id, pv.image, p.name 
       FROM product_variation pv
       JOIN product p ON pv.product_id = p.product_id
       WHERE pv.variation_id = $1`,
      [id]
    );

    if (existingVariationResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product variation not found' });
    }

    const existingImage = existingVariationResult.rows[0].image;
    const product_id = existingVariationResult.rows[0].product_id;

    // If no new image is provided, keep the existing one
    if (!image) {
      image = existingImage;
    }

    console.log("Final image path to be saved:", image);

    // Update the product variation with the new data
    const updatedProductVariation = await pool.query(
      `UPDATE product_variation
        SET type = $1, value = $2, sku = $3, unit_price = $4, product_status_id = $5, image = $6
        WHERE variation_id = $7
        RETURNING *`,
      [type, value, sku, unit_price, product_status_id, image, id]
    );

    // Update inventory too
    const updatedInventory = await pool.query(
      `UPDATE inventory
        SET last_updated_date = NOW()
        WHERE variation_id = $1
        RETURNING *`,
      [id]
    );

    if (updatedProductVariation.rows.length === 0) {
      return res.status(404).json({ message: 'Product variation update failed' });
    }

     if (updatedInventory.rowCount === 0) {
        console.error('Inventory update failed for variation_id:', id);
      }

    res.status(200).json(updatedProductVariation.rows[0]);
  } catch (error) {
    console.error('Error updating product variation:', error);
    res.status(500).json({ message: 'Error updating product variation', error: error.message });
  }
};

// Archive product variation
const archiveProductVariation = async (req, res) => {
    const client = await pool.connect();
    const variation_id = parseInt(req.params.id);

    try {
        const results = await client.query(
            `UPDATE product_variation
            SET product_status_id = 4
            WHERE variation_id = $1
            RETURNING *`,
            [variation_id]
        );

        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Product Variation not found' });
        }

        res.status(200).json(results.rows[0]);
    } catch (error) {
        console.error('Error archiving product variation:', error);
        res.status(500).json({ message: 'Error archiving product variation:', error: error.message });
    } finally {
        client.release();
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
    archiveProductVariation,
    deleteAllProductVariations
};