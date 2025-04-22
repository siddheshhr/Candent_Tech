// comment_controller.js
const Comment = require('../models/Comment.model');
const mongoose = require('mongoose');

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Get all comments for a lead
exports.getCommentsByLeadId = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { page = 1, limit = 10, sort = 'newest' } = req.query;

    if (!isValidObjectId(leadId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lead ID format'
      });
    }

    const sortOption = sort === 'newest' ? { createdAt: -1 } : { createdAt: 1 };
    
    const comments = await Comment.find({ leadId })
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Comment.countDocuments({ leadId });

    return res.status(200).json({
      success: true,
      data: comments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching comments:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
};

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { content, userId, username } = req.body;
    
    if (!isValidObjectId(leadId) || !isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }
    
    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }

    const newComment = new Comment({
      userId,
      username,
      leadId,
      content,
      replies: []
    });

    const savedComment = await newComment.save();

    return res.status(201).json({
      success: true,
      data: savedComment
    });
  } catch (err) {
    console.error('Error creating comment:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content, userId } = req.body;
    
    if (!isValidObjectId(commentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid comment ID format'
      });
    }
    
    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    // Check if the user is the comment owner
    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this comment'
      });
    }
    
    comment.content = content;
    const updatedComment = await comment.save();
    
    return res.status(200).json({
      success: true,
      data: updatedComment
    });
  } catch (err) {
    console.error('Error updating comment:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, role } = req.body;
    
    if (!isValidObjectId(commentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid comment ID format'
      });
    }
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    // Check if the user is the comment owner or an admin
    if (comment.userId.toString() !== userId.toString() && role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this comment'
      });
    }
    
    await Comment.findByIdAndDelete(commentId);
    
    return res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting comment:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
};

// Add a reply to a comment
exports.addReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content, userId, username } = req.body;
    
    if (!isValidObjectId(commentId) || !isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }
    
    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Reply content is required'
      });
    }
    
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }
    
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    const newReply = {
      userId,
      username,
      content,
      createdAt: new Date()
    };
    
    comment.replies.push(newReply);
    const updatedComment = await comment.save();
    
    return res.status(201).json({
      success: true,
      data: updatedComment.replies[updatedComment.replies.length - 1]
    });
  } catch (err) {
    console.error('Error adding reply:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
};

// Update a reply
exports.updateReply = async (req, res) => {
  try {
    const { commentId, replyId } = req.params;
    const { content, userId } = req.body;
    
    if (!isValidObjectId(commentId) || !isValidObjectId(replyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }
    
    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Reply content is required'
      });
    }
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    const replyIndex = comment.replies.findIndex(reply => 
      reply._id.toString() === replyId
    );
    
    if (replyIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Reply not found'
      });
    }
    
    // Check if the user is the reply owner
    if (comment.replies[replyIndex].userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this reply'
      });
    }
    
    comment.replies[replyIndex].content = content;
    const updatedComment = await comment.save();
    
    return res.status(200).json({
      success: true,
      data: updatedComment.replies[replyIndex]
    });
  } catch (err) {
    console.error('Error updating reply:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
};

// Delete a reply
exports.deleteReply = async (req, res) => {
  try {
    const { commentId, replyId } = req.params;
    const { userId, role } = req.body;
    
    if (!isValidObjectId(commentId) || !isValidObjectId(replyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    const replyIndex = comment.replies.findIndex(reply => 
      reply._id.toString() === replyId
    );
    
    if (replyIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Reply not found'
      });
    }
    
    // Check if the user is the reply owner or an admin
    if (comment.replies[replyIndex].userId.toString() !== userId.toString() && role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this reply'
      });
    }
    
    comment.replies.splice(replyIndex, 1);
    await comment.save();
    
    return res.status(200).json({
      success: true,
      message: 'Reply deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting reply:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
};