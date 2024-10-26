const supabase = require("../supabaseClient.jsx");
const pool = require("../db.js");

// Create employee
const createEmployee = async (req, res) => {
  const client = await pool.connect();
  const { first_name, last_name, email, contact_number, role_id, password } =
    req.body; // Include password
  const status_id = 1; // Default status for new employees

  try {
    await client.query("BEGIN");

    // 1. Create user in Supabase Auth using the service role with a predefined password
    const { data: userData, error: authError } =
      await supabase.auth.admin.createUser({
        email: email,
        password: password, // Set the predefined password
        email_confirm: true,
        user_metadata: {
          first_name,
          last_name,
          contact_number,
        },
        app_metadata: {
          roles: ["employee"],
        },
      });

    if (authError) {
      await client.query("ROLLBACK");
      console.error("Error creating user in Supabase Auth:", authError);
      return res
        .status(500)
        .json({ message: "Error creating user in authentication system." });
    }

    const authUserId = userData.user.id;

    // 2. Create profile in your database
    const profileResult = await client.query(
      `INSERT INTO profiles (id, first_name, last_name, email, contact_number, role_id) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
      [authUserId, first_name, last_name, email, contact_number, role_id],
    );

    const profile = profileResult.rows[0];

    // 3. Create employee record
    const newEmployeeResult = await client.query(
      `INSERT INTO employee (profile_id, status_id) 
         VALUES ($1, $2) 
         RETURNING *`,
      [authUserId, status_id],
    );

    const newEmployee = newEmployeeResult.rows[0];

    await client.query("COMMIT");

    res.status(201).json({
      employee: newEmployee,
      profile: profile,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating employee and profile:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  } finally {
    client.release();
  }
};

const getAllEmployees = async (req, res) => {
  const client = await pool.connect();

  try {
    const employees = await client.query(
      `SELECT 
                e.employee_id,
                e.status_id,
                p.first_name,
                p.last_name,
                p.email,
                p.contact_number,
                p.role_id
             FROM employee e
             JOIN profiles p ON e.profile_id = p.id
             ORDER BY e.employee_id ASC`,
    );
    res.status(200).json(employees.rows);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res
      .status(500)
      .json({ message: "Error fetching employees", error: error.message });
  } finally {
    client.release();
  }
};

const getEmployeeById = async (req, res) => {
  const client = await pool.connect();
  const employee_id = parseInt(req.params.id);

  try {
    const result = await client.query(
      `SELECT 
                e.employee_id,
                e.status_id,
                p.username,
                p.first_name,
                p.last_name,
                p.email,
                p.contact_number,
                p.role_id
             FROM employee e
             JOIN profiles p ON e.profile_id = p.id
             WHERE e.employee_id = $1`,
      [employee_id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching employee:", error);
    res
      .status(500)
      .json({ message: "Error fetching employee", error: error.message });
  } finally {
    client.release();
  }
};

const updateEmployee = async (req, res) => {
  const client = await pool.connect();
  const employee_id = parseInt(req.params.id);
  const { first_name, last_name, email, contact_number, status_id } = req.body;

  try {
    await client.query("BEGIN");

    // Get the profile_id
    const employeeResult = await client.query(
      `SELECT profile_id FROM employee WHERE employee_id = $1`,
      [employee_id],
    );

    if (employeeResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Employee not found" });
    }

    const profile_id = employeeResult.rows[0].profile_id;

    // Update profiles table
    await client.query(
      `UPDATE profiles
             SET first_name = $1, last_name = $2, email = $3, contact_number = $4
             WHERE id = $5`,
      [first_name, last_name, email, contact_number, profile_id],
    );

    // Update employee table
    await client.query(
      `UPDATE employee
             SET status_id = $1
             WHERE employee_id = $2`,
      [status_id, employee_id],
    );

    await client.query("COMMIT");

    res.status(200).json({ message: "Employee updated successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating employee:", error);
    res
      .status(400)
      .json({ message: "Error updating employee", error: error.message });
  } finally {
    client.release();
  }
};

const archiveEmployee = async (req, res) => {
  const client = await pool.connect();
  const employee_id = parseInt(req.params.id);
  console.log("req param id:", employee_id);
  try {
    // Get the status_id for 'Archived' dynamically
    const statusResult = await client.query(
      `SELECT status_id FROM employee_status WHERE description = $1`,
      ["Archived"],
    );
    console.log("statusResult:", statusResult);
    // Check if 'Archived' status exists
    if (statusResult.rows.length === 0) {
      return res.status(404).json({ message: "Archived status not found" });
    }

    const status_id = statusResult.rows[0].status_id;

    // Update the employee's status to 'Archived'
    const archivedEmployee = await client.query(
      `UPDATE employee 
             SET status_id = $1
             WHERE employee_id = $2 
             RETURNING *`,
      [status_id, employee_id],
    );

    if (archivedEmployee.rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(archivedEmployee.rows[0]);
  } catch (error) {
    console.error("Error archiving employee:", error);
    res
      .status(500)
      .json({ message: "Error archiving employee", error: error.message });
  } finally {
    client.release();
  }
};

const deleteEmployee = async (req, res) => {
  const client = await pool.connect();
  const employee_id = parseInt(req.params.id);

  try {
    await client.query("BEGIN");

    // Get the profile_id
    const employeeResult = await client.query(
      `SELECT profile_id FROM employee WHERE employee_id = $1`,
      [employee_id],
    );

    if (employeeResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Employee not found" });
    }

    const profile_id = employeeResult.rows[0].profile_id;

    // Delete from employee table
    await client.query(`DELETE FROM employee WHERE employee_id = $1`, [
      employee_id,
    ]);

    // Optionally, delete from profiles table
    await client.query(`DELETE FROM profiles WHERE id = $1`, [profile_id]);

    await client.query("COMMIT");

    res
      .status(200)
      .json({ message: `Employee deleted with ID: ${employee_id}` });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting employee:", error);
    res
      .status(500)
      .json({ message: "Error deleting employee", error: error.message });
  } finally {
    client.release();
  }
};

const createEmployeeStatus = async (req, res) => {
  const client = await pool.connect();
  const { description } = req.body;

  try {
    const newStatus = await client.query(
      `INSERT INTO employee_status (description) 
             VALUES ($1) 
             RETURNING *`,
      [description],
    );

    res.status(201).json(newStatus.rows[0]);
  } catch (error) {
    console.error("Error creating new employee status:", error);
    res.status(500).json({
      message: "Error creating employee status",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

const getEmployeeStatus = async (req, res) => {
  const client = await pool.connect();

  try {
    const statuses = await client.query(
      "SELECT status_id, description FROM employee_status ORDER BY status_id ASC",
    );
    res.status(200).json(statuses.rows);
  } catch (error) {
    console.error("Error fetching employee statuses:", error);
    res.status(500).json({
      message: "Error fetching employee statuses",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

const updateEmployeeStatus = async (req, res) => {
  const client = await pool.connect();
  const status_id = parseInt(req.params.id);
  const { description } = req.body;

  try {
    const updatedStatus = await client.query(
      `UPDATE employee_status 
             SET description = $1 
             WHERE status_id = $2 
             RETURNING *`,
      [description, status_id],
    );

    if (updatedStatus.rows.length === 0) {
      return res.status(404).json({ message: "Employee status not found" });
    }

    res.status(200).json(updatedStatus.rows[0]);
  } catch (error) {
    console.error("Error updating employee status:", error);
    res.status(500).json({
      message: "Error updating employee status",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

const deleteEmployeeStatus = async (req, res) => {
  const client = await pool.connect();
  const status_id = parseInt(req.params.id);

  try {
    const result = await client.query(
      `DELETE FROM employee_status 
             WHERE status_id = $1 
             RETURNING status_id`,
      [status_id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Employee status not found" });
    }

    res
      .status(200)
      .json({ message: `Employee status deleted with ID: ${status_id}` });
  } catch (error) {
    console.error("Error deleting employee status:", error);
    res.status(500).json({
      message: "Error deleting employee status",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  archiveEmployee,
  deleteEmployee,
  createEmployeeStatus,
  getEmployeeStatus,
  updateEmployeeStatus,
  deleteEmployeeStatus,
};
