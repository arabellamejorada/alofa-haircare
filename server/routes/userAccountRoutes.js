const express = require('express');
const router = express.Router();
const userAccountController = require('../controllers/userAccountController.js');

router.post('/user-accounts', userAccountController.createUserAccount);
router.get('/user-accounts', userAccountController.getAllUserAccounts);
router.get('/user-accounts/:id', userAccountController.getUserAccountById);
router.put('/user-accounts/:id', userAccountController.updateUserAccount);
router.delete('/user-accounts/:id', userAccountController.deleteUserAccount);

module.exports = router;