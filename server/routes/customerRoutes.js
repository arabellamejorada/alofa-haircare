const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController.js');


router.post('/customer', customerController.createCustomer);
router.get('/customer', customerController.getAllCustomers);
router.get('/customer/profile/:profile_id', customerController.getCustomerByProfileId);
router.get('/customer/:id', customerController.getCustomerById);
router.put('/customer/:id', customerController.updateCustomer);
router.delete('/customer/:id', customerController.deleteCustomer);

module.exports = router;
