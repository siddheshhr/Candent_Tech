// models/LeadInfo.model.js Defines the schema for a lead entity.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leadInfoSchema = new Schema({
  profilePicture: { type: String },
  name: { type: String, required: true },
  role: { type: String },
  contact: { type: String },
  email: { type: String, required: true },
  personalEmail: { type: String },
  description: { type: String },
  birthdate: { type: Date },
  leadAddedDate: { type: Date, default: Date.now },
  company: { type: Schema.Types.ObjectId, ref: 'Company' },
  contacts: [{
    name: String,
    email: String,
    contact: String,
    designation: String
  }],
  phases: [{
    name: String,
    date: Date,
    status: {
      type: String,
      enum: ['Completed', 'In Progress', 'Stopped', 'Not Started'],
      default: 'Not Started'
    }
  }],
  discussions: [{
    date: Date,
    content: String
  }]
});

module.exports = mongoose.model('Lead', leadInfoSchema);