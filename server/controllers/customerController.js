const pool = require('../db.js');

const createCustomer = async (req, res) => {
    const client = await pool.connect();
    const { first_name, last_name, email, contact_number, role_id } = req.body;

    try {
        const newCustomer = await client.query(
            `INSERT INTO customer (first_name, last_name, email, contact_number, role_id) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *`,
            [first_name, last_name, email, contact_number, role_id]
        );
        res.status(201).json(newCustomer.rows[0]);
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(400).json({ message: 'Error creating customer', error: error.message });
    } finally {
        client.release();
    }
};

const getAllCustomers = async (req, res) => {
    const client = await pool.connect();

    try {
        const customers = await client.query('SELECT * FROM customer ORDER by customer_id ASC');
        res.status(200).json(customers.rows);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Error fetching customers', error: error.message });
    } finally {
        client.release();
    }
};

const getCustomerById = async (req, res) => {
    const client = await pool.connect();
    const customer_id = parseInt(req.params.id);

    try {
        const customer = await client.query('SELECT * FROM customer WHERE customer_id = $1', [customer_id]);

        if (customer.rows.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json(customer.rows[0]);
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).json({ message: 'Error fetching customer', error: error.message });
    } finally {
        client.release();
    }
};

const updateCustomer = async (req, res) => {
    const client = await pool.connect();
    const customer_id = parseInt(req.params.id);
    const { first_name, last_name, email, contact_number, role_id } = req.body;

    try {
        const updatedCustomer = await client.query(
            `UPDATE customer 
            SET first_name = $1, last_name = $2, email = $3, contact_number = $4, role_id = $5 
            WHERE customer_id = $6 
            RETURNING *`,
            [first_name, last_name, email, contact_number, role_id, customer_id]
        );

        if (updatedCustomer.rows.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json(updatedCustomer.rows[0]);
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(400).json({ message: 'Error updating customer', error: error.message });
    } finally {
        client.release();
    }
};

const deleteCustomer = async (req, res) => {
    const client = await pool.connect();
    const customer_id = parseInt(req.params.id);

    try {
        const result = await client.query(
            `DELETE FROM customer 
            WHERE customer_id = $1 
            RETURNING customer_id`,
            [customer_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({ message: `Customer deleted with ID: ${customer_id}` });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ message: 'Error deleting customer', error: error.message });
    } finally {
        client.release();
    }
};

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
};
