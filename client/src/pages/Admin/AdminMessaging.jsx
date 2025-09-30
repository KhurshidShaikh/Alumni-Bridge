import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Users, 
  Search, 
  Send, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  X,
  ArrowLeft,
  UserCheck,
  Mail,
  Calendar,
  Building
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AdminSidebar from '../../components/AdminSidebar';

const AdminMessaging = () => {
  const [alumni, setAlumni] = useState([]);
  const [selectedAlumni, setSelectedAlumni] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBatch, setFilterBatch] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('event'); // event, announcement, general
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [alert, setAlert] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeTab, setActiveTab] = useState('compose');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingNewMessage, setSendingNewMessage] = useState(false);

  // Predefined message templates
  const messageTemplates = {
    event: {
      title: "Event Invitation",
      template: `Dear Alumni,

We are excited to invite you to our upcoming event:

Event: [Event Name]
Date: [Date]
Time: [Time]
Venue: [Venue]

Your presence and insights would be invaluable to our current students. Please confirm your attendance.

Best regards,
[Your Name]
[College Name]`
    },
    workshop: {
      title: "Workshop Invitation",
      template: `Dear Alumni,

We would like to invite you to conduct a workshop for our students:

Topic: [Workshop Topic]
Proposed Date: [Date]
Duration: [Duration]
Audience: [Target Students]

This would be a great opportunity to share your expertise and guide the next generation.

Looking forward to your positive response.

Best regards,
[Your Name]
[College Name]`
    },
    announcement: {
      title: "Important Announcement",
      template: `Dear Alumni,

We hope this message finds you well. We wanted to share some important news:

[Announcement Details]

We value your continued connection with our institution and look forward to your engagement.

Best regards,
[Your Name]
[College Name]`
    }
  };

  useEffect(() => {
    fetchAlumni();
    fetchAdminConversations();
  }, []);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('/api/admin/alumni', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAlumni(data.alumni || []);
      } else {
        throw new Error(`Failed to fetch alumni: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching alumni:', error);
      setAlert({
        type: 'error',
        message: 'Failed to load alumni data. Please ensure the backend server is running and you are logged in as admin.'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminConversations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/messages/admin/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      } else {
        const errorText = await response.text();
        console.error('Admin conversations API Error:', errorText);
      }
    } catch (error) {
      console.error('Error fetching admin conversations:', error);
    }
  };

  const openConversation = async (conversation) => {
    setSelectedConversation(conversation);
    await fetchMessages(conversation._id);
  };

  const fetchMessages = async (conversationId) => {
    try {
      setLoadingMessages(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/messages/conversation/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      } else {
        console.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendNewMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSendingNewMessage(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/messages/admin/conversation/${selectedConversation._id}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newMessage.trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, data.message]);
        setNewMessage('');
        fetchAdminConversations(); // Refresh conversations to update last message
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingNewMessage(false);
    }
  };

  const closeConversation = () => {
    setSelectedConversation(null);
    setMessages([]);
    setNewMessage('');
  };

  const filteredAlumni = alumni.filter(alumnus => {
    const matchesSearch = alumnus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alumnus.profile?.currentCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alumnus.profile?.currentPosition?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBatch = !filterBatch || filterBatch === 'all' || alumnus.batch?.toString() === filterBatch;
    const matchesBranch = !filterBranch || filterBranch === 'all' || alumnus.profile?.branch === filterBranch;
    
    return matchesSearch && matchesBatch && matchesBranch;
  });

  const handleSelectAlumni = (alumniId) => {
    setSelectedAlumni(prev => 
      prev.includes(alumniId) 
        ? prev.filter(id => id !== alumniId)
        : [...prev, alumniId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAlumni.length === filteredAlumni.length) {
      setSelectedAlumni([]);
    } else {
      setSelectedAlumni(filteredAlumni.map(alumnus => alumnus._id));
    }
  };

  const handleTemplateSelect = (templateKey) => {
    setMessage(messageTemplates[templateKey].template);
  };

  const sendMessage = async () => {
    if (!message.trim() || selectedAlumni.length === 0) {
      setAlert({
        type: 'error',
        message: 'Please select alumni and enter a message'
      });
      return;
    }

    try {
      setSendingMessage(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('/api/messages/admin/send-bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipients: selectedAlumni,
          content: message
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAlert({
          type: 'success',
          message: `Message sent successfully to ${selectedAlumni.length} alumni`
        });
        setMessage('');
        setSelectedAlumni([]);
        setMessageType('event');
        fetchAdminConversations(); // Refresh conversations
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setAlert({
        type: 'error',
        message: 'Failed to send message. Please try again.'
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const getBatches = () => {
    const currentYear = new Date().getFullYear();
    const batches = [];
    for (let year = currentYear; year >= currentYear - 10; year--) {
      batches.push(year.toString());
    }
    return batches;
  };

  const branches = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
    'Chemical',
    'Biotechnology'
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 md:ml-64">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900 poppins-bold">Admin Messaging</h1>
            </div>
            <p className="text-gray-600">Send messages and invitations to alumni</p>
          </div>

          {/* Alert */}
          {alert && (
            <Alert className={`mb-6 ${alert.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
              {alert.type === 'error' ? (
                <AlertCircle className="h-4 w-4 text-red-600" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
              <AlertDescription className={alert.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                {alert.message}
              </AlertDescription>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0"
                onClick={() => setAlert(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="compose">Compose Message</TabsTrigger>
              <TabsTrigger value="conversations">Message History</TabsTrigger>
            </TabsList>

            <TabsContent value="compose" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Alumni Selection */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>Select Alumni</span>
                        <Badge variant="secondary">
                          {selectedAlumni.length} selected
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Filters */}
                      <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                          <Input
                            placeholder="Search alumni..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <Select value={filterBatch} onValueChange={setFilterBatch}>
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Batch" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Batches</SelectItem>
                            {getBatches().map(batch => (
                              <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={filterBranch} onValueChange={setFilterBranch}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Branch" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Branches</SelectItem>
                            {branches.map(branch => (
                              <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Select All */}
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                        <Checkbox
                          id="select-all"
                          checked={selectedAlumni.length === filteredAlumni.length && filteredAlumni.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                        <label htmlFor="select-all" className="text-sm font-medium">
                          Select All ({filteredAlumni.length} alumni)
                        </label>
                      </div>

                      {/* Alumni List */}
                      <div className="max-h-96 overflow-y-auto space-y-2">
                        {loading ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                            <span className="ml-2 text-gray-600">Loading alumni...</span>
                          </div>
                        ) : filteredAlumni.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            No alumni found matching your criteria
                          </div>
                        ) : (
                          filteredAlumni.map(alumnus => (
                            <div
                              key={alumnus._id}
                              className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                selectedAlumni.includes(alumnus._id)
                                  ? 'bg-blue-50 border-blue-200'
                                  : 'bg-white border-gray-200 hover:bg-gray-50'
                              }`}
                              onClick={() => handleSelectAlumni(alumnus._id)}
                            >
                              <Checkbox
                                checked={selectedAlumni.includes(alumnus._id)}
                                readOnly
                              />
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={alumnus.profile?.profileUrl} />
                                <AvatarFallback>
                                  {alumnus.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">
                                  {alumnus.name}
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  {alumnus.profile?.currentPosition && (
                                    <span className="flex items-center">
                                      <Building className="h-3 w-3 mr-1" />
                                      {alumnus.profile.currentPosition}
                                    </span>
                                  )}
                                  {alumnus.batch && (
                                    <span className="flex items-center">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      Batch {alumnus.batch}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Message Composition */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Mail className="h-5 w-5" />
                        <span>Compose Message</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Message Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message Type
                        </label>
                        <Select value={messageType} onValueChange={setMessageType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="event">Event Invitation</SelectItem>
                            <SelectItem value="workshop">Workshop Request</SelectItem>
                            <SelectItem value="announcement">Announcement</SelectItem>
                            <SelectItem value="general">General Message</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Templates */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quick Templates
                        </label>
                        <div className="space-y-2">
                          {Object.entries(messageTemplates).map(([key, template]) => (
                            <Button
                              key={key}
                              variant="outline"
                              size="sm"
                              className="w-full justify-start"
                              onClick={() => handleTemplateSelect(key)}
                            >
                              {template.title}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Message Content */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message Content
                        </label>
                        <Textarea
                          placeholder="Enter your message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={10}
                          className="resize-none"
                        />
                      </div>

                      {/* Send Button */}
                      <Button
                        onClick={sendMessage}
                        disabled={sendingMessage || selectedAlumni.length === 0 || !message.trim()}
                        className="w-full"
                      >
                        {sendingMessage ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send to {selectedAlumni.length} Alumni
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="conversations">
              {selectedConversation ? (
                // Chat Interface
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
                  {/* Chat Header */}
                  <div className="lg:col-span-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={closeConversation}
                              className="p-2"
                            >
                              <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <Avatar>
                              <AvatarImage src={selectedConversation.otherParticipant?.profile?.profileUrl} />
                              <AvatarFallback>
                                {selectedConversation.otherParticipant?.name?.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {selectedConversation.otherParticipant?.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {selectedConversation.otherParticipant?.profile?.currentCompany || 'Alumni'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </div>

                  {/* Messages Area */}
                  <div className="lg:col-span-4">
                    <Card className="h-[500px] flex flex-col">
                      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                        {loadingMessages ? (
                          <div className="flex justify-center items-center h-full">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                          </div>
                        ) : messages.length === 0 ? (
                          <div className="flex justify-center items-center h-full text-gray-500">
                            No messages in this conversation yet.
                          </div>
                        ) : (
                          messages.map((message) => (
                            <div
                              key={message._id}
                              className={`flex ${message.sender._id === selectedConversation.otherParticipant._id ? 'justify-start' : 'justify-end'}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  message.sender._id === selectedConversation.otherParticipant._id
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'bg-blue-600 text-white'
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p className={`text-xs mt-1 ${
                                  message.sender._id === selectedConversation.otherParticipant._id
                                    ? 'text-gray-500'
                                    : 'text-blue-100'
                                }`}>
                                  {new Date(message.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </CardContent>
                      
                      {/* Message Input */}
                      <div className="border-t p-4">
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendNewMessage()}
                            className="flex-1"
                          />
                          <Button
                            onClick={sendNewMessage}
                            disabled={sendingNewMessage || !newMessage.trim()}
                            size="sm"
                          >
                            {sendingNewMessage ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              ) : (
                // Conversations List
                <Card>
                  <CardHeader>
                    <CardTitle>Message History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {conversations.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No conversations yet. Start by sending a message to alumni.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {conversations.map(conversation => (
                          <div
                            key={conversation._id}
                            onClick={() => openConversation(conversation)}
                            className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <Avatar>
                              <AvatarImage src={conversation.otherParticipant?.profile?.profileUrl} />
                              <AvatarFallback>
                                {conversation.otherParticipant?.name?.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900">
                                {conversation.otherParticipant?.name}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {conversation.lastMessage?.content || 'No messages yet'}
                              </p>
                            </div>
                            <div className="text-xs text-gray-400">
                              {conversation.lastMessageTime && 
                                new Date(conversation.lastMessageTime).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminMessaging;
