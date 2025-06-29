import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ChevronDown, ChevronUp, Send } from 'lucide-react';
import CommentItem from './CommentItem';

/**
 * DiscussionSection Component
 * Displays a collapsible discussion panel for a lead, including comments and replies.
 * 
 * Props:
 * - leadId: The ID of the lead for which to display the discussion/comments.
 * 
 * Features:
 * - Fetches and displays comments for the given lead.
 * - Allows users to add, like, reply to, and delete comments/replies.
 * - Supports sorting comments by newest/oldest.
 * - Shows loading and error states.
 */
function DiscussionSection({ leadId }) {
  const [isOpen, setIsOpen] = useState(true);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const commentInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && leadId) {
      fetchComments();
    }
    // only re-run when isOpen, leadId or sortOrder change
  }, [isOpen, leadId, sortOrder]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/leads/${leadId}/comments`,
        {
          params: { sort: sortOrder },
          withCredentials: true
        }
      );
      if (response.data.success) {
        setComments(response.data.data);
      } else {
        toast.error('Failed to load comments');
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  //   * Handle new comment submission.
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `/api/leads/${leadId}/comments`,
        { content: newComment },
        { withCredentials: true }
      );
      if (response.data.success) {
        setComments(prev => [response.data.data, ...prev]);
        setNewComment('');
        toast.success('Comment added successfully');
      } else {
        toast.error('Failed to add comment');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error('Failed to add comment');
    }
  };

  const handleToggleLike = async (commentId) => {
    try {
      const response = await axios.post(
        `/api/comments/${commentId}/like`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        setComments(prev =>
          prev.map(c =>
            c._id === commentId
              ? { ...c, isLiked: response.data.liked, likeCount: response.data.likeCount }
              : c
          )
        );
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      toast.error('Failed to update like');
    }
  };

  const handleReply = async (commentId, replyContent) => {
    try {
      const response = await axios.post(
        `/api/comments/${commentId}/replies`,
        { content: replyContent },
        { withCredentials: true }
      );
      if (response.data.success) {
        setComments(prev =>
          prev.map(c =>
            c._id === commentId
              ? {
                  ...c,
                  replies: [...(c.replies || []), response.data.data],
                  replyCount: (c.replyCount || 0) + 1
                }
              : c
          )
        );
        toast.success('Reply added successfully');
      }
    } catch (err) {
      console.error('Error adding reply:', err);
      toast.error('Failed to add reply');
    }
  };

  const handleDelete = async (commentId, isReply = false, parentId = null) => {
    try {
      const response = await axios.delete(
        `/api/comments/${commentId}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        if (isReply && parentId) {
          setComments(prev =>
            prev.map(c =>
              c._id === parentId
                ? {
                    ...c,
                    replies: c.replies.filter(r => r._id !== commentId),
                    replyCount: Math.max(0, (c.replyCount || 0) - 1)
                  }
                : c
            )
          );
        } else {
          setComments(prev => prev.filter(c => c._id !== commentId));
        }
        toast.success('Comment deleted successfully');
      } else {
        toast.error('Failed to delete comment');
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      toast.error('Failed to delete comment');
    }
  };

  const toggleSort = () =>
    setSortOrder(o => (o === 'newest' ? 'oldest' : 'newest'));

  return (
    <div className="bg-white rounded-lg shadow-md mb-4">
      {/* Header */}
      <div
        className="bg-[#4B7889] px-6 py-4 flex justify-between items-center rounded-t-lg cursor-pointer"
        onClick={() => setIsOpen(o => !o)}
      >
        <span className="text-white font-bold">Discussion</span>
        {isOpen ? <ChevronUp size={20} className="text-white" /> : <ChevronDown size={20} className="text-white" />}
      </div>

      {isOpen && (
        <>
          {/* Sort */}
          <div className="flex justify-between items-center p-4 border-b">
            <span className="font-semibold">Comments</span>
            <button onClick={toggleSort} className="flex items-center text-sm hover:text-blue-600">
              Sort: {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
              {sortOrder === 'newest'
                ? <ChevronDown size={16} className="ml-1" />
                : <ChevronUp size={16} className="ml-1" />}
            </button>
          </div>

          {/* New Comment */}
          <div className="p-4 border-b">
            <form onSubmit={handleSubmitComment} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                <span>S</span>
              </div>
              <div className="flex-1 relative">
                <input
                  ref={commentInputRef}
                  type="text"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Write here..."
                  className="w-full pr-12 py-2 px-3 border rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>

          {/* List */}
          <div className="overflow-y-auto max-h-[400px]">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading comments...</div>
            ) : comments.length > 0 ? (
              comments.map(c => (
                <CommentItem
                  key={c._id}
                  comment={c}
                  onToggleLike={handleToggleLike}
                  onReply={handleReply}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No comments yet. Be the first to start the discussion!
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default DiscussionSection;
