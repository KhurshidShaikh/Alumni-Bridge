import express from 'express';
import { AuthUser } from '../middlewere/userAuth.js';
import {
    getOrCreateConversation,
    getUserConversations,
    getConversationMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    searchMessages
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
