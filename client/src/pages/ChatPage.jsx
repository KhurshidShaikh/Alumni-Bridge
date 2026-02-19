import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/selectors/userSelectors';
import { toast } from 'sonner';
import io from 'socket.io-client';
import {
  ArrowLeft,
  Send,
  Check,
  CheckCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Sidebar from '../components/Sidebar';
import BottomBar from '../components/BottomBar';

const ChatPage = () => {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [socket, setSocket] = useState(null);

  // Use refs to maintain current values in socket handlers
  const conversationRef = useRef(null);
  const messagesRef = useRef([]);
  const currentUserRef = useRef(null);

  const navigate = useNavigate();
  const { conversationId, userId } = useParams();
  const currentUser = useSelector(selectCurrentUser);
  const messagesEndRef = useRef(null);

  // Update refs when state changes
  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // Initialize Socket.IO connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (socket) {
      // Socket already exists, just join the room
      if (conversationId) {
        console.log('🏠 Joining room with existing socket:', conversationId);
        socket.emit('joinConversation', conversationId);
      }
      return;
    }

    console.log('🔌 Initializing Socket.IO for chat...');
    const backendUrl = import.meta.env.VITE_BACKEND_URL ?? '';
    const newSocket = io(backendUrl, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setSocket(newSocket);

      // Join conversation room
      if (conversationId) {
        console.log('🏠 Joining room:', conversationId);
        newSocket.emit('joinConversation', conversationId);
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    newSocket.on('newMessage', (data) => {
      console.log('📨 New message received:', data);
      console.log('📨 Current conversation ref:', conversationRef.current?._id);
      console.log('📨 Message conversation:', data.conversationId);
      console.log('📨 Message sender:', data.message.sender._id);
      console.log('📨 Current user:', currentUser?._id);

      // Small delay to ensure local state updates happen first
      setTimeout(() => {
        // Check if message belongs to current conversation
        const currentConvId = conversationRef.current?._id;
        if (data.conversationId === currentConvId) {
          // Don't add the message if it's from the current user (already added locally)
          if (data.message.sender._id === currentUserRef.current?._id) {
            console.log('⚠️ Ignoring own message from socket (already added locally)');
            console.log('⚠️ Message sender:', data.message.sender._id);
            console.log('⚠️ Current user ref:', currentUserRef.current?._id);
            return;
          }

          console.log('✅ Message belongs to current conversation, adding...');
          setMessages(prev => {
            // Check if message already exists (more robust check)
            const exists = prev.some(msg => msg._id === data.message._id);
            if (exists) {
              console.log('⚠️ Message already exists in state, skipping');
              return prev;
            }

            console.log('✅ Adding new message to state');
            setTimeout(() => scrollToBottom(), 100);
            return [...prev, data.message];
          });
        } else {
          console.log('ℹ️ Message for different conversation, ignoring');
        }
      }, 50); // Small delay to let local state update first
    });

    // Handle read receipts
    newSocket.on('messagesRead', ({ conversationId, readBy }) => {
      console.log('📖 Messages marked as read:', { conversationId, readBy });
      const currentConvId = conversationRef.current?._id;
      if (conversationId === currentConvId) {
        setMessages(prev => prev.map(msg => {
          if (msg.sender._id === currentUser?._id && !msg.readBy.some(r => r.user === readBy)) {
            return {
              ...msg,
              readBy: [...msg.readBy, { user: readBy, readAt: new Date() }]
            };
          }
          return msg;
        }));
      }
    });

    return () => {
      if (newSocket) {
        console.log('🔌 Disconnecting socket...');
        newSocket.disconnect();
      }
    };
  }, [navigate]); // Remove socket dependency to prevent re-initialization

  // Fetch conversation and messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const backendUrl = import.meta.env.VITE_BACKEND_URL ?? '';

        let actualConversationId = conversationId;

        // If we have userId instead of conversationId, create/get conversation
        if (userId && !conversationId) {
          console.log('🔍 Getting conversation for user:', userId);
          const createConvResponse = await fetch(`${backendUrl}/api/messages/conversation/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          const createConvData = await createConvResponse.json();
          if (createConvData.success) {
            actualConversationId = createConvData.conversation._id;
            setConversation(createConvData.conversation);
            // Update URL to use conversation ID
            navigate(`/chat/${actualConversationId}`, { replace: true });
          } else {
            throw new Error('Failed to create/get conversation');
          }
        } else if (conversationId) {
          // Get conversation details
          const convResponse = await fetch(`${backendUrl}/api/messages/conversations`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          const convData = await convResponse.json();
          if (convData.success) {
            const currentConv = convData.conversations.find(c => c._id === conversationId);
            setConversation(currentConv);
          }
        }

        // Get messages if we have a conversation ID
        if (actualConversationId) {
          const msgResponse = await fetch(`${backendUrl}/api/messages/conversation/${actualConversationId}/messages`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          const msgData = await msgResponse.json();
          if (msgData.success) {
            setMessages(msgData.messages);
            setTimeout(scrollToBottom, 100);
          }
        }
      } catch (error) {
        console.error('❌ Fetch error:', error);
        toast.error('Failed to load chat');
      } finally {
        setLoading(false);
      }
    };

    if (conversationId || userId) {
      fetchData();
    }
  }, [conversationId, userId, navigate]);

  // Join socket room when conversation is loaded
  useEffect(() => {
    if (socket && conversation?._id) {
      console.log('🏠 Joining conversation room:', conversation._id);
      socket.emit('joinConversation', conversation._id);

      // Also emit markAsRead to mark messages as read
      if (currentUser?._id) {
        socket.emit('markAsRead', {
          conversationId: conversation._id,
          userId: currentUser._id
        });
      }
    }
  }, [socket, conversation, currentUser]);

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || sending || !conversation) return;

    console.log('📤 Sending message:', newMessage.trim());

    try {
      setSending(true);
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL ?? '';

      const response = await fetch(`${backendUrl}/api/messages/conversation/${conversation._id}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: newMessage.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        // Add message to local state immediately
        console.log('📤 Adding sent message to local state:', data.message._id);
        console.log('📤 Sent message sender ID:', data.message.sender._id);
        console.log('📤 Current user ID:', currentUser?._id);

        setMessages(prev => {
          // Check if message already exists to prevent duplicates
          const exists = prev.some(msg => msg._id === data.message._id);
          if (exists) {
            console.log('⚠️ Message already exists in local state, skipping');
            return prev;
          }
          console.log('✅ Adding new message to local state');
          return [...prev, data.message];
        });

        setNewMessage('');
        setTimeout(scrollToBottom, 100);
        console.log('✅ Message sent successfully');
      } else {
        console.error('❌ Send failed:', data.error);
        toast.error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('❌ Send error:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Format message time
  const formatMessageTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 poppins-regular">
        <Sidebar />
        <BottomBar />
        <div className="md:ml-64 pb-20 md:pb-0 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading chat...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 poppins-regular">
      <Sidebar />
      <BottomBar />

      <div className="md:ml-64 pb-20 md:pb-0 min-h-screen bg-white flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b px-4 py-3 flex items-center space-x-3 sticky top-0 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/messages')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {conversation && (
            <>
              <Avatar className="h-10 w-10">
                <AvatarImage src={conversation.otherParticipant?.profile?.profileUrl} />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                  {conversation.otherParticipant?.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="font-semibold text-gray-900">
                  {conversation.otherParticipant?.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {conversation.otherParticipant?.role === 'student' ? 'Student' :
                    conversation.otherParticipant?.role === 'alumni' ? 'Alumni' :
                      conversation.otherParticipant?.profile?.currentCompany || 'User'}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          ) : (
            messages.map((message, index) => {
              console.log('🔍 DEBUG - Message sender:', message.sender);
              console.log('🔍 DEBUG - Current user:', currentUser);
              console.log('🔍 DEBUG - Sender ID:', message.sender._id);
              console.log('🔍 DEBUG - Current User ID:', currentUser?._id);

              // Get current user ID from localStorage as fallback
              const token = localStorage.getItem('token');
              let fallbackUserId = null;
              if (token) {
                try {
                  const payload = JSON.parse(atob(token.split('.')[1]));
                  fallbackUserId = payload.id;
                } catch (e) {
                  console.error('Error parsing token:', e);
                }
              }

              const actualCurrentUserId = currentUser?._id || fallbackUserId;
              console.log('🔧 Actual current user ID:', actualCurrentUserId);

              // Fix the isOwn calculation - ensure proper string comparison
              const isOwn = message.sender._id?.toString() === actualCurrentUserId?.toString();

              // NOW USE REAL LOGIC: Each user sees their own messages on right
              const testIsOwn = isOwn;

              console.log('🔧 FIXED isOwn calculation:', {
                senderIdString: message.sender._id?.toString(),
                currentUserIdString: currentUser?._id?.toString(),
                isOwn: isOwn,
                testIsOwn: testIsOwn
              });
              // Check if message is read by someone other than the sender
              const isRead = message.readBy?.some(read => {
                const readUserId = read.user?._id || read.user;
                return readUserId && readUserId.toString() !== message.sender._id.toString();
              }) || false;

              console.log('📖 Read receipt check:', {
                messageId: message._id,
                readBy: message.readBy,
                isRead: isRead,
                senderId: message.sender._id
              });

              console.log('🎨 Rendering message:', {
                messageId: message._id,
                senderId: message.sender._id,
                currentUserId: currentUser?._id,
                isOwn: isOwn,
                testIsOwn: testIsOwn,
                senderName: message.sender.name,
                alignment: testIsOwn ? 'RIGHT (flex-end)' : 'LEFT (flex-start)'
              });

              return (
                <div
                  key={`${message._id}-${index}`}
                  className="w-full mb-3"
                >
                  {testIsOwn ? (
                    // Own message - Right side
                    <div className="flex justify-end">
                      <div
                        className="px-4 py-2 rounded-2xl shadow-sm bg-blue-500 text-white"
                        style={{
                          wordBreak: 'break-word',
                          maxWidth: '70%'
                        }}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-end mt-1 space-x-1 text-xs text-blue-100">
                          <span>{formatMessageTime(message.createdAt)}</span>
                          {testIsOwn && (
                            <div className="ml-1 flex items-center">
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
                  ) : (
                    // Other's message - Left side
                    <div className="flex justify-start">
                      <div
                        className="px-4 py-2 rounded-2xl shadow-sm bg-gray-200 text-gray-900"
                        style={{
                          wordBreak: 'break-word',
                          maxWidth: '70%'
                        }}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-end mt-1 space-x-1 text-xs text-gray-500">
                          <span>{formatMessageTime(message.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="rounded-full"
                disabled={sending}
              />
            </div>

            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              className="bg-blue-600 hover:bg-blue-700 rounded-full h-10 w-10 p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
