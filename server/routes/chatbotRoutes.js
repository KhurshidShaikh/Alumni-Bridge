import express from 'express';
import { sendMessage, clearHistory, getSuggestedQuestions } from '../controllers/Chatbot.js';
import { AuthUser } from '../middlewere/userAuth.js';

const router = express.Router();

// All chatbot routes require authentication
router.use(AuthUser);

// Send message to chatbot
router.post('/message', sendMessage);

// Clear conversation history
router.post('/clear-history', clearHistory);

// Get suggested questions
router.get('/suggestions', getSuggestedQuestions);

export default router;
