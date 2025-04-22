const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment_controller');
const { authenticateUser } = require('../middleware/authMiddleware');

// Get all comments for a lead
router.get('/leads/:leadId/comments', authenticateUser, commentController.getCommentsByLeadId);

// Create a new comment
router.post('/leads/:leadId/comments', authenticateUser, commentController.createComment);

// Reply to a comment
router.post('/comments/:commentId/replies', authenticateUser, commentController.replyToComment);

// Delete a comment
router.delete('/comments/:commentId', authenticateUser, commentController.deleteComment);

// Like/unlike a comment
router.post('/comments/:commentId/like', authenticateUser, commentController.toggleLike);

// Get replies for a comment
router.get('/comments/:commentId/replies', authenticateUser, commentController.getReplies);

module.exports = router;