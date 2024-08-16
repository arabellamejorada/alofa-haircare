const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController.js');

router.post('/employee', employeeController.createEmployeeWithUserAccount);
router.get('/employee', employeeController.getAllEmployees);
router.get('/employee/:id', employeeController.getEmployeeById);
router.put('/employee/:id', employeeController.updateEmployee);
router.delete('/employee/:id', employeeController.deleteEmployee);

module.exports = router;