const pool = require('../db.js');

// SUPPLIER CRUD
const createSupplier = async (req, res) => {
    const client = await pool.connect();
    const { supplier_name, contact_person, contact_number, email, address, status } = req.body;

    console.log(req.body);
    try {
        const query = `
            INSERT INTO supplier (supplier_name, contact_person, contact_number, email, address, status)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const results = await client.query(query, [supplier_name, contact_person, contact_number, email, address, status]);
        res.status(201).json(results.rows[0]);
    } catch (error) {
        console.error('Error creating supplier:', error);
        res.status(500).json({ message: 'Error creating supplier', error: error.message });
    } finally {
        client.release();
    }
};

const getAllSuppliers = async (req, res) => {
    const client = await pool.connect();

    try {
        const results = await client.query('SELECT * FROM supplier');
        res.status(200).json(results.rows);
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).json({ message: 'Error fetching suppliers', error: error.message });
    } finally {
        client.release();
    }
};

const getSupplierById = async (req, res) => {
    const client = await pool.connect();
    const supplier_id = req.params.id;

    try {
        const results = await client.query('SELECT * FROM supplier WHERE supplier_id = $1', [supplier_id]);

        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        res.status(200).json(results.rows[0]);
    } catch (error) {
        console.error('Error fetching supplier:', error);
        res.status(500).json({ message: 'Error fetching supplier', error: error.message });
    } finally {
        client.release();
    }
};

const updateSupplier = async (req, res) => {
    const client = await pool.connect();
    const supplier_id = req.params.id;
    const { supplier_name, contact_person, contact_number, email, address, status } = req.body;

    try {
        const query = `
            UPDATE supplier
            SET supplier_name = $1, contact_person = $2, contact_number = $3, email = $4, address = $5, status = $6
            WHERE supplier_id = $7
            RETURNING *
        `;

        const results = await client.query(query, [supplier_name, contact_person, contact_number, email, address, status, supplier_id]);

        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        res.status(200).json(results.rows[0]);
    } catch (error) {
        console.error('Error updating supplier:', error);
        res.status(500).json({ message: 'Error updating supplier', error: error.message });
    } finally {
        client.release();
    }
};

const archiveSupplier = async (req, res) => {
    const client = await pool.connect();
    const supplier_id = req.params.id;

    try {
        const query = `
            UPDATE supplier
            SET status = $1
            WHERE supplier_id = $2
            RETURNING *
        `;

        const results = await client.query(query, ['Archived', supplier_id]);

        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        res.status(200).json(results.rows[0]);
    } catch (error) {
        console.error('Error archiving supplier:', error);
        res.status(500).json({ message: 'Error archiving supplier', error: error.message });
    } finally {
        client.release();
    }
};

module.exports = {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    archiveSupplier,
};