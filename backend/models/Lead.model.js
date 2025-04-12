// models/LeadInfo.model.js
const mongoose = require('mongoose');

// 1️⃣ Contact embedded schema
const contactSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  company: { type: String, required: true },
  status:  { type: String, required: true },
  role:   { type: String, required: true },
}, { _id: false });

// 2️⃣ Phase embedded schema
const phaseSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  date:    { type: Date,   required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
}, { timestamps: true });A

// 3️⃣ Discussion thread schema
const replySchema = new mongoose.Schema({
  sender:    { type: String, required: true },
  message:   { type: String, required: true },
  timestamp: { type: Date,   default: Date.now },
}, { _id: false });

const commentSchema = new mongoose.Schema({
  sender:    { type: String, required: true },
  message:   { type: String, required: true },
  timestamp: { type: Date,   default: Date.now },
  replies:   [replySchema]
}, { timestamps: true });

// 4️⃣ Main LeadInfo schema
const leadInfoSchema = new mongoose.Schema({
  profilePicture:  { type: String },
  name:            { type: String, required: true },
  role:            { type: String, required: true },
  contact:         { type: String, required: true },
  email:           { type: String, required: true },
  personalEmail:   { type: String, required: true },
  description:     { type: String, required: true },
  birthdate:       { type: Date,   required: true },
  leadAddedDate:   { type: Date,   required: true, default: Date.now },
  company:         { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },

  contacts:        [contactSchema],   // ⬅️ array of contacts
  phases:          [phaseSchema],     // ⬅️ array of phases
  discussions:     [commentSchema],   // ⬅️ array of comments with replies
}, { timestamps: true });

module.exports = mongoose.model('LeadInfo', leadInfoSchema);
