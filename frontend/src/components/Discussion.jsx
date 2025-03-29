import React, { useState } from 'react';
import { Send, ChevronDown, ChevronUp, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';

const Discussion = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const messagesPerPage = 3;

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Soham Shriram',
      content: 'I have created the sign-in page using React.js. I have added some new UI features for login button which will enhance user experience whenever they try to login.',
      timestamp: '2 hours ago',
      replies: [
        {
          id: 2,
          sender: 'John Doe',
          content: 'Great work! The new features look amazing.',
          timestamp: '1 hour ago',
        },
      ],
      showReplies: false,
    },
    {
      id: 3,
      sender: 'Alice Smith',
      content: 'The dashboard analytics are now live. Check them out and let me know your thoughts.',
      timestamp: '3 hours ago',
      replies: [],
      showReplies: false,
    },
    {
      id: 4,
      sender: 'Bob Johnson',
      content: 'Updated the user profile section with new fields as requested.',
      timestamp: '4 hours ago',
      replies: [],
      showReplies: false,
    },
    {
      id: 5,
      sender: 'Emma Davis',
      content: 'Fixed the responsive layout issues on mobile devices.',
      timestamp: '5 hours ago',
      replies: [],
      showReplies: false,
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Math.max(...messages.map((m) => m.id)) + 1,
      sender: 'Current User',
      content: newMessage,
      timestamp: 'Just now',
      replies: [],
      showReplies: false,
    };

    setMessages([message, ...messages]);
    setNewMessage('');
  };

  const handleReply = (messageId) => {
    if (!replyContent.trim()) return;

    const reply = {
      id: Math.max(...messages.flatMap((m) => m.replies?.map((r) => r.id) ?? [0])) + 1,
      sender: 'Current User',
      content: replyContent,
      timestamp: 'Just now',
    };

    setMessages(
      messages.map((message) => {
        if (message.id === messageId) {
          return {
            ...message,
            replies: [...(message.replies || []), reply],
            showReplies: true,
          };
        }
        return message;
      })
    );

    setReplyContent('');
    setReplyingTo(null);
  };

  const toggleReplies = (messageId) => {
    setMessages(
      messages.map((message) => {
        if (message.id === messageId) {
          return {
            ...message,
            showReplies: !message.showReplies,
          };
        }
        return message;
      })
    );
  };

  const totalPages = Math.ceil(messages.length / messagesPerPage);
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header Section */}
      <div className="bg-[#4B7889] px-6 py-4 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center space-x-2">
          <MessageSquare color='white' size={20} />
          <span className="text-white font-bold">Discussion</span>
        </div>
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <ChevronUp color='white' size={20} /> : <ChevronDown color='white' size={20} />}
        </button>
      </div>

      {isExpanded && (
        <div className="pt-6 px-6 pb-6">
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write your message..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Send size={20} />
              </button>
            </div>
          </form>

          <div className="space-y-6">
            {currentMessages.map((message) => (
              <div key={message.id} className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{message.sender}</span>
                    <span className="text-sm text-gray-500">{message.timestamp}</span>
                  </div>
                  <p className="text-gray-700">{message.content}</p>
                  <div className="flex space-x-4 mt-2">
                    <button
                      onClick={() => setReplyingTo(message.id)}
                      className="text-sm text-blue-500 hover:text-blue-600"
                    >
                      Reply
                    </button>
                    {message.replies && message.replies.length > 0 && (
                      <button
                        onClick={() => toggleReplies(message.id)}
                        className="text-sm text-gray-500 hover:text-gray-600"
                      >
                        {message.showReplies ? 'Hide' : 'Show'} Replies ({message.replies.length})
                      </button>
                    )}
                  </div>
                  {replyingTo === message.id && (
                    <div className="mt-4 flex space-x-2">
                      <input
                        type="text"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write your reply..."
                        className="flex-1 px-3 py-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleReply(message.id)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                      >
                        Reply
                      </button>
                    </div>
                  )}
                </div>

                {message.replies && message.showReplies && (
                  <div className="ml-8 space-y-4">
                    {message.replies.map((reply) => (
                      <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{reply.sender}</span>
                          <span className="text-sm text-gray-500">{reply.timestamp}</span>
                        </div>
                        <p className="text-gray-700">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {messages.length > messagesPerPage && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft size={20} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Discussion;
