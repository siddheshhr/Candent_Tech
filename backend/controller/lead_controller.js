const LeadInfo = require('../models/Lead.model');
const Company = require('../models/Company.model');
const CompanyMember = require('../models/CompanyMembers.model');
const Phase = require('../models/Phase.model');
const mongoose = require('mongoose');

// Add a new lead
exports.addLead = async (req, res) => {
  try {
    const {
      profilePicture,
      name,
      role,
      contact,
      email,
      personalEmail,
      description,
      birthdate,
      leadAddedDate,
      companyName,
      companyDomain,
      companyAddress,
      companyContact,
      companyCity,
      companyState,
      companyCountry,
      companyMembers,
      phases,
    } = req.body;

    // Validate required fields
    if (!name || !role || !contact || !email || !personalEmail || !description || !birthdate || !companyName || !companyDomain || !companyAddress || !companyContact || !companyCity || !companyState || !companyCountry) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided',
      });
    }

    // Create and save company
    const company = new Company({
      name: companyName,
      domain: companyDomain,
      address: companyAddress,
      contact: companyContact,
      city: companyCity,
      state: companyState,
      country: companyCountry,
    });
    await company.save();

    // Create and save company members
    const memberPromises = companyMembers.map(member => {
      const companyMember = new CompanyMember({
        role: member.role,
        name: member.name,
        email: member.email,
        contact: member.contact,
        company: company._id,
      });
      return companyMember.save();
    });
    const savedMembers = await Promise.all(memberPromises);
    company.members = savedMembers.map(member => member._id);

    // Create and save phases
    const phasePromises = phases.map(phase => {
      const newPhase = new Phase({
        name: phase.name,
        date: phase.date,
        company: company._id,
      });
      return newPhase.save();
    });
    const savedPhases = await Promise.all(phasePromises);
    company.phases = savedPhases.map(phase => phase._id);

    await company.save();

    // Create and save lead
    const leadInfo = new LeadInfo({
      profilePicture,
      name,
      role,
      contact,
      email,
      personalEmail,
      description,
      birthdate,
      leadAddedDate: leadAddedDate || Date.now(),
      company: company._id,
    });
    await leadInfo.save();

    // Populate the response data
    const populatedLead = await LeadInfo.findById(leadInfo._id).populate({
      path: 'company',
      populate: [
        { path: 'members' },
        { path: 'phases' },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: populatedLead,
    });
  } catch (error) {
    console.error('[BACKEND] Error creating lead:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error creating lead',
      error: error.message,
    });
  }
};

// Get all leads
exports.getAllLeads = async (req, res) => {
  try {
    const leads = await LeadInfo.find().populate({
      path: 'company',
      populate: [
        { path: 'members' },
        { path: 'phases' },
      ],
    });

    if (!leads || leads.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No leads found',
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: 'Leads retrieved successfully',
      data: leads,
    });
  } catch (error) {
    console.error('[BACKEND] Error fetching leads:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching leads',
      error: error.message,
    });
  }
};

// Delete a lead by ID
exports.deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lead ID format',
      });
    }

    // Find the lead
    const lead = await LeadInfo.findById(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    // Delete associated company and its members/phases
    const company = await Company.findById(lead.company);
    if (company) {
      console.log('[BACKEND] Deleting members for company:', company._id);
      await CompanyMember.deleteMany({ company: company._id });
      console.log('[BACKEND] Deleting phases for company:', company._id);
      await Phase.deleteMany({ company: company._id });
      console.log('[BACKEND] Deleting company:', company._id);
      await company.deleteOne();
    } else {
      console.log('[BACKEND] No company found for lead:', lead._id);
    }

    // Delete the lead
    console.log('[BACKEND] Deleting lead:', lead._id);
    await lead.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Lead and associated data deleted successfully',
    });
  } catch (error) {
    console.error('[BACKEND] Error deleting lead:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error deleting lead',
      error: error.message,
    });
  }
};

// Optional: Add these if you plan to implement View Details or Edit functionality
/*
exports.getLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lead ID format',
      });
    }

    const lead = await LeadInfo.findById(id).populate({
      path: 'company',
      populate: [
        { path: 'members' },
        { path: 'phases' },
      ],
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead retrieved successfully',
      data: lead,
    });
  } catch (error) {
    console.error('[BACKEND] Error fetching lead:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching lead',
      error: error.message,
    });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lead ID format',
      });
    }

    const lead = await LeadInfo.findById(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    Object.assign(lead, req.body);
    await lead.save();

    if (req.body.company) {
      const company = await Company.findById(lead.company);
      if (company) {
        Object.assign(company, req.body.company);
        await company.save();
      }
    }

    const updatedLead = await LeadInfo.findById(id).populate({
      path: 'company',
      populate: [
        { path: 'members' },
        { path: 'phases' },
      ],
    });

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: updatedLead,
    });
  } catch (error) {
    console.error('[BACKEND] Error updating lead:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating lead',
      error: error.message,
    });
  }
};
*/

module.exports = exports;