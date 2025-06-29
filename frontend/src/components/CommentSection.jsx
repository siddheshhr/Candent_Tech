import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

/**
 * Reply Component
 * Renders a single reply with edit and delete options for the owner or admin.
 * Props:
 * - reply: The reply object.
 * - commentId: ID of the parent comment.
 * - currentUser: The currently logged-in user.
 * - onDelete: Function to delete a reply.
 * - fetchComments: Function to refresh the comments list after update/delete.
 */
const Reply = ({ reply, commentId, currentUser, onDelete, fetchComments }) => {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.content);
  
    // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Handle reply edit submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editContent.trim()) return;
    
    try {
      const response = await axios.put(
        `http://localhost:3000/api/comments/comments/${commentId}/replies/${reply._id}`,
        {
          content: editContent,
          userId: currentUser._id
        },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setEditing(false);
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error('Error updating reply:', error);
      alert('Failed to update reply');
    }
  };

  return (
    <div className="border-l-2 border-gray-200 pl-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="font-medium">{reply.username}</div>
          <div className="text-gray-500 text-sm ml-2">{formatDate(reply.createdAt)}</div>
        </div>
        {/* Show edit/delete for reply owner or admin */}
        {currentUser && (currentUser._id === reply.userId || currentUser.role === 'admin') && (
          <div className="flex space-x-2">
            {currentUser._id === reply.userId && (
              <button 
                onClick={() => {
                  setEditing(true);
                  setEditContent(reply.content);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Edit
              </button>
            )}
            <button 
              onClick={() => onDelete(reply._id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      {/* Edit reply form */}
      {editing ? (
        <form onSubmit={handleEditSubmit} className="mt-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"
          />
          <div className="flex justify-end mt-2 space-x-2">
            <button 
              type="button"
              onClick={() => setEditing(false)}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-1">{reply.content}</div>
      )}
    </div>
  );
};

/**
 * Comment Component
 * Renders a single comment with edit, delete, and reply functionality.
 * Also renders its replies using the Reply component.
 * Props:
 * - comment: The comment object.
 * - currentUser: The currently logged-in user.
 * - onDelete: Function to delete a comment.
 * - fetchComments: Function to refresh the comments list after update/delete.
 */
const Comment = ({ comment, currentUser, onDelete, fetchComments }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Handle comment edit submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editContent.trim()) return;
    
    try {
      const response = await axios.put(
        `http://localhost:3000/api/comments/comments/${comment._id}`,
        {
          content: editContent,
          userId: currentUser._id
        },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setEditing(false);
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update comment');
    }
  };
  
    // Handle reply submission
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    
    if (!replyContent.trim()) return;
    
    try {
      const response = await axios.post(
        `http://localhost:3000/api/comments/comments/${comment._id}/replies`,
        {
          content: replyContent,
          userId: currentUser._id,
          username: currentUser.username
        },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setReplyContent('');
        setShowReplyForm(false);
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error('Error posting reply:', error);
      alert('Failed to post reply');
    }
  };

  // Handle reply deletion
  const handleDeleteReply = async (replyId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/comments/comments/${comment._id}/replies/${replyId}`,
        { 
          data: { userId: currentUser._id, role: currentUser.role },
          withCredentials: true 
        }
      );
      
      if (response.data.success) {
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
      alert('Failed to delete reply');
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="font-medium">{comment.username}</div>
          <div className="text-gray-500 text-sm ml-2">{formatDate(comment.createdAt)}</div>
        </div>
         {/* Show edit/delete for comment owner or admin */}
        {currentUser && (currentUser._id === comment.userId || currentUser.role === 'admin') && (
          <div className="flex space-x-2">
            {currentUser._id === comment.userId && (
              <button 
                onClick={() => {
                  setEditing(true);
                  setEditContent(comment.content);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Edit
              </button>
            )}
            <button 
              onClick={() => onDelete(comment._id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      {/* Edit comment form */}
      {editing ? (
        <form onSubmit={handleEditSubmit} className="mt-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
          <div className="flex justify-end mt-2 space-x-2">
            <button 
              type="button"
              onClick={() => setEditing(false)}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-2">{comment.content}</div>
      )}
      
       {/* Reply button and form */}
      <div className="mt-2 flex">
        <button 
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Reply
        </button>
      </div>
      
      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="mt-3 ml-6">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"
          />
          <div className="flex justify-end mt-2 space-x-2">
            <button 
              type="button"
              onClick={() => setShowReplyForm(false)}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              disabled={!replyContent.trim()}
            >
              Post Reply
            </button>
          </div>
        </form>
      )}
      
      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 ml-6 space-y-3">
          {comment.replies.map((reply) => (
            <Reply 
              key={reply._id} 
              reply={reply} 
              commentId={comment._id}
              currentUser={currentUser}
              onDelete={handleDeleteReply}
              fetchComments={fetchComments}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * CommentSection Component
 * Main component to display, add, edit, and delete comments and replies for a lead.
 * Handles pagination, sorting, and authentication checks.
 * Props:
 * - leadId: The ID of the lead for which to display comments.
 */
function CommentSection({ leadId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [sort, setSort] = useState('newest');
  
  // Get current user from Redux store
  const { currentUser } = useSelector((state) => state.user) || { currentUser: null };

  // For debugging - remove in production
  useEffect(() => {
    console.log("CommentSection mounted with leadId:", leadId);
    console.log("Current user:", currentUser);
  }, [leadId, currentUser]);

  useEffect(() => {
    if (leadId) {
      fetchComments();
    }
  }, [leadId, pagination.page, sort]);

  // Fetch comments from API
  const fetchComments = async () => {
    if (!leadId) {
      console.log("No lead ID provided to CommentSection");
      return;
    }
    
    try {
      setLoading(true);
      console.log(`Fetching comments for lead: ${leadId}`);
      
      const response = await axios.get(
        `http://localhost:3000/api/comments/leads/${leadId}/comments?page=${pagination.page}&limit=${pagination.limit}&sort=${sort}`,
        { withCredentials: true }
      );
      
      console.log("Comments API response:", response.data);
      
      if (response.data.success) {
        setComments(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

    // Handle new comment submission
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim() || !currentUser) return;
    
    try {
      const response = await axios.post(
        `http://localhost:3000/api/comments/leads/${leadId}/comments`,
        {
          content: newComment,
          userId: currentUser._id,
          username: currentUser.username
        },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setNewComment('');
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!currentUser) return;
    
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/comments/comments/${commentId}`,
        { 
          data: { userId: currentUser._id, role: currentUser.role },
          withCredentials: true 
        }
      );
      
      if (response.data.success) {
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  // Handle pagination
  const changePage = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination({...pagination, page: newPage});
    }
  };

  // Added more detailed rendering
  console.log("Rendering CommentSection with leadId:", leadId);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Discussion</h2>
      
      {/* Comment sorting */}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <label htmlFor="sort" className="mr-2 text-sm">Sort by:</label>
          <select 
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
        <div className="text-sm text-gray-500">
          {pagination.total} {pagination.total === 1 ? 'comment' : 'comments'}
        </div>
      </div>
      
      {/* New comment form */}
      {currentUser ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
          <div className="flex justify-end mt-2">
            <button 
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              disabled={!newComment.trim()}
            >
              Post Comment
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded text-center">
          Please log in to add comments.
        </div>
      )}
      
      {/* Comments list */}
      {loading ? (
        <div className="text-center py-4">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Comment 
              key={comment._id} 
              comment={comment} 
              currentUser={currentUser}
              onDelete={handleDeleteComment}
              fetchComments={fetchComments}
            />
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => changePage(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-1 mr-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => changePage(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-3 py-1 ml-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default CommentSection;