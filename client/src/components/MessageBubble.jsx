import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

const formatMessageTime = (date) => {
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const MessageBubble = ({ message, isOwn, isRead }) => {
  return (
    <div className={`w-full flex mb-3 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`px-3 py-2 rounded-2xl max-w-[70%] break-words ${
          isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'
        }`}>
        <p className="text-sm">{message.content}</p>
        <div className={`flex items-center mt-1 space-x-1 ${isOwn ? 'justify-end text-blue-100' : 'justify-end text-gray-500'}`}>
          <span className="text-xs">{formatMessageTime(message.createdAt)}</span>
          {isOwn && (
            <div className="text-xs ml-1 flex items-center">
              {isRead ? (
                <CheckCheck className="h-4 w-4 text-blue-200" title="Read" />
              ) : (
                <Check className="h-4 w-4 text-blue-300" title="Sent" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
