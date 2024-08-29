const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController.js');

router.post('/employees', employeeController.createEmployeeWithUserAccount);
router.get('/employees', employeeController.getAllEmployees);
router.get('/employees/:id', employeeController.getEmployeeById);
router.put('/employees/:id', employeeController.updateEmployee);
router.put('/employees/:id/archive', employeeController.archiveEmployee);
router.delete('/employees/:id', employeeController.deleteEmployee);

module.exports = router;