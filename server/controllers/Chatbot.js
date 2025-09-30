import geminiService from '../services/geminiService.js';

// Send message to chatbot
export const sendMessage = async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        const userId = req.userId; // From auth middleware

        // Validate input
        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                error: "Message is required"
            });
        }

        // Create unique session ID combining user ID and provided session ID
        const uniqueSessionId = `${userId}_${sessionId || 'default'}`;

        // Get response from Gemini
        const result = await geminiService.generateResponse(message.trim(), uniqueSessionId);

        if (result.success) {
            res.status(200).json({
                success: true,
                response: result.response,
                sessionId: uniqueSessionId
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error,
                fallbackResponse: result.fallbackResponse
            });
        }

    } catch (error) {
        console.error('Chatbot controller error:', error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
            fallbackResponse: "I'm currently unavailable. Please try again later or explore the platform features."
        });
    }
};

// Clear conversation history
export const clearHistory = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const userId = req.userId;

        const uniqueSessionId = `${userId}_${sessionId || 'default'}`;
        
        geminiService.clearHistory(uniqueSessionId);

        res.status(200).json({
            success: true,
            message: "Conversation history cleared"
        });

    } catch (error) {
        console.error('Clear history error:', error);
        res.status(500).json({
            success: false,
            error: "Failed to clear history"
        });
    }
};

// Get suggested questions
export const getSuggestedQuestions = async (req, res) => {
    try {
        const questions = geminiService.getSuggestedQuestions();
        
        res.status(200).json({
            success: true,
            questions
        });

    } catch (error) {
        console.error('Get suggested questions error:', error);
        res.status(500).json({
            success: false,
            error: "Failed to get suggested questions"
        });
    }
};
