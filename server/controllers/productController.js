const pool = require('../db.js');

const createProduct = (req, res) => {
    const { name, price } = req.body;
    pool.query(
        'INSERT INTO product (name, price) VALUES ($1, $2) RETURNING *',
        [name, price],
        (error, results) => {
            if (error) throw error;
            res.status(201).json(results.rows[0]);
        }
    );
};

const getAllProducts = (req, res) => {
    pool.query('SELECT * FROM product', (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

const getProductById = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query('SELECT * FROM product WHERE id = $1', [id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows[0]);
    });
};

const updateProduct = (req, res) => {
    const id = parseInt(req.params.id);
    const { name, price } = req.body;
    pool.query(
        'UPDATE product SET name = $1, price = $2 WHERE id = $3 RETURNING *',
        [name, price, id],
        (error, results) => {
            if (error) throw error;
            res.status(200).json(results.rows[0]);
        }
    );
};

const deleteProduct = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query('DELETE FROM product WHERE id = $1', [id], (error, results) => {
        if (error) throw error;
        res.status(200).send(`Product deleted with ID: ${id}`);
    });
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
