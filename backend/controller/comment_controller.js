const Comment = require('../models/Comment');
const Lead = require('../models/Lead');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get all comments for a lead
exports.getCommentsByLeadId = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { sort = 'newest' } = req.query;
    
    let sortOptions = {};
    if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    }
    
    const comments = await Comment.find({ 
      lead: leadId,
      parentComment: null // Only get top-level comments
    })
      .sort(sortOptions)
      .populate('user', 'name profilePicture')
      .populate({
        path: 'replies',
        options: { sort: { createdAt: 1 } },
        populate: {
          path: 'user',
          select: 'name profilePicture'
        }
      });

    // Count replies for each comment
    const commentsWithCounts = await Promise.all(comments.map(async (comment) => {
      const replyCount = await Comment.countDocuments({ parentComment: comment._id });
      const likeCount = comment.likes.length;
      const isLiked = comment.likes.includes(req.user._id);
      
      return {
        ...comment._doc,
        replyCount,
        likeCount,
        isLiked
      };
    }));

    return res.status(200).json({
      success: true,
      data: commentsWithCounts
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching comments",
      error: error.message
    });
  }
};

// Create a new comment
exports.createComment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { leadId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;
    
    // Check if lead exists
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }
    
    // Create new comment
    const newComment = new Comment({
      lead: leadId,
      user: userId,
      content,
      createdAt: new Date()
    });
    
    await newComment.save({ session });
    
    // Populate user info
    const populatedComment = await Comment.findById(newComment._id)
      .populate('user', 'name profilePicture')
      .session(session);
    
    await session.commitTransaction();
    session.endSession();
    
    return res.status(201).json({
      success: true,
      data: {
        ...populatedComment._doc,
        replyCount: 0,
        likeCount: 0,
        isLiked: false
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error("Error creating comment:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating comment",
      error: error.message
    });
  }
};

// Reply to a comment
exports.replyToComment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;
    
    // Check if parent comment exists
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({
        success: false,
        message: "Parent comment not found"
      });
    }
    
    // Create reply
    const reply = new Comment({
      lead: parentComment.lead,
      user: userId,
      content,
      parentComment: commentId,
      createdAt: new Date()
    });
    
    await reply.save({ session });
    
    // Add reply to parent comment's replies array
    parentComment.replies.push(reply._id);
    await parentComment.save({ session });
    
    // Populate user info
    const populatedReply = await Comment.findById(reply._id)
      .populate('user', 'name profilePicture')
      .session(session);
    
    await session.commitTransaction();
    session.endSession();
    
    return res.status(201).json({
      success: true,
      data: populatedReply
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error("Error creating reply:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating reply",
      error: error.message
    });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { commentId } = req.params;
    const userId = req.user._id;
    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }
    
    // Check if user is allowed to delete this comment
    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment"
      });
    }
    
    // If this is a parent comment, delete all replies
    if (!comment.parentComment) {
      await Comment.deleteMany({ parentComment: commentId }, { session });
    } else {
      // If this is a reply, remove it from parent's replies array
      await Comment.updateOne(
        { _id: comment.parentComment },
        { $pull: { replies: commentId } },
        { session }
      );
    }
    
    // Delete the comment itself
    await Comment.findByIdAndDelete(commentId, { session });
    
    await session.commitTransaction();
    session.endSession();
    
    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully"
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error("Error deleting comment:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting comment",
      error: error.message
    });
  }
};

// Toggle like on a comment
exports.toggleLike = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;
    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }
    
    // Check if user already liked this comment
    const likeIndex = comment.likes.indexOf(userId);
    
    if (likeIndex === -1) {
      // Add like
      comment.likes.push(userId);
      await comment.save();
      
      return res.status(200).json({
        success: true,
        liked: true,
        likeCount: comment.likes.length
      });
    } else {
      // Remove like
      comment.likes.splice(likeIndex, 1);
      await comment.save();
      
      return res.status(200).json({
        success: true,
        liked: false,
        likeCount: comment.likes.length
      });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return res.status(500).json({
      success: false,
      message: "Error toggling like",
      error: error.message
    });
  }
};

// Get replies for a comment
exports.getReplies = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }
    
    const replies = await Comment.find({ parentComment: commentId })
      .sort({ createdAt: 1 })
      .populate('user', 'name profilePicture');
    
    // Add like info to replies
    const repliesWithLikes = replies.map(reply => {
      const isLiked = reply.likes.includes(req.user._id);
      return {
        ...reply._doc,
        likeCount: reply.likes.length,
        isLiked
      };
    });
    
    return res.status(200).json({
      success: true,
      data: repliesWithLikes
    });
  } catch (error) {
    console.error("Error fetching replies:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching replies",
      error: error.message
    });
  }
};