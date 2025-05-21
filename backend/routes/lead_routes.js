const express = require('express');
const router = express.Router();
const leadController = require('../controller/lead_controller');

// Route to get stats
router.get('/stats', leadController.getStats);

// Route to add a new lead
router.post('/add', leadController.createLead);

// Route to get all leads
router.get('/', leadController.getAllLeads);

// Route to get a single lead by ID
router.get('/:id', leadController.getLeadById);

// Route to update a lead
router.put('/:id', leadController.updateLead);

// Route to delete a lead by ID
router.delete('/:id', leadController.deleteLead);

// Routes for contacts (Added to manage contacts)
router.post('/:id/contacts', leadController.addContact); // Add a new contact
router.delete('/:id/contacts/:contactId', leadController.deleteContact); // Delete a contact

// Routes for phases (Added to fix 404 errors for phase operations)
router.post('/:id/phases', leadController.addPhase); // Add a new phase
router.put('/:id/phases/:phaseId', leadController.updatePhase); // Update a phase
router.delete('/:id/phases/:phaseId', leadController.deletePhase); // Delete a phase

module.exports = router;