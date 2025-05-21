const Lead = require('../models/LeadInfo.model');
const Company = require('../models/Company.model');
const CompanyMember = require('../models/CompanyMembers.model');
const Phase = require('../models/Phase.model');
const mongoose = require('mongoose');

// GET all leads
exports.getAllLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find().populate('company');
    res.status(200).json({ success: true, data: leads });
  } catch (err) {
    next(err);
  }
};

// GET one lead by ID
exports.getLeadById = async (req, res) => {
  try {
    const leadId = req.params.id;
    const lead = await Lead.findById(leadId).populate('company');
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    return res.status(200).json({ success: true, data: lead });
  } catch (error) {
    console.error('Error fetching lead by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching lead details',
      error: error.message,
    });
  }
};

// POST create new lead
exports.createLead = async (req, res, next) => {
  try {
    const {
      profilePicture, name, role, contact,
      email, personalEmail, description,
      birthdate, leadAddedDate,
      companyName, companyDomain, companyAddress,
      companyContact, companyCity, companyState,
      companyCountry,
      companyMembers = [], phases = []
    } = req.body;

    // 1) Create Company
    const company = new Company({
      name: companyName,
      domain: companyDomain,
      address: companyAddress,
      contact: companyContact,
      city: companyCity,
      state: companyState,
      country: companyCountry,
      members: [],
      phases: []
    });
    await company.save();

    // 2) Create LeadInfo with embedded contacts + phases
    const lead = new Lead({
      profilePicture,
      name,
      role,
      contact,
      email,
      personalEmail,
      description,
      birthdate: new Date(birthdate),
      leadAddedDate: leadAddedDate ? new Date(leadAddedDate) : Date.now(),
      company: company._id,
      contacts: companyMembers.map(m => ({
        name: m.name,
        email: m.email,
        contact: m.contact,
        designation: m.role
      })),
      phases: phases.map(p => ({
        name: p.name,
        date: new Date(p.date),
        status: p.status || 'Not Started'
      })),
      discussions: []
    });
    await lead.save();

    // 3) Return populated
    const populated = await Lead.findById(lead._id).populate('company');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

// PUT update lead
exports.updateLead = async (req, res, next) => {
  try {
    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// DELETE lead
exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.status(200).json({ success: true, message: 'Lead deleted' });
  } catch (err) {
    next(err);
  }
};

/** 
 * GET /api/dashboard/stats
 * Returns totalLeads, totalCompanies, leadsPerMonth, recentLeads
 */
exports.getStats = async (req, res, next) => {
  try {
    // 1) total counts
    const totalLeads = await Lead.countDocuments();
    const totalCompanies = await Company.countDocuments();

    // 2) group leads by year-month
    const leadsPerMonth = await Lead.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$leadAddedDate" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]).exec();

    // 3) fetch 5 most-recent leads
    const recentLeads = await Lead
      .find({})
      .sort({ leadAddedDate: -1 })
      .limit(5)
      .select("name company leadAddedDate")
      .populate("company", "name")
      .lean();

    return res.status(200).json({
      success: true,
      totalLeads,
      totalCompanies,
      leadsPerMonth: leadsPerMonth.map(d => ({ month: d._id, count: d.count })),
      recentLeads
    });
  } catch (err) {
    next(err);
  }
};

// POST add a new contact to a lead
exports.addContact = async (req, res, next) => {
  try {
    const leadId = req.params.id;
    const { name, email, contact, designation } = req.body;

    // Validate request body
    if (!name || !email || !contact || !designation) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Find the lead by ID
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Add the new contact to the lead's contacts array
    const newContact = { name, email, contact, designation };
    lead.contacts.push(newContact);

    // Save the updated lead
    await lead.save();

    // Return the newly added contact with its MongoDB-generated _id
    const addedContact = lead.contacts[lead.contacts.length - 1];
    res.status(201).json({ success: true, data: addedContact });
  } catch (error) {
    console.error('Error adding contact:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE a contact from a lead
exports.deleteContact = async (req, res, next) => {
  try {
    const leadId = req.params.id;
    const contactId = req.params.contactId;

    // Find the lead by ID
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Find the contact index
    const contactIndex = lead.contacts.findIndex(contact => contact._id.toString() === contactId);
    if (contactIndex === -1) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    // Remove the contact from the array
    lead.contacts.splice(contactIndex, 1);

    // Save the updated lead
    await lead.save();

    res.status(200).json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST add a new phase to a lead
exports.addPhase = async (req, res, next) => {
  try {
    const leadId = req.params.id;
    const { name, date, status } = req.body;

    // Validate request body
    if (!name || !date) {
      return res.status(400).json({ success: false, message: 'Name and date are required' });
    }

    // Find the lead by ID
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Validate status if provided
    const validStatuses = ['Completed', 'In Progress', 'Stopped', 'Not Started'];
    const phaseStatus = status && validStatuses.includes(status) ? status : 'Not Started';

    // Add the new phase to the lead's phases array
    const newPhase = { name, date: new Date(date), status: phaseStatus };
    lead.phases.push(newPhase);

    // Save the updated lead
    await lead.save();

    // Return the newly added phase with its MongoDB-generated _id
    const addedPhase = lead.phases[lead.phases.length - 1];
    res.status(201).json({ success: true, data: addedPhase });
  } catch (error) {
    console.error('Error adding phase:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT update a phase in a lead
exports.updatePhase = async (req, res, next) => {
  try {
    const leadId = req.params.id;
    const phaseId = req.params.phaseId;
    const { name, date, status } = req.body;

    // Find the lead by ID
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Find the phase index
    const phaseIndex = lead.phases.findIndex(phase => phase._id.toString() === phaseId);
    if (phaseIndex === -1) {
      return res.status(404).json({ success: false, message: 'Phase not found' });
    }

    // Validate status if provided
    const validStatuses = ['Completed', 'In Progress', 'Stopped', 'Not Started'];
    const phaseStatus = status && validStatuses.includes(status) ? status : lead.phases[phaseIndex].status;

    // Update the phase while preserving its _id
    lead.phases[phaseIndex] = {
      ...lead.phases[phaseIndex],
      name: name || lead.phases[phaseIndex].name,
      date: date ? new Date(date) : lead.phases[phaseIndex].date,
      status: phaseStatus
    };

    // Save the updated lead
    await lead.save();

    // Return the updated phase
    res.status(200).json({ success: true, data: lead.phases[phaseIndex] });
  } catch (error) {
    console.error('Error updating phase:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE a phase from a lead
exports.deletePhase = async (req, res, next) => {
  try {
    const leadId = req.params.id;
    const phaseId = req.params.phaseId;

    // Find the lead by ID
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Find the phase index
    const phaseIndex = lead.phases.findIndex(phase => phase._id.toString() === phaseId);
    if (phaseIndex === -1) {
      return res.status(404).json({ success: false, message: 'Phase not found' });
    }

    // Remove the phase from the array
    lead.phases.splice(phaseIndex, 1);

    // Save the updated lead
    await lead.save();

    res.status(200).json({ success: true, message: 'Phase deleted successfully' });
  } catch (error) {
    console.error('Error deleting phase:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};