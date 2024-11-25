import axios from "./axios";

export const getEmployees = async () => {
  try {
    const response = await axios.get("/employees");
    // console.log("Employees fetched: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching employees: ", error);
    throw error;
  }
};

export const getEmployeeIdByProfileId = async (profile_id) => {
  try {
    const response = await axios.get(`/employees/profile/${profile_id}`);
    // console.log("Employee fetched: ", response.data);
    return response.data.employee_id;
  } catch (error) {
    console.error("Error fetching employee: ", error);
    throw error;
  }
};

export const getEmployeeById = async (employee_id) => {
  try {
    const response = await axios.get(`/employees/${employee_id}`);
    return response.data; // Includes detailed employee data
  } catch (error) {
    console.error("Error fetching employee by ID:", error);
    throw error;
  }
};

export const createEmployee = async (employee) => {
  try {
    const response = await axios.post("/employees", employee);
    // console.log("Employee created: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating employee: ", error);
    throw error;
  }
};

export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await axios.put(`/employees/${id}`, employeeData);
    // console.log("Employee updated: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating employee: ", error);
    throw error;
  }
};

// export const archiveEmployee = async (employeeId) => {
//     try {
//         const response = await axios.put(`/employees/${employeeId}/archive`);
//         console.log('Employee archived: ', response.data);
//         return response.data;
//     } catch (error) {
//         console.error('Error archiving employee: ', error);
//         throw error;
//     }
// };

export const deleteEmployee = async (employeeId) => {
  try {
    const response = await axios.delete(`/employees/${employeeId}`);
    // console.log("Employee deleted: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting employee: ", error);
    throw error;
  }
};

export const getRoles = async () => {
  try {
    const response = await axios.get("/user-role");
    // console.log("Roles fetched: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching roles: ", error);
    throw error;
  }
};

export const getEmployeeStatus = async () => {
  try {
    const response = await axios.get("/employee-status");
    // console.log("Employee statuses fetched: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching employee statuses: ", error);
    throw error;
  }
};
