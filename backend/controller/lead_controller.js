
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
        status: p.status || 'Pending' // Allow custom status or default to 'Pending'
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

    // 3) fetch 5 most‐recent leads
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