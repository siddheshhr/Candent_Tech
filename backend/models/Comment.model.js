// comment.model.js Defines the schema for comments and replies associated with leads.
const mongoose = require('mongoose');

/**
 * Reply Schema
 * Represents a reply to a comment.
 * Fields:
 * - userId: Reference to the User who made the reply.
 * - username: Name of the user who replied.
 * - content: Text content of the reply.
 * - createdAt: Timestamp when the reply was created.
 */
const replySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Comment Schema
 * Represents a comment on a lead.
 * Fields:
 * - userId: Reference to the User who made the comment.
 * - username: Name of the user who commented.
 * - leadId: Reference to the Lead the comment belongs to.
 * - content: Text content of the comment.
 * - replies: Array of replySchema (replies to this comment).
 * - createdAt: Timestamp when the comment was created.
 */
const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  replies: [replySchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
commentSchema.index({ leadId: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;