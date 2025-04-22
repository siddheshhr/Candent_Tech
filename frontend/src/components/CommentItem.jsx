import React, { useState } from 'react';
import { ThumbsUp, Clock, MessageCircle, Send, Trash2, MoreHorizontal } from 'lucide-react';
import TimeAgo from './TimeAgo';

function CommentItem({ comment, onToggleLike, onReply, onDelete }) {
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onReply(comment._id, replyContent);
      setReplyContent('');
      setIsReplying(false);
    }
  };

  return (
    <div className="p-4 border-b last:border-b-0">
      {/* Comment Header */}
      <div className="flex justify-between">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
            <span className="text-sm font-semibold">
              {comment.user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <div className="font-semibold text-sm">{comment.user?.name || 'User'}</div>
            <div className="text-xs text-gray-500">
              <TimeAgo date={comment.createdAt} />
            </div>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-500 hover:text-gray-700"
          >
            <MoreHorizontal size={16} />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-md py-1 z-10 w-32">
              <button
                onClick={() => {
                  onDelete(comment._id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
              >
                <Trash2 size={14} className="mr-2" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comment Content */}
      <div className="text-sm mb-3 pl-10">
        {comment.content}
      </div>

      {/* Comment Actions */}
      <div className="flex items-center space-x-4 text-sm text-gray-500 pl-10">
        <button 
          onClick={() => onToggleLike(comment._id)}
          className={`flex items-center space-x-1 ${comment.isLiked ? 'text-blue-500' : ''}`}
        >
          <ThumbsUp size={14} />
          <span>{comment.likeCount || 0}</span>
        </button>
        
        <button 
          onClick={() => setIsReplying(!isReplying)}
          className="flex items-center space-x-1"
        >
          <MessageCircle size={14} />
          <span>Reply</span>
        </button>
        
        {comment.replyCount > 0 && (
          <button 
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center space-x-1 text-blue-500"
          >
            <span>Show Replies ({comment.replyCount})</span>
          </button>
        )}
      </div>

      {/* Reply Input */}
      {isReplying && (
        <form onSubmit={handleReplySubmit} className="flex gap-2 mt-3 pl-10">
          <div className="flex-1 relative">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="w-full pr-10 py-1 px-3 text-sm border rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500"
            >
              <Send size={14} />
            </button>
          </div>
        </form>
      )}

      {/* Replies */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 pl-10 space-y-3">
          {comment.replies.map((reply) => (
            <div key={reply._id} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between">
                <div className="flex items-center mb-1">
                  <div className="w-6 h-6 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
                    <span className="text-xs font-semibold">
                      {reply.user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-xs">{reply.user?.name || 'User'}</div>
                    <div className="text-xs text-gray-500">
                      <TimeAgo date={reply.createdAt} />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onDelete(reply._id, true, comment._id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="text-sm mt-1">{reply.content}</div>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <button 
                  onClick={() => onToggleLike(reply._id)}
                  className={`flex items-center space-x-1 ${reply.isLiked ? 'text-blue-500' : ''}`}
                >
                  <ThumbsUp size={12} />
                  <span>{reply.likeCount || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentItem;