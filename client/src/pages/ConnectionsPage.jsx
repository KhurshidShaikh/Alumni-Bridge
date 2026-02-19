import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/selectors/userSelectors';
import { toast } from 'sonner';
import {
  Users,
  Search,
  UserMinus,
  Building,
  MapPin,
  GraduationCap,
  MessageCircle,
  Trash2,
  Check,
  X,
  Clock,
  Send,
  UserCheck,
  UserX
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Sidebar from '../components/Sidebar';
import BottomBar from '../components/BottomBar';

const ConnectionsPage = () => {
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState({ sent: [], received: [], all: [] });
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({});
  const [actionLoading, setActionLoading] = useState({});
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);

  // Fetch user connections
  const fetchConnections = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Please login to view connections');
        navigate('/login');
        return;
      }

      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append('search', searchTerm.trim());

      const backendUrl = import.meta.env.VITE_BACKEND_URL ?? '';
      const response = await fetch(`${backendUrl}/api/connections/my-connections?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setConnections(data.connections);
        setPagination(data.pagination);
      } else {
        toast.error(data.error || 'Failed to fetch connections');
      }
    } catch (error) {
      console.error('Fetch connections error:', error);
      toast.error('Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  // Remove connection
  const handleRemoveConnection = async (connectionId, userName) => {
    if (!confirm(`Are you sure you want to remove ${userName} from your connections?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL ?? '';

      const response = await fetch(`${backendUrl}/api/connections/${connectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Connection removed successfully');
        setConnections(prev => prev.filter(conn => conn._id !== connectionId));
      } else {
        toast.error(data.error || 'Failed to remove connection');
      }
    } catch (error) {
      console.error('Remove connection error:', error);
      toast.error('Failed to remove connection');
    }
  };

  // Fetch connection requests
  const fetchRequests = async () => {
    try {
      setRequestsLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Please login to view requests');
        navigate('/login');
        return;
      }

      const backendUrl = import.meta.env.VITE_BACKEND_URL ?? '';
      const response = await fetch(`${backendUrl}/api/connections/requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setRequests(data.requests);
      } else {
        toast.error(data.error || 'Failed to fetch requests');
      }
    } catch (error) {
      console.error('Fetch requests error:', error);
      toast.error('Failed to load requests');
    } finally {
      setRequestsLoading(false);
    }
  };

  // Accept connection request
  const handleAcceptRequest = async (requestId) => {
    try {
      setActionLoading(prev => ({ ...prev, [requestId]: 'accepting' }));
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL ?? '';

      const response = await fetch(`${backendUrl}/api/connections/request/${requestId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Connection request accepted!');
        // Remove from received requests and refresh connections
        setRequests(prev => ({
          ...prev,
          received: prev.received.filter(req => req._id !== requestId),
          all: prev.all.filter(req => req._id !== requestId)
        }));
        fetchConnections(); // Refresh connections list
      } else {
        toast.error(data.error || 'Failed to accept request');
      }
    } catch (error) {
      console.error('Accept request error:', error);
      toast.error('Failed to accept request');
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: null }));
    }
  };

  // Decline connection request
  const handleDeclineRequest = async (requestId) => {
    try {
      setActionLoading(prev => ({ ...prev, [requestId]: 'declining' }));
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL ?? '';

      const response = await fetch(`${backendUrl}/api/connections/request/${requestId}/decline`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Connection request declined');
        setRequests(prev => ({
          ...prev,
          received: prev.received.filter(req => req._id !== requestId),
          all: prev.all.filter(req => req._id !== requestId)
        }));
      } else {
        toast.error(data.error || 'Failed to decline request');
      }
    } catch (error) {
      console.error('Decline request error:', error);
      toast.error('Failed to decline request');
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: null }));
    }
  };

  // Withdraw connection request
  const handleWithdrawRequest = async (requestId) => {
    try {
      setActionLoading(prev => ({ ...prev, [requestId]: 'withdrawing' }));
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL ?? '';

      const response = await fetch(`${backendUrl}/api/connections/request/${requestId}/withdraw`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Connection request withdrawn');
        setRequests(prev => ({
          ...prev,
          sent: prev.sent.filter(req => req._id !== requestId),
          all: prev.all.filter(req => req._id !== requestId)
        }));
      } else {
        toast.error(data.error || 'Failed to withdraw request');
      }
    } catch (error) {
      console.error('Withdraw request error:', error);
      toast.error('Failed to withdraw request');
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: null }));
    }
  };

  // Handle profile click
  const handleProfileClick = (userId) => {
    navigate(`/alumni/${userId}`);
  };

  // Handle message click
  const handleMessageClick = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL ?? '';

      // Get or create conversation
      const response = await fetch(`${backendUrl}/api/messages/conversation/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        // Navigate to chat page with conversation ID
        navigate(`/chat/${data.conversation._id}`);
      } else {
        toast.error(data.error || 'Failed to start conversation');
      }
    } catch (error) {
      console.error('Start conversation error:', error);
      toast.error('Failed to start conversation');
    }
  };

  // Fetch connections and requests on component mount
  useEffect(() => {
    fetchConnections();
    fetchRequests();
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchConnections();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Render request card
  const renderRequestCard = (request, type) => {
    const isReceived = type === 'received';
    const otherUser = isReceived ? request.fromUser : request.toUser;
    const requestId = request._id;
    const loadingState = actionLoading[requestId];

    return (
      <Card key={requestId} className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12 md:h-16 md:w-16">
              <AvatarImage src={otherUser.profile?.profileUrl} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm md:text-lg">
                {otherUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900">
                    {otherUser.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {otherUser.profile?.currentPosition || otherUser.role}
                    {otherUser.profile?.currentCompany && ` at ${otherUser.profile.currentCompany}`}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {otherUser.batch} Graduate
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {otherUser.profile?.branch || 'Not specified'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {isReceived ? (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleAcceptRequest(requestId)}
                        disabled={loadingState}
                      >
                        {loadingState === 'accepting' ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeclineRequest(requestId)}
                        disabled={loadingState}
                      >
                        {loadingState === 'declining' ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-gray-600 hover:text-gray-700"
                      onClick={() => handleWithdrawRequest(requestId)}
                      disabled={loadingState}
                    >
                      {loadingState === 'withdrawing' ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600" />
                      ) : (
                        'Withdraw'
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {request.message && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">"{request.message}"</p>
                </div>
              )}

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {new Date(request.createdAt).toLocaleDateString()}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleProfileClick(otherUser._id)}
                >
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 poppins-regular">
      <Sidebar />
      <BottomBar />

      <div className="md:ml-64 pb-20 md:pb-0 min-h-screen overflow-auto bg-gray-50">
        <div className="p-3 md:p-8 max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Connections</h1>
            <p className="text-sm md:text-base text-gray-600">
              Manage your professional network and connection requests
            </p>
          </div>

          <Tabs defaultValue="connections" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="connections" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Connections ({pagination.totalCount || 0})</span>
              </TabsTrigger>
              <TabsTrigger value="received" className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4" />
                <span>Received ({requests.received.length})</span>
              </TabsTrigger>
              <TabsTrigger value="sent" className="flex items-center space-x-2">
                <Send className="h-4 w-4" />
                <span>Sent ({requests.sent.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="connections" className="mt-6">
              {/* Search */}
              <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 mb-6 md:mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search connections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-sm"
                  />
                </div>
              </div>

              {/* Connections Grid */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading connections...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {connections.map((connection) => (
                    <Card key={connection._id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex items-center space-x-3 md:space-x-4">
                          <Avatar className="h-12 w-12 md:h-16 md:w-16">
                            <AvatarImage src={connection.connectedUser.profile?.profileUrl} />
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm md:text-lg">
                              {connection.connectedUser.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="text-base md:text-lg font-semibold text-gray-900 poppins-medium">
                              {connection.connectedUser.name}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-600">
                              {connection.connectedUser.batch} Graduate
                            </p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {connection.connectedUser.profile?.branch || 'Not specified'}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            {connection.connectedUser.profile?.currentCompany && (
                              <div className="flex items-center text-xs md:text-sm text-gray-600">
                                <Building className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                                {connection.connectedUser.profile.currentCompany}
                              </div>
                            )}

                            {connection.connectedUser.profile?.currentPosition && (
                              <div className="flex items-center text-xs md:text-sm text-gray-600">
                                <GraduationCap className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                                {connection.connectedUser.profile.currentPosition}
                              </div>
                            )}

                            {connection.connectedUser.profile?.location && (
                              <div className="flex items-center text-xs md:text-sm text-gray-600">
                                <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                                {connection.connectedUser.profile.location}
                              </div>
                            )}
                          </div>

                          <div className="text-xs text-gray-500">
                            Connected on {new Date(connection.connectedAt).toLocaleDateString()}
                          </div>

                          <Separator className="my-3" />

                          <div className="flex justify-between items-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleProfileClick(connection.connectedUser._id)}
                            >
                              View Profile
                            </Button>

                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => handleMessageClick(connection.connectedUser._id)}
                                title="Send Message"
                              >
                                <MessageCircle className="h-3 w-3" />
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRemoveConnection(connection._id, connection.connectedUser.name)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {!loading && connections.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No connections yet</h3>
                    <p className="text-gray-500 mb-4">
                      Start building your network by connecting with alumni in the directory.
                    </p>
                    <Button
                      onClick={() => navigate('/alumni')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Browse Alumni Directory
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="received" className="mt-6">
              {requestsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading requests...</span>
                </div>
              ) : requests.received.length > 0 ? (
                <div className="space-y-4">
                  {requests.received.map(request => renderRequestCard(request, 'received'))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
                    <p className="text-gray-500">You don't have any incoming connection requests.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="sent" className="mt-6">
              {requestsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading requests...</span>
                </div>
              ) : requests.sent.length > 0 ? (
                <div className="space-y-4">
                  {requests.sent.map(request => renderRequestCard(request, 'sent'))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No sent requests</h3>
                    <p className="text-gray-500 mb-4">
                      You haven't sent any connection requests yet.
                    </p>
                    <Button
                      onClick={() => navigate('/alumni')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Browse Alumni Directory
                    </Button>
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

export default ConnectionsPage;
