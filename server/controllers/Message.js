import { Conversation, Message } from '../models/messageModel.js';
import { Connection } from '../models/connectionModel.js';
import { getIO } from '../config/socket.js';
import { userModel } from '../models/userModel.js';
import mongoose from 'mongoose';

// Get or create conversation between two users
export const getOrCreateConversation = async (req, res) => {
    try {
        const userId = req.userId;
        const { participantId } = req.params;

        // Validate participant ID
        if (!mongoose.Types.ObjectId.isValid(participantId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid participant ID"
            });
        }

        // Check if users are connected
        const connection = await Connection.findOne({
            $or: [
                { user1: userId, user2: participantId },
                { user1: participantId, user2: userId }
            ]
        });

        if (!connection) {
            return res.status(403).json({
                success: false,
                error: "You can only message connected users"
            });
        }

        // Sort participants to ensure consistent conversation lookup
        const participants = [userId, participantId].sort();

        // Find existing conversation or create new one
        let conversation = await Conversation.findOne({
            participants: { $all: participants, $size: 2 }
        }).populate('participants', 'name profile.profileUrl')
          .populate('lastMessage');

        if (!conversation) {
            conversation = new Conversation({
                participants: participants
            });
            await conversation.save();
            await conversation.populate('participants', 'name profile.profileUrl');
        }

        res.status(200).json({
            success: true,
            conversation
        });

    } catch (error) {
        console.error('Get/Create conversation error:', error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Get all conversations for a user
export const getUserConversations = async (req, res) => {
    try {
        const userId = req.userId;
        const { page = 1, limit = 20 } = req.query;

        const skip = (page - 1) * limit;

        const conversations = await Conversation.find({
            participants: userId
        })
        .populate('participants', 'name profile.profileUrl role')
        .populate({
            path: 'lastMessage',
            populate: {
                path: 'sender',
                select: 'name'
            }
        })
        .sort({ lastMessageTime: -1 })
        .skip(skip)
        .limit(parseInt(limit));

        // Add unread count for current user
        const conversationsWithUnread = conversations.map(conv => {
            const unreadCount = conv.unreadCount.get(userId.toString()) || 0;
            const otherParticipant = conv.participants.find(p => p._id.toString() !== userId.toString());
            
            return {
                ...conv.toObject(),
                unreadCount,
                otherParticipant
            };
        });

        const totalCount = await Conversation.countDocuments({
            participants: userId
        });

        res.status(200).json({
            success: true,
            conversations: conversationsWithUnread,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                hasNextPage: page * limit < totalCount,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Get messages in a conversation
export const getConversationMessages = async (req, res) => {
    try {
        const userId = req.userId;
        const { conversationId } = req.params;
        const { page = 1, limit = 50 } = req.query;

        // Validate conversation ID
        if (!mongoose.Types.ObjectId.isValid(conversationId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid conversation ID"
            });
        }

        // Check if user is participant in conversation
        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: userId
        });

        if (!conversation) {
            return res.status(403).json({
                success: false,
                error: "Access denied to this conversation"
            });
        }

        const skip = (page - 1) * limit;

        const messages = await Message.find({
            conversation: conversationId,
            isDeleted: false
        })
        .populate('sender', 'name profile.profileUrl')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

        // Mark messages as read by current user
        const unreadMessages = messages.filter(msg => 
            msg.sender._id.toString() !== userId.toString() && 
            !msg.isReadBy(userId)
        );

        if (unreadMessages.length > 0) {
            await Promise.all(
                unreadMessages.map(msg => msg.markAsRead(userId))
            );

            // Update conversation unread count with retry mechanism
            try {
                await Conversation.updateOne(
                    { _id: conversationId },
                    { $set: { [`unreadCount.${userId.toString()}`]: 0 } }
                );
            } catch (error) {
                console.error('Error updating unread count:', error);
                // Don't fail the entire request if unread count update fails
            }
        }

        const totalCount = await Message.countDocuments({
            conversation: conversationId,
            isDeleted: false
        });

        res.status(200).json({
            success: true,
            messages: messages.reverse(), // Reverse to show oldest first
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                hasNextPage: page * limit < totalCount,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Send a message
export const sendMessage = async (req, res) => {
    try {
        const userId = req.userId;
        const { conversationId } = req.params;
        const { content } = req.body;
        const messageType = 'text'; // Only allow text messages for now

        // Validate input
        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: "Message content is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(conversationId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid conversation ID"
            });
        }

        // Check if user is participant in conversation
        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: userId
        });

        if (!conversation) {
            return res.status(403).json({
                success: false,
                error: "Access denied to this conversation"
            });
        }

        // Create new message
        const message = new Message({
            conversation: conversationId,
            sender: userId,
            content: content.trim(),
            messageType
        });

        await message.save();
        await message.populate('sender', 'name profile.profileUrl');

        // Update unread count for other participant
        const otherParticipant = conversation.participants.find(
            p => p.toString() !== userId.toString()
        );
        
        if (otherParticipant) {
            try {
                await Conversation.updateOne(
                    { _id: conversationId },
                    { 
                        $inc: { [`unreadCount.${otherParticipant.toString()}`]: 1 },
                        $set: { 
                            lastMessage: message._id,
                            lastMessageTime: new Date()
                        }
                    }
                );
            } catch (error) {
                console.error('Error updating conversation:', error);
                // Don't fail the entire request if conversation update fails
            }
        }

        // Emit real-time message
        const io = getIO();
        if (io) {
            console.log(`📤 Emitting 'newMessage' to room: ${conversationId}`);
            console.log(`📤 Message ID: ${message._id}`);
            console.log(`📤 Message content: ${message.content}`);
            
            io.to(conversationId).emit('newMessage', {
                message,
                conversationId
            });
            console.log(`✅ Successfully emitted 'newMessage' to room ${conversationId}`);
        } else {
            console.error('❌ Socket.IO instance is not available.');
        }

        res.status(201).json({
            success: true,
            message
        });

    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Edit a message
export const editMessage = async (req, res) => {
    try {
        const userId = req.userId;
        const { messageId } = req.params;
        const { content } = req.body;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: "Message content is required"
            });
        }

        const message = await Message.findOne({
            _id: messageId,
            sender: userId,
            isDeleted: false
        });

        if (!message) {
            return res.status(404).json({
                success: false,
                error: "Message not found or access denied"
            });
        }

        message.content = content.trim();
        message.isEdited = true;
        message.editedAt = new Date();
        await message.save();

        await message.populate('sender', 'name profile.profileUrl');

        // Emit real-time update
        req.io?.to(message.conversation.toString()).emit('messageEdited', {
            message,
            conversationId: message.conversation
        });

        res.status(200).json({
            success: true,
            message
        });

    } catch (error) {
        console.error('Edit message error:', error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Delete a message
export const deleteMessage = async (req, res) => {
    try {
        const userId = req.userId;
        const { messageId } = req.params;

        const message = await Message.findOne({
            _id: messageId,
            sender: userId,
            isDeleted: false
        });

        if (!message) {
            return res.status(404).json({
                success: false,
                error: "Message not found or access denied"
            });
        }

        message.isDeleted = true;
        message.deletedAt = new Date();
        await message.save();

        // Emit real-time update
        req.io?.to(message.conversation.toString()).emit('messageDeleted', {
            messageId,
            conversationId: message.conversation
        });

        res.status(200).json({
            success: true,
            message: "Message deleted successfully"
        });

    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Search messages in conversations
export const searchMessages = async (req, res) => {
    try {
        const userId = req.userId;
        const { query, conversationId } = req.query;

        if (!query || query.trim().length < 2) {
            return res.status(400).json({
                success: false,
                error: "Search query must be at least 2 characters"
            });
        }

        // Build search filter
        let searchFilter = {
            content: { $regex: query.trim(), $options: 'i' },
            isDeleted: false
        };

        // If conversationId provided, search within that conversation only
        if (conversationId) {
            // Verify user has access to conversation
            const conversation = await Conversation.findOne({
                _id: conversationId,
                participants: userId
            });

            if (!conversation) {
                return res.status(403).json({
                    success: false,
                    error: "Access denied to this conversation"
                });
            }

            searchFilter.conversation = conversationId;
        } else {
            // Search across all user's conversations
            const userConversations = await Conversation.find({
                participants: userId
            }).select('_id');

            searchFilter.conversation = {
                $in: userConversations.map(conv => conv._id)
            };
        }

        const messages = await Message.find(searchFilter)
            .populate('sender', 'name profile.profileUrl')
            .populate('conversation', 'participants')
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            messages,
            count: messages.length
        });

    } catch (error) {
        console.error('Search messages error:', error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Admin messaging functions

// Admin: Get or create conversation with any user (bypasses connection requirement)
export const adminGetOrCreateConversation = async (req, res) => {
    try {
        const adminId = req.adminId.id;
        const { participantId } = req.params;

        // Validate participant ID
        if (!mongoose.Types.ObjectId.isValid(participantId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid participant ID"
            });
        }

        // Check if participant exists and is verified
        const participant = await userModel.findOne({
            _id: participantId,
            isVerified: true
        });

        if (!participant) {
            return res.status(404).json({
                success: false,
                error: "User not found or not verified"
            });
        }

        // Sort participants to ensure consistent conversation lookup
        const participants = [adminId, participantId].sort();

        // Find existing conversation or create new one
        let conversation = await Conversation.findOne({
            participants: { $all: participants, $size: 2 }
        }).populate('participants', 'name profile.profileUrl role')
          .populate('lastMessage');

        if (!conversation) {
            conversation = new Conversation({
                participants: participants
            });
            await conversation.save();
            await conversation.populate('participants', 'name profile.profileUrl role');
        }

        res.status(200).json({
            success: true,
            conversation
        });

    } catch (error) {
        console.error('Admin get/create conversation error:', error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Admin: Send bulk messages to multiple alumni
export const adminSendBulkMessage = async (req, res) => {
    try {
        const adminId = req.adminId.id;
        const { recipients, content } = req.body;

        // Validate input
        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: "Message content is required"
            });
        }

        if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Recipients list is required"
            });
        }

        // Validate all recipient IDs
        const validRecipients = recipients.filter(id => mongoose.Types.ObjectId.isValid(id));
        if (validRecipients.length !== recipients.length) {
            return res.status(400).json({
                success: false,
                error: "Some recipient IDs are invalid"
            });
        }

        // Verify all recipients exist and are verified alumni
        const verifiedRecipients = await userModel.find({
            _id: { $in: validRecipients },
            isVerified: true,
            role: 'alumni'
        }).select('_id name');

        if (verifiedRecipients.length === 0) {
            return res.status(404).json({
                success: false,
                error: "No verified alumni found in recipients list"
            });
        }

        const sentMessages = [];
        const failedRecipients = [];

        // Send message to each recipient
        for (const recipient of verifiedRecipients) {
            try {
                // Create or get conversation
                const participants = [adminId, recipient._id.toString()].sort();
                
                let conversation = await Conversation.findOne({
                    participants: { $all: participants, $size: 2 }
                });

                if (!conversation) {
                    conversation = new Conversation({
                        participants: participants
                    });
                    await conversation.save();
                }

                // Create message
                const message = new Message({
                    conversation: conversation._id,
                    sender: adminId,
                    content: content.trim(),
                    messageType: 'text' // Admin messages are always text type
                });

                await message.save();
                await message.populate('sender', 'name profile.profileUrl role');

                // Update conversation
                await Conversation.updateOne(
                    { _id: conversation._id },
                    { 
                        $inc: { [`unreadCount.${recipient._id.toString()}`]: 1 },
                        $set: { 
                            lastMessage: message._id,
                            lastMessageTime: new Date()
                        }
                    }
                );

                // Emit real-time message
                const io = getIO();
                if (io) {
                    io.to(conversation._id.toString()).emit('newMessage', {
                        message,
                        conversationId: conversation._id
                    });
                }

                sentMessages.push({
                    recipient: recipient.name,
                    messageId: message._id,
                    conversationId: conversation._id
                });

            } catch (error) {
                console.error(`Failed to send message to ${recipient.name}:`, error);
                failedRecipients.push({
                    recipient: recipient.name,
                    error: error.message
                });
            }
        }

        res.status(200).json({
            success: true,
            message: `Messages sent successfully to ${sentMessages.length} recipients`,
            sentMessages,
            failedRecipients,
            totalSent: sentMessages.length,
            totalFailed: failedRecipients.length
        });

    } catch (error) {
        console.error('Admin bulk message error:', error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Admin: Get all admin conversations
export const getAdminConversations = async (req, res) => {
    try {
        const adminId = req.adminId.id;
        const { page = 1, limit = 20 } = req.query;

        const skip = (page - 1) * limit;

        const conversations = await Conversation.find({
            participants: adminId
        })
        .populate('participants', 'name profile.profileUrl role')
        .populate({
            path: 'lastMessage',
            populate: {
                path: 'sender',
                select: 'name role'
            }
        })
        .sort({ lastMessageTime: -1 })
        .skip(skip)
        .limit(parseInt(limit));

        // Add unread count and other participant info
        const conversationsWithDetails = conversations.map(conv => {
            const unreadCount = conv.unreadCount.get(adminId.toString()) || 0;
            const otherParticipant = conv.participants.find(p => p._id.toString() !== adminId.toString());
            
            return {
                ...conv.toObject(),
                unreadCount,
                otherParticipant
            };
        });

        const totalCount = await Conversation.countDocuments({
            participants: adminId
        });

        res.status(200).json({
            success: true,
            conversations: conversationsWithDetails,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                hasNextPage: page * limit < totalCount,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error('Get admin conversations error:', error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Admin: Send individual message (bypasses connection requirement)
export const adminSendMessage = async (req, res) => {
    try {
        const adminId = req.adminId.id;
        const { conversationId } = req.params;
        const { content } = req.body;

        // Validate input
        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: "Message content is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(conversationId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid conversation ID"
            });
        }

        // Check if admin is participant in conversation
        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: adminId
        });

        if (!conversation) {
            return res.status(403).json({
                success: false,
                error: "Access denied to this conversation"
            });
        }

        // Create new message
        const message = new Message({
            conversation: conversationId,
            sender: adminId,
            content: content.trim(),
            messageType: 'text' // Admin messages are always text type
        });

        await message.save();
        await message.populate('sender', 'name profile.profileUrl role');

        // Update unread count for other participant
        const otherParticipant = conversation.participants.find(
            p => p.toString() !== adminId.toString()
        );
        
        if (otherParticipant) {
            await Conversation.updateOne(
                { _id: conversationId },
                { 
                    $inc: { [`unreadCount.${otherParticipant.toString()}`]: 1 },
                    $set: { 
                        lastMessage: message._id,
                        lastMessageTime: new Date()
                    }
                }
            );
        }

        // Emit real-time message
        const io = getIO();
        if (io) {
            io.to(conversationId).emit('newMessage', {
                message,
                conversationId
            });
        }

        res.status(201).json({
            success: true,
            message
        });

    } catch (error) {
        console.error('Admin send message error:', error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};
