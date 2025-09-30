import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// AlumniBridge context for the chatbot
const ALUMNI_BRIDGE_CONTEXT = `
You are an AI assistant for AlumniBridge, a comprehensive alumni networking and engagement platform specifically designed for DMCE (Datta Meghe College of Engineering) alumni community.

ABOUT ALUMNI BRIDGE:
AlumniBridge is a modern, college-specific platform that connects students, alumni, and administrators. It serves as a central hub for networking, mentorship, career opportunities, and community engagement.

KEY FEATURES & NAVIGATION:
1. **Alumni Directory** (/alumni) - Browse and connect with verified alumni, search by batch, branch, company, or location
2. **Job Board** (/jobs) - Alumni can post job opportunities, students can apply with resumes
3. **News & Stories** (/news) - Social feed for sharing success stories, achievements, and college updates
4. **Messaging** (/messages) - Real-time chat system for connected users
5. **Connections** (/connections) - Professional networking with connection requests (LinkedIn-style)
6. **Events** (/events) - College events, alumni meetups, career fairs
7. **Profile Management** (/profile) - Complete profile setup with academic and professional details

USER ROLES:
- **Students**: Explore alumni, find jobs, seek mentorship, build connections
- **Alumni**: Share opportunities, mentor students, post jobs, network with peers
- **Admin**: Manage users, moderate content, send announcements, track analytics

HOW TO USE THE PLATFORM:
- **For Job Opportunities**: Visit the Jobs page to browse openings or post new positions (alumni only)
- **For Networking**: Use Alumni Directory to find professionals, send connection requests
- **For Mentorship**: Connect with alumni in your field through the directory and messaging
- **For Updates**: Check News & Stories for latest college news and alumni achievements
- **For Events**: Visit Events page for upcoming college activities and alumni meetups

GETTING STARTED:
1. Complete your profile with academic and professional details
2. Verify your account (for alumni)
3. Start connecting with relevant professionals
4. Explore job opportunities or post openings
5. Engage with the community through news and events

Always provide helpful, accurate information about the platform. Guide users to the appropriate pages for their needs. Be friendly, professional, and supportive of the DMCE alumni community.
`;

class GeminiService {
    constructor() {
        // Initialize with fallback models
        this.modelNames = [
            "gemini-2.5-flash",
            "gemini-1.5-flash", 
            "gemini-pro",
            "models/gemini-pro"
        ];
        this.currentModelIndex = 0;
        this.model = this.initializeModel();
        this.conversationHistory = new Map(); // Store conversation history by session
    }

    initializeModel() {
        try {
            return genAI.getGenerativeModel({ 
                model: this.modelNames[this.currentModelIndex],
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.8,
                    topK: 40,
                    maxOutputTokens: 1000,
                }
            });
        } catch (error) {
            console.error(`Failed to initialize model ${this.modelNames[this.currentModelIndex]}:`, error);
            return null;
        }
    }

    async tryNextModel() {
        this.currentModelIndex++;
        if (this.currentModelIndex < this.modelNames.length) {
            console.log(`Trying next model: ${this.modelNames[this.currentModelIndex]}`);
            this.model = this.initializeModel();
            return true;
        }
        return false;
    }

    async generateResponse(message, sessionId = 'default') {
        let attempts = 0;
        const maxAttempts = this.modelNames.length;

        while (attempts < maxAttempts) {
            try {
                if (!this.model) {
                    throw new Error('Model not initialized');
                }

                let history = this.conversationHistory.get(sessionId) || [];
                
                // Add context about AlumniBridge at the start of new conversations
                if (history.length === 0) {
                    history.push({
                        role: 'user',
                        parts: [{ text: ALUMNI_BRIDGE_CONTEXT }]
                    });
                    history.push({
                        role: 'model',
                        parts: [{ text: 'I understand. I\'m ready to help users with AlumniBridge platform questions and navigation.' }]
                    });
                }

                // Start a chat session with history (config already set in constructor)
                const chat = this.model.startChat({
                    history: history
                });

                // Send the user message
                const result = await chat.sendMessage(message);
                const response = await result.response;
                const text = response.text();

                // Update conversation history
                history.push({
                    role: 'user',
                    parts: [{ text: message }]
                });
                history.push({
                    role: 'model',
                    parts: [{ text: text }]
                });

                // Keep only last 20 messages to prevent token limit issues
                if (history.length > 20) {
                    history = history.slice(-20);
                }

                this.conversationHistory.set(sessionId, history);

                return {
                    success: true,
                    response: text,
                    sessionId: sessionId
                };

            } catch (error) {
                console.error(`Gemini API Error with model ${this.modelNames[this.currentModelIndex]}:`, error);
                
                // Try next model if available
                attempts++;
                if (attempts < maxAttempts && await this.tryNextModel()) {
                    console.log(`Retrying with model ${this.modelNames[this.currentModelIndex]}`);
                    continue;
                }

                // Handle specific error cases
                if (error.message?.includes('API key')) {
                    return {
                        success: false,
                        error: 'AI service configuration error. Please contact support.',
                        fallbackResponse: 'I\'m currently unavailable. For immediate help, please explore the platform or contact support.'
                    };
                }

                return {
                    success: false,
                    error: 'Failed to generate response',
                    fallbackResponse: 'I\'m having trouble responding right now. Try asking about specific features like Jobs, Alumni Directory, or Connections.'
                };
            }
        }

        // If all models failed
        return {
            success: false,
            error: 'All AI models unavailable',
            fallbackResponse: 'I\'m currently unavailable. Please explore the platform features or contact support for assistance.'
        };
    }

    // Clear conversation history for a session
    clearHistory(sessionId = 'default') {
        this.conversationHistory.delete(sessionId);
    }

    // Get suggested questions for new users
    getSuggestedQuestions() {
        return [
            "How do I find job opportunities on AlumniBridge?",
            "How can I connect with alumni in my field?",
            "What features are available for students?",
            "How do I complete my profile?",
            "Where can I find college events and news?",
            "How does the messaging system work?"
        ];
    }
}

export default new GeminiService();
