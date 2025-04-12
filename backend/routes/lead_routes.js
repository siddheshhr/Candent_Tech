const express = require('express');
const router = express.Router();
const leadController = require('../controller/lead_controller');

// Route to add a new lead
router.post('/add', leadController.createLead);  // Changed from addLead to createLead

// Route to get all leads
router.get('/', leadController.getAllLeads);

// Route to get a single lead by ID
router.get('/:id', leadController.getLeadById);  // Uncommented this line

// Route to update a lead
router.put('/:id', leadController.updateLead);   // Uncommented this line

// Route to delete a lead by ID
router.delete('/:id', leadController.deleteLead);

module.exports = router;