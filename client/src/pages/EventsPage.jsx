import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  CalendarDays,
  Search,
  Filter,
  MapPin,
  Clock,
  Users,
  Tag,
  ExternalLink,
  BookmarkPlus,
  UserPlus,
  Share2,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Sidebar from '../components/Sidebar';
import BottomBar from '../components/BottomBar';

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('All');
  const [selectedTimeframe, setSelectedTimeframe] = useState('All');
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registeringEvents, setRegisteringEvents] = useState(new Set());
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  // Fetch events from API and set up real-time updates
  useEffect(() => {
    fetchEvents();

    // Set up polling for real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchEvents();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL ?? '';

      const headers = {
        'Content-Type': 'application/json'
      };

      // Use authenticated endpoint if token exists
      let endpoint = '/api/event/get';
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        endpoint = '/api/event/get-auth'; // Use authenticated endpoint
      }

      const response = await fetch(`${backendUrl}${endpoint}`, {
        headers
      });

      const data = await response.json();

      if (data.success) {
        const eventsData = data.data || [];
        setEvents(eventsData);
        setError(null);

        // Set registered events based on backend response
        if (token) {
          const userRegistrations = new Set();
          eventsData.forEach(event => {
            if (event.isRegistered) {
              userRegistrations.add(event._id);
            }
          });
          setRegisteredEvents(userRegistrations);
        }
      } else {
        setError('Failed to fetch events');
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to connect to server');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const eventTypes = ["All", "public", "private"];
  const timeframes = ["All", "This Week", "This Month", "Next Month", "Future"];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.createdBy?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedEventType === 'All' || event.visibility === selectedEventType;

    // Timeframe filtering
    let matchesTimeframe = true;
    if (selectedTimeframe !== 'All') {
      const eventDate = new Date(event.date);
      const now = new Date();
      const oneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const oneMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      switch (selectedTimeframe) {
        case 'This Week':
          matchesTimeframe = eventDate <= oneWeek && eventDate >= now;
          break;
        case 'This Month':
          matchesTimeframe = eventDate <= oneMonth && eventDate >= now;
          break;
        case 'Next Month':
          matchesTimeframe = eventDate > oneMonth;
          break;
        case 'Future':
          matchesTimeframe = eventDate > now;
          break;
      }
    }

    return matchesSearch && matchesType && matchesTimeframe;
  });

  console.log(`Filtered ${filteredEvents.length} events from ${events.length} total events`);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/');
  };

  // Handle event registration
  const handleEventRegistration = async (eventId) => {
    if (!token) {
      alert('Please login to register for events');
      return;
    }

    try {
      setRegisteringEvents(prev => new Set([...prev, eventId]));
      const backendUrl = import.meta.env.VITE_BACKEND_URL ?? '';

      const isRegistered = registeredEvents.has(eventId);
      const endpoint = isRegistered ? 'unregister' : 'register';
      const method = isRegistered ? 'DELETE' : 'POST';

      const response = await fetch(`${backendUrl}/api/event/${eventId}/${endpoint}`, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        if (isRegistered) {
          setRegisteredEvents(prev => {
            const newSet = new Set(prev);
            newSet.delete(eventId);
            return newSet;
          });
        } else {
          setRegisteredEvents(prev => new Set([...prev, eventId]));
        }

        // Update the event's registration count and status in the events array
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event._id === eventId
              ? {
                ...event,
                registrationCount: data.registrationCount || 0,
                isRegistered: !isRegistered
              }
              : event
          )
        );

        alert(data.message);
      } else {
        alert(data.error || 'Failed to register for event');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Failed to register for event');
    } finally {
      setRegisteringEvents(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    }
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 poppins-regular">
      {/* Sidebar */}
      <Sidebar />

      {/* Bottom Bar for Mobile */}
      <BottomBar />

      {/* Main Content */}
      <div className="md:ml-64 pb-20 md:pb-0 min-h-screen overflow-auto bg-gray-50">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Events & Workshops</h1>
                <p className="text-sm md:text-base text-gray-600">Join our community events and professional workshops</p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search events by title, organizer, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-3 lg:gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <select
                      value={selectedEventType}
                      onChange={(e) => setSelectedEventType(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full lg:w-auto"
                    >
                      {eventTypes.map(type => (
                        <option key={type} value={type}>
                          {type === 'All' ? 'All Events' : type === 'public' ? 'Public Events' : 'Private Events'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <select
                      value={selectedTimeframe}
                      onChange={(e) => setSelectedTimeframe(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full lg:w-auto"
                    >
                      {timeframes.map(timeframe => (
                        <option key={timeframe} value={timeframe}>{timeframe}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading events...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <Card className="text-center py-12 border-red-200 bg-red-50">
              <CardContent>
                <Calendar className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Events</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchEvents} variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Events Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
              {filteredEvents.map((event) => (
                <Card key={event._id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <CardContent className="p-0">
                    {/* Event Image */}
                    <div className="aspect-video relative overflow-hidden">
                      {event.imageUrl ? (
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center ${event.imageUrl ? 'hidden' : 'flex'}`}
                      >
                        <Calendar className="w-12 h-12 text-white opacity-50" />
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge variant={event.visibility === 'public' ? 'default' : 'secondary'} className="text-xs">
                          {event.visibility}
                        </Badge>
                      </div>
                    </div>

                    {/* Event Content */}
                    <div className="p-4 md:p-6">
                      <div className="space-y-4">
                        {/* Event Title and Description */}
                        <div>
                          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                            {event.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-3">{event.description}</p>
                        </div>

                        {/* Event Details */}
                        <div className="space-y-2 text-sm text-gray-600">
                          {event.date && (
                            <div className="flex items-start space-x-2">
                              <Calendar className="h-4 w-4 flex-shrink-0 mt-0.5" />
                              <span className="break-words">{formatDate(event.date)}</span>
                            </div>
                          )}
                          {event.date && (
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{formatTime(event.date)}</span>
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-start space-x-2">
                              <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                              <span className="break-words">{event.location}</span>
                            </div>
                          )}
                        </div>

                        {/* Organizer Info */}
                        <div className="flex items-center space-x-2 text-sm">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={event.createdBy?.profileImage || ''} />
                            <AvatarFallback className="text-xs">
                              {event.createdBy?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'A'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-gray-600 truncate">
                            Organized by {event.createdBy?.name || 'Admin'}
                          </span>
                        </div>

                        <Separator />

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="flex-1 text-xs md:text-sm"
                            onClick={() => handleEventRegistration(event._id)}
                            disabled={registeringEvents.has(event._id)}
                            variant={registeredEvents.has(event._id) ? "outline" : "default"}
                          >
                            {registeringEvents.has(event._id) ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1 md:mr-2"></div>
                                Loading...
                              </>
                            ) : registeredEvents.has(event._id) ? (
                              <>
                                <UserPlus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                                Registered
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                                Register
                              </>
                            )}
                          </Button>
                          <Button variant="outline" size="sm" className="px-3">
                            <Share2 className="h-3 w-3 md:h-4 md:w-4" />
                          </Button>
                        </div>

                        {/* Registration Count */}
                        {event.registrationCount > 0 && (
                          <div className="text-xs text-gray-500 mt-2">
                            {event.registrationCount} {event.registrationCount === 1 ? 'person' : 'people'} registered
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && !error && filteredEvents.length === 0 && events.length > 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No matching events found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
              </CardContent>
            </Card>
          )}

          {!loading && !error && events.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events available</h3>
                <p className="text-gray-500">Check back later for upcoming events and workshops.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
