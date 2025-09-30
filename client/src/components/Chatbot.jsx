import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { chatbotService } from '../services/chatbotService';
import { toast } from 'sonner';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(`session_${Date.now()}`);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load suggested questions on first open
  useEffect(() => {
    if (isOpen && suggestedQuestions.length === 0) {
      loadSuggestedQuestions();
    }
  }, [isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const loadSuggestedQuestions = async () => {
    try {
      const result = await chatbotService.getSuggestedQuestions();
      if (result.success) {
        setSuggestedQuestions(result.questions);
      }
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: messageText.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const result = await chatbotService.sendMessage(messageText.trim(), sessionId);
      
      const botMessage = {
        id: Date.now() + 1,
        text: result.success ? result.response : (result.fallbackResponse || result.error),
        sender: 'bot',
        timestamp: new Date(),
        isError: !result.success
      };

      setMessages(prev => [...prev, botMessage]);

      if (!result.success) {
        toast.error('AI assistant is having trouble. Please try again.');
      }

    } catch (error) {
      console.error('Send message error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm currently unavailable. Please try again later or explore the platform features.",
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question) => {
    sendMessage(question);
  };

  const clearConversation = async () => {
    try {
      await chatbotService.clearHistory(sessionId);
      setMessages([]);
      setShowSuggestions(true);
      toast.success('Conversation cleared');
    } catch (error) {
      console.error('Clear conversation error:', error);
      toast.error('Failed to clear conversation');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate position to avoid bottom bar on mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getChatbotPosition = () => {
    if (isMobile) {
      return 'bottom-24'; // Above the bottom bar (h-20 + some margin)
    }
    return 'bottom-6';
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className={`fixed ${getChatbotPosition()} right-4 md:right-6 z-50 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg transition-all duration-300 hover:scale-110`}
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <Card className={`fixed ${getChatbotPosition()} right-4 md:right-6 z-50 w-80 md:w-96 h-92 md:h-[500px] shadow-2xl transition-all duration-300 flex flex-col overflow-hidden p-0`}>
          {/* Header */}
          <CardHeader className="p-4 bg-blue-600 text-white flex-shrink-0 m-0 rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-sm md:text-base truncate">
                <Bot className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">AlumniBridge Assistant</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-white hover:bg-blue-700 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Chat Content */}
          <CardContent className="p-0 flex flex-col flex-1 min-h-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Welcome Message */}
                {messages.length === 0 && (
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg p-3 text-sm">
                        <p>Hi! I'm your AlumniBridge assistant. I can help you navigate the platform, find features, and answer questions about connecting with alumni.</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 block">{formatTime(new Date())}</span>
                    </div>
                  </div>
                )}

                {/* Messages */}
                {messages.map((message) => (
                  <div key={message.id} className={`flex items-start space-x-2 ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-blue-600' 
                        : message.isError 
                          ? 'bg-red-100' 
                          : 'bg-blue-100'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className={`h-4 w-4 ${message.isError ? 'text-red-600' : 'text-blue-600'}`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`rounded-lg p-3 text-sm ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white ml-auto max-w-xs'
                          : message.isError
                            ? 'bg-red-50 border border-red-200'
                            : 'bg-gray-100'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.text}</p>
                      </div>
                      <span className={`text-xs text-gray-500 mt-1 block ${
                        message.sender === 'user' ? 'text-right' : ''
                      }`}>
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg p-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Suggested Questions */}
                {showSuggestions && messages.length === 0 && suggestedQuestions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-medium">Suggested questions:</p>
                    <div className="space-y-2">
                      {suggestedQuestions.slice(0, 3).map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestedQuestion(question)}
                          className="w-full text-left justify-start text-xs h-auto py-2 px-3 whitespace-normal"
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t p-4 flex-shrink-0 bg-white">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about AlumniBridge..."
                      className="pr-12 text-sm"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={() => sendMessage()}
                      disabled={!inputMessage.trim() || isLoading}
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  {messages.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearConversation}
                      className="h-10 w-10 p-0"
                      title="Clear conversation"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
        </Card>
      )}
    </>
  );
};

export default Chatbot;
