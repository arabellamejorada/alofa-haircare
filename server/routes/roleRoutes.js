const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController.js');

router.post('/user-role', roleController.createUserRole);
router.get('/user-role', roleController.getAllUserRoles); 
router.get('/user-role/:id', roleController.getUserRoleById); 
router.put('/user-role/:id', roleController.updateUserRole); 
router.delete('/user-role/:id', roleController.deleteUserRole);

module.exports = router;

