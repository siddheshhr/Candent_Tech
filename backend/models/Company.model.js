const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  domain: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CompanyMember' }],
  phases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Phase' }]
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);