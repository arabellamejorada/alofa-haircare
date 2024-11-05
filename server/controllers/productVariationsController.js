const pool = require('../db.js');


// Get all product variations join with product name and status description
const getAllProductVariations = async (req, res) => {
    try {
        const productVariations = await pool.query(
            `SELECT 
                product_variation.*,    
                product.product_category_id, 
                product_category.name AS product_category, 
                product.name AS product_name, 
                product_status.description AS status_description,
                product.description AS product_description
            FROM 
                product_variation
            JOIN 
                product ON product_variation.product_id = product.product_id
            JOIN 
                product_status ON product_variation.product_status_id = product_status.status_id
            JOIN 
                product_category ON product.product_category_id = product_category.product_category_id
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
            `SELECT 
                product_variation.*,    
                product.product_category_id, 
                product_category.name AS product_category, 
                product.name AS product_name, 
                product_status.description AS status_description,
                product.description AS product_description,
                inventory.stock_quantity
            FROM 
                product_variation
            JOIN 
                product ON product_variation.product_id = product.product_id
            JOIN 
                product_status ON product_variation.product_status_id = product_status.status_id
            JOIN 
                product_category ON product.product_category_id = product_category.product_category_id
            LEFT JOIN 
                inventory ON product_variation.variation_id = inventory.variation_id
            WHERE 
                product_variation.variation_id = $1
            ORDER BY 
                product_variation.variation_id ASC;
            `,
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
  const { unit_price, product_status_id } = req.body;
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
        SET  unit_price = $1, product_status_id = $2, image = $3
        WHERE variation_id = $4
        RETURNING *`,
      [unit_price, product_status_id, image, id]
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

        const statusResult = await client.query(
            `SELECT status_id FROM product_status WHERE description = $1`,
            ['Archived']
        );

        // Check if 'Archived' status exists
        if (statusResult.rows.length === 0) {
            return res.status(404).json({ message: "Archived status not found" });
        }

        const product_status_id = statusResult.rows[0].status_id;

    try {
        const results = await client.query(
            `UPDATE product_variation
            SET product_status_id = $1
            WHERE variation_id = $2
            RETURNING *`,
            [product_status_id,variation_id]
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
    getAllProductVariations,
    getProductVariationById,
    updateProductVariation,
    deleteProductVariation,
    archiveProductVariation,
    deleteAllProductVariations
};