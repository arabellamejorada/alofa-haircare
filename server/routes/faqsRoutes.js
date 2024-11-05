const express = require('express');
const router = express.Router();
const faqsController = require('../controllers/faqsController');

router.get('/faqs', faqsController.getAllFaqs);
router.get('/faqs/:id', faqsController.getFaqById);
router.post('/faqs', faqsController.createFaq);
router.put('/faqs/:id', faqsController.updateFaq);
router.delete('/faqs/:id', faqsController.deleteFaq);

module.exports = router;
