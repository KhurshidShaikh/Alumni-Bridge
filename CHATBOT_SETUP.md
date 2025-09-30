# AlumniBridge AI Chatbot Setup Guide

## Overview
The AlumniBridge platform now includes an AI-powered chatbot that helps users navigate the platform, find features, and get answers about connecting with alumni. The chatbot uses Google's Gemini AI API and is integrated across all protected routes.

## Features
- **Context-Aware**: Understands AlumniBridge platform and DMCE alumni community
- **Responsive Design**: Adapts to mobile and desktop with proper bottom bar avoidance
- **Smart Positioning**: Automatically positions above mobile bottom navigation
- **Conversation Memory**: Maintains conversation history per user session
- **Suggested Questions**: Provides helpful starting questions for new users
- **Route-Specific**: Only appears on protected routes (not on landing, login, register, or admin pages)

## Setup Instructions

### 1. Install Required Dependencies

```bash
# Backend dependencies
cd server
npm install @google/generative-ai

# Frontend dependencies (if not already installed)
cd ../client
npm install sonner  # For toast notifications
```

### 2. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### 3. Configure Environment Variables

Add the following to your `server/.env` file:

```env
# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Update .env.example

Add to `server/.env.example`:

```env
# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
```

## Usage

### For Users
1. **Access**: Chatbot appears as a blue circular button in the bottom-right corner on all protected pages
2. **Mobile**: Automatically positions above the bottom navigation bar
3. **Desktop**: Positioned in bottom-right corner with proper spacing
4. **Interaction**: Click to open, type questions, use suggested questions, or clear conversation

### For Developers

#### API Endpoints
- `POST /api/chatbot/message` - Send message to chatbot
- `POST /api/chatbot/clear-history` - Clear conversation history
- `GET /api/chatbot/suggestions` - Get suggested questions

#### Chatbot Context
The chatbot is pre-configured with comprehensive knowledge about:
- AlumniBridge platform features and navigation
- DMCE alumni community specifics
- How to use jobs, connections, messaging, events, and news features
- User roles (students, alumni, admin) and their capabilities
- Getting started guide and profile completion

#### Customization
To modify the chatbot's knowledge or behavior:
1. Edit `server/services/geminiService.js`
2. Update the `ALUMNI_BRIDGE_CONTEXT` constant
3. Modify conversation parameters in the `generateResponse` method

## Technical Implementation

### Backend Architecture
- **Service Layer**: `geminiService.js` handles AI interactions
- **Controller**: `Chatbot.js` manages API endpoints
- **Routes**: `chatbotRoutes.js` defines API routes
- **Authentication**: All endpoints require valid JWT tokens

### Frontend Architecture
- **Component**: `Chatbot.jsx` provides the UI interface
- **Service**: `chatbotService.js` handles API communication
- **Integration**: Conditionally rendered in `App.jsx` based on route
- **Responsive**: Uses Tailwind CSS for mobile-first design

### Mobile Responsiveness
- Automatically detects screen size changes
- Positions above bottom navigation bar on mobile
- Adjusts chat window size for mobile screens
- Maintains proper spacing and usability

## Troubleshooting

### Common Issues

1. **Chatbot not appearing**
   - Check if you're on a protected route (not landing, login, register, or admin)
   - Ensure user is authenticated
   - Verify component is imported in App.jsx

2. **API errors**
   - Verify GEMINI_API_KEY is set correctly in .env
   - Check if API key has proper permissions
   - Ensure @google/generative-ai package is installed

3. **Mobile positioning issues**
   - Check if bottom bar height is correct (h-20)
   - Verify responsive classes are applied correctly
   - Test on different screen sizes

### Error Handling
- Graceful fallback responses when AI is unavailable
- Toast notifications for user feedback
- Conversation history management with token limits
- Automatic retry logic for failed requests

## Security Considerations
- All API endpoints require authentication
- User-specific conversation sessions
- No sensitive data stored in conversation history
- API key properly secured in environment variables

## Future Enhancements
- Voice input/output capabilities
- File upload support for questions
- Integration with platform search
- Personalized recommendations based on user profile
- Multi-language support

## Support
For issues or questions about the chatbot implementation, check:
1. Console logs for error messages
2. Network tab for API request/response details
3. Environment variable configuration
4. Gemini API quota and usage limits
