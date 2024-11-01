const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController.js");

router.post("/employees", employeeController.createEmployee);
router.get("/employees", employeeController.getAllEmployees);
router.get("/employees/profile/:profile_id", employeeController.getEmployeeIdByProfileId);
router.get("/employees/:id", employeeController.getEmployeeById);
router.put("/employees/:id", employeeController.updateEmployee);
router.put("/employees/:id/archive", employeeController.archiveEmployee);
router.delete("/employees/:id", employeeController.deleteEmployee);

router.get("/employee-status", employeeController.getEmployeeStatus);
router.post("/employee-status", employeeController.createEmployeeStatus);
router.put("/employee-status/:id", employeeController.updateEmployeeStatus);
router.delete("/employee-status/:id", employeeController.deleteEmployeeStatus);

module.exports = router;
