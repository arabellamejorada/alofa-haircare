const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController.js');

router.post('/user-account', roleController.createUserRole);
router.get('/user-account', roleController.getAllUserRoles); 
router.get('/user-account/:id', roleController.getUserRoleById); 
router.put('/user-account/:id', roleController.updateUserRole); 
router.delete('/user-account/:id', roleController.deleteUserRole);

module.exports = router;

