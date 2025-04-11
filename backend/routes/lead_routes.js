const express = require('express');
const router = express.Router();
const leadController = require('../controller/lead_controller');

// Route to add a new lead
router.post('/add', leadController.addLead);

// Route to get all leads
router.get('/', leadController.getAllLeads);

// Route to delete a lead by ID
router.delete('/:id', leadController.deleteLead);

// Optional: Add routes for getting a single lead or updating if needed
// router.get('/:id', leadController.getLeadById);
// router.put('/:id', leadController.updateLead);

module.exports = router;