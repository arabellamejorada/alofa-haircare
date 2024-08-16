const pool = require('../db.js');

const createUserRole = async (req, res) => {
    const client = await pool.connect();
    const { name, description } = req.body;

    try {
        const newRole = await client.query(
            `INSERT INTO role (name, description) 
            VALUES ($1, $2) 
            RETURNING *`,
            [name, description]
        );
        res.status(201).json(newRole.rows[0]);
    } catch (error) {
        console.error('Error creating user role:', error);
        res.status(400).json({ message: 'Error creating user role', error: error.message });
    } finally {
        client.release();
    }
};

const getAllUserRoles = async (req, res) => {
    const client = await pool.connect();

    try {
        const roles = await client.query('SELECT * FROM role');
        res.status(200).json(roles.rows);
    } catch (error) {
        console.error('Error fetching user roles:', error);
        res.status(500).json({ message: 'Error fetching user roles', error: error.message });
    } finally {
        client.release();
    }
};

const getUserRoleById = async (req, res) => {
    const client = await pool.connect();
    const role_id = parseInt(req.params.id);

    try {
        const role = await client.query('SELECT * FROM role WHERE role_id = $1', [role_id]);

        if (role.rows.length === 0) {
            return res.status(404).json({ message: 'User role not found' });
        }

        res.status(200).json(role.rows[0]);
    } catch (error) {
        console.error('Error fetching user role:', error);
        res.status(500).json({ message: 'Error fetching user role', error: error.message });
    } finally {
        client.release();
    }
};

const updateUserRole = async (req, res) => {
    const client = await pool.connect();
    const role_id = parseInt(req.params.id);
    const { name, description } = req.body;

    try {
        const updatedRole = await client.query(
            `UPDATE role 
            SET name = $1, description = $2 
            WHERE role_id = $3 
            RETURNING *`,
            [name, description, role_id]
        );

        if (updatedRole.rows.length === 0) {
            return res.status(404).json({ message: 'User role not found' });
        }

        res.status(200).json(updatedRole.rows[0]);
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(400).json({ message: 'Error updating user role', error: error.message });
    } finally {
        client.release();
    }
};

const deleteUserRole = async (req, res) => {
    const client = await pool.connect();
    const role_id = parseInt(req.params.id);

    try {
        const deletedRole = await client.query(
            `DELETE FROM role 
            WHERE role_id = $1 
            RETURNING *`, 
            [role_id]
        );

        if (deletedRole.rowCount === 0) {
            return res.status(404).json({ message: 'User role not found' });
        }

        res.status(200).json({ message: `User role deleted with ID: ${role_id}` });
    } catch (error) {
        console.error('Error deleting user role:', error);
        res.status(400).json({ message: 'Error deleting user role', error: error.message });
    } finally {
        client.release();
    }
};

module.exports = {
    createUserRole,
    getAllUserRoles,
    getUserRoleById,
    updateUserRole,
    deleteUserRole
};
