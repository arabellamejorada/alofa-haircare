const pool = require('../db.js');

const createUserAccount = async (req, res) => {
    const client = await pool.connect();
    const { username, password, employee_id, customer_id } = req.body;

    try {
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Insert new user account
        const newUserAccount = await client.query(
            `INSERT INTO user_account (username, password, employee_id, customer_id)
            VALUES ($1, $2, $3, $4) 
            RETURNING *`,
            [username, password, employee_id, customer_id]
        );
        res.status(201).json(newUserAccount.rows[0]);
    } catch (error) {
        console.error('Error creating user account:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    } finally {
        client.release();
    }
};

const getAllUserAccounts = async (req, res) => {
    const client = await pool.connect();

    try {
        const userAccounts = await client.query('SELECT * FROM user_account');
        res.status(200).json(userAccounts.rows);
    } catch (error) {
        console.error('Error fetching user accounts:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    } finally {
        client.release();
    }
};

const getUserAccountById = async (req, res) => {
    const client = await pool.connect();
    const user_account_id = parseInt(req.params.id, 10);

    try {
        const userAccount = await client.query('SELECT * FROM user_account WHERE user_account_id = $1', [user_account_id]);

        if (userAccount.rows.length === 0) {
            return res.status(404).json({ message: 'User account not found' });
        }
        res.status(200).json(userAccount.rows[0]);
    } catch (error) {
        console.error('Error fetching user account by ID:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    } finally {
        client.release();
    }
};

const updateUserAccount = async (req, res) => {
    const client = await pool.connect();
    const user_account_id = parseInt(req.params.id, 10);
    const { username, password, employee_id, customer_id } = req.body;

    try {
        // Validate input
        if (!username && !password && employee_id === undefined && customer_id === undefined) {
            return res.status(400).json({ message: 'At least one field is required for update' });
        }

        // Update user account
        const updatedUserAccount = await client.query(
            `UPDATE user_account 
            SET username = COALESCE($1, username), 
                password = COALESCE($2, password), 
                employee_id = COALESCE($3, employee_id), 
                customer_id = COALESCE($4, customer_id) 
            WHERE user_account_id = $5 
            RETURNING *`,
            [username, password, employee_id, customer_id, user_account_id]
        );

        if (updatedUserAccount.rows.length === 0) {
            return res.status(404).json({ message: 'User account not found' });
        }
        res.status(200).json(updatedUserAccount.rows[0]);
    } catch (error) {
        console.error('Error updating user account:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    } finally {
        client.release();
    }
};

const deleteUserAccount = async (req, res) => {
    const client = await pool.connect();
    const user_account_id = parseInt(req.params.id, 10);

    try {
        const result = await client.query(
            `DELETE FROM user_account 
            WHERE user_account_id = $1 
            RETURNING user_account_id`,
            [user_account_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'User account not found' });
        }
        res.status(200).json({ message: `User account deleted with ID: ${user_account_id}` });
    } catch (error) {
        console.error('Error deleting user account:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    } finally {
        client.release();
    }
};

module.exports = {
    createUserAccount,
    getAllUserAccounts,
    getUserAccountById,
    updateUserAccount,
    deleteUserAccount
};
