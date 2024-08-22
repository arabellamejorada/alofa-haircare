import axios from './axios';

export const getEmployees = async () => {
    try {
        const response = await axios.get('/employees');
        console.log('Employees fetched: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching employees: ', error);
        throw error;
    }
};

export const createEmployee = async (employee) => {
    try {
        const response = await axios.post('/employees', employee);
        console.log('Employee created: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating employee: ', error);
        throw error;
    }
};

export const updateEmployee = async (employee) => {
    try {
        const response = await axios.put(`/employees/${employee.employee_id}`, employee);
        console.log('Employee updated: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating employee: ', error);
        throw error;
    }
};

export const deleteEmployee = async (employeeId) => {
    try {
        const response = await axios.delete(`/employees/${employeeId}`);
        console.log('Employee deleted: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting employee: ', error);
        throw error;
    }
};

export const getRoles = async () => {
    try {
        const response = await axios.get('/user-role');
        console.log('Roles fetched: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching roles: ', error);
        throw error;
    }
};