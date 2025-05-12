// comment_routes.js
const express = require('express');
const router = express.Router();
const commentController = require('../controller/comment_controller.js');

// Get all comments for a lead
router.get('/leads/:leadId/comments', commentController.getCommentsByLeadId);

// Create a new comment for a lead
router.post('/leads/:leadId/comments', commentController.createComment);

// Update a comment
router.put('/comments/:commentId', commentController.updateComment);

// Delete a comment
router.delete('/comments/:commentId', commentController.deleteComment);

// Add a reply to a comment
router.post('/comments/:commentId/replies', commentController.addReply);

// Update a reply
router.put('/comments/:commentId/replies/:replyId', commentController.updateReply);

// Delete a reply
router.delete('/comments/:commentId/replies/:replyId', commentController.deleteReply);

module.exports = router;