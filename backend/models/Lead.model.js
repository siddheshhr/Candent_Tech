const mongoose = require('mongoose');

const leadInfoSchema = new mongoose.Schema({
  profilePicture: { type: String },
  name: { type: String, required: true },
  role: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  personalEmail: { type: String, required: true },
  description: { type: String, required: true },
  birthdate: { type: Date, required: true },
  leadAddedDate: { type: Date, required: true, default: Date.now },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }
}, { timestamps: true });

module.exports = mongoose.model('LeadInfo', leadInfoSchema);