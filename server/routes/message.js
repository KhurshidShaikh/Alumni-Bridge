import express from 'express';
import { AuthUser } from '../middlewere/userAuth.js';
import { AuthAdmin } from '../middlewere/AdminAuth.js';
import {
    getOrCreateConversation,
    getUserConversations,
    getConversationMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    searchMessages,
    adminGetOrCreateConversation,
    adminSendBulkMessage,
    getAdminConversations,
    adminSendMessage
} from '../controllers/Message.js';

export const messageRoute = express.Router();

// Get or create conversation with another user
messageRoute.get('/conversation/:participantId', AuthUser, getOrCreateConversation);

// Get all conversations for current user
messageRoute.get('/conversations', AuthUser, getUserConversations);

// Get messages in a specific conversation
messageRoute.get('/conversation/:conversationId/messages', AuthUser, getConversationMessages);

// Send a message in a conversation
messageRoute.post('/conversation/:conversationId/send', AuthUser, sendMessage);

// Edit a message
messageRoute.put('/message/:messageId/edit', AuthUser, editMessage);

// Delete a message
messageRoute.delete('/message/:messageId', AuthUser, deleteMessage);

// Search messages
messageRoute.get('/search', AuthUser, searchMessages);

// Admin messaging routes
// Admin: Get or create conversation with any user (bypasses connection requirement)
messageRoute.get('/admin/conversation/:participantId', AuthAdmin, adminGetOrCreateConversation);

// Admin: Get all admin conversations
messageRoute.get('/admin/conversations', AuthAdmin, getAdminConversations);

// Admin: Send bulk messages to multiple alumni
messageRoute.post('/admin/send-bulk', AuthAdmin, adminSendBulkMessage);

// Admin: Send individual message (bypasses connection requirement)
messageRoute.post('/admin/conversation/:conversationId/send', AuthAdmin, adminSendMessage);
