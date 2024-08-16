const pool = require('../db.js');
const bcrypt = require('bcrypt');

// Create employee without user account
const createEmployeeWithUserAccount = async (req, res) => {
    const client = await pool.connect();
    const { first_name, last_name, email, contact_number, role_id, username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await client.query('BEGIN');

        // Create employee
        const newEmployee = await client.query(
            `INSERT INTO employee (first_name, last_name, email, contact_number, role_id) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING employee_id`,
            [first_name, last_name, email, contact_number, role_id]
        );

        const employee_id = newEmployee.rows[0].employee_id;

        // Create user account
        const newUserAccount = await client.query(
            `INSERT INTO user_account (username, password, employee_id) 
            VALUES ($1, $2, $3) 
            RETURNING *`,
            [username, hashedPassword, employee_id]
        );

        await client.query('COMMIT');

        res.status(201).json({
            employee: newEmployee.rows[0],
            userAccount: newUserAccount.rows[0]
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating employee and user account:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    } finally {
        client.release();
    }
};

const getAllEmployees = async (req, res) => {
    const client = await pool.connect();

    try {
        const employees = await client.query('SELECT * FROM employee');
        res.status(200).json(employees.rows);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Error fetching employees', error: error.message });
    } finally {
        client.release();
    }
};

const getEmployeeById = async (req, res) => {
    const client = await pool.connect();
    const employee_id = parseInt(req.params.id);

    try {
        const employee = await client.query('SELECT * FROM employee WHERE employee_id = $1', [employee_id]);

        if (employee.rows.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(employee.rows[0]);
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ message: 'Error fetching employee', error: error.message });
    } finally {
        client.release();
    }
};

const updateEmployee = async (req, res) => {
    const client = await pool.connect();
    const employee_id = parseInt(req.params.id);
    const { first_name, last_name, email, contact_number, role_id } = req.body;

    try {
        const updatedEmployee = await client.query(
            `UPDATE employee 
            SET first_name = $1, last_name = $2, email = $3, contact_number = $4, role_id = $5 
            WHERE employee_id = $6 
            RETURNING *`,
            [first_name, last_name, email, contact_number, role_id, employee_id]
        );

        if (updatedEmployee.rows.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(updatedEmployee.rows[0]);
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(400).json({ message: 'Error updating employee', error: error.message });
    } finally {
        client.release();
    }
};

const deleteEmployee = async (req, res) => {
    const client = await pool.connect();
    const employee_id = parseInt(req.params.id);

    try {
        const result = await client.query(
            `DELETE FROM employee 
            WHERE employee_id = $1 
            RETURNING employee_id`,
            [employee_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: `Employee deleted with ID: ${employee_id}` });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ message: 'Error deleting employee', error: error.message });
    } finally {
        client.release();
    }
};

module.exports = {
    createEmployeeWithUserAccount,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};
