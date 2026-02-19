import { API_BASE_URL } from '../config/api.js';

class ChatbotService {
    async sendMessage(message, sessionId = null) {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`${API_BASE_URL}/api/chatbot/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    message,
                    sessionId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send message');
            }

            return {
                success: true,
                response: data.response,
                sessionId: data.sessionId,
                fallbackResponse: data.fallbackResponse
            };

        } catch (error) {
            console.error('Chatbot service error:', error);
            return {
                success: false,
                error: error.message,
                fallbackResponse: "I'm currently unavailable. Please try again later or explore the platform features."
            };
        }
    }

    async clearHistory(sessionId = null) {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`${API_BASE_URL}/api/chatbot/clear-history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ sessionId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to clear history');
            }

            return {
                success: true,
                message: data.message
            };

        } catch (error) {
            console.error('Clear history error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getSuggestedQuestions() {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`${API_BASE_URL}/api/chatbot/suggestions`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get suggestions');
            }

            return {
                success: true,
                questions: data.questions
            };

        } catch (error) {
            console.error('Get suggestions error:', error);
            return {
                success: false,
                error: error.message,
                questions: [
                    "How do I find job opportunities?",
                    "How can I connect with alumni?",
                    "What features are available?",
                    "How do I complete my profile?",
                    "Where can I find events?"
                ]
            };
        }
    }
}

export const chatbotService = new ChatbotService();
