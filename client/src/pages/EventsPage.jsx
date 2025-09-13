import React, { useState } from 'react';
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
  Share2
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
  const navigate = useNavigate();

  // Mock events data
  const mockEvents = [
    {
      id: 1,
      title: "Alumni Tech Talk: AI in Healthcare",
      organizer: "Sarah Johnson",
      date: "2024-02-15",
      time: "6:00 PM - 8:00 PM",
      location: "Virtual Event",
      type: "Tech Talk",
      description: "Join us for an insightful discussion on how AI is revolutionizing healthcare, featuring alumni working at leading medical tech companies.",
      attendees: 45,
      maxAttendees: 100,
      isRegistered: true,
      image: "/api/placeholder/300/200",
      tags: ["AI", "Healthcare", "Technology"],
      organizer_avatar: "/api/placeholder/40/40"
    },
    {
      id: 2,
      title: "Annual Alumni Networking Gala",
      organizer: "Alumni Association",
      date: "2024-02-28",
      time: "7:00 PM - 11:00 PM",
      location: "Grand Ballroom, Downtown Hotel",
      type: "Networking",
      description: "Our biggest networking event of the year! Connect with alumni from all industries, enjoy dinner, and celebrate our community's achievements.",
      attendees: 156,
      maxAttendees: 200,
      isRegistered: false,
      image: "/api/placeholder/300/200",
      tags: ["Networking", "Gala", "Annual"],
      organizer_avatar: "/api/placeholder/40/40"
    },
    {
      id: 3,
      title: "Startup Pitch Competition",
      organizer: "Michael Chen",
      date: "2024-03-10",
      time: "2:00 PM - 6:00 PM",
      location: "Innovation Center, Campus",
      type: "Competition",
      description: "Watch alumni entrepreneurs pitch their startups to a panel of investor judges. Network with founders and learn about the startup ecosystem.",
      attendees: 78,
      maxAttendees: 150,
      isRegistered: true,
      image: "/api/placeholder/300/200",
      tags: ["Startup", "Entrepreneurship", "Competition"],
      organizer_avatar: "/api/placeholder/40/40"
    },
    {
      id: 4,
      title: "Career Development Workshop",
      organizer: "Emily Rodriguez",
      date: "2024-03-05",
      time: "10:00 AM - 12:00 PM",
      location: "Virtual Event",
      type: "Workshop",
      description: "Learn essential career development skills including resume writing, interview preparation, and salary negotiation from industry experts.",
      attendees: 32,
      maxAttendees: 50,
      isRegistered: false,
      image: "/api/placeholder/300/200",
      tags: ["Career", "Professional Development", "Skills"],
      organizer_avatar: "/api/placeholder/40/40"
    },
    {
      id: 5,
      title: "Alumni Mentorship Kickoff",
      organizer: "David Kim",
      date: "2024-02-20",
      time: "5:00 PM - 7:00 PM",
      location: "Student Center, Room 201",
      type: "Mentorship",
      description: "Launch event for our new mentorship program. Meet potential mentors and mentees, learn about the program structure, and start building connections.",
      attendees: 67,
      maxAttendees: 80,
      isRegistered: true,
      image: "/api/placeholder/300/200",
      tags: ["Mentorship", "Program Launch", "Networking"],
      organizer_avatar: "/api/placeholder/40/40"
    },
    {
      id: 6,
      title: "Industry Panel: Future of Finance",
      organizer: "James Wilson",
      date: "2024-03-15",
      time: "4:00 PM - 6:00 PM",
      location: "Business School Auditorium",
      type: "Panel Discussion",
      description: "Alumni working in finance discuss emerging trends, career opportunities, and the future of the financial industry.",
      attendees: 89,
      maxAttendees: 120,
      isRegistered: false,
      image: "/api/placeholder/300/200",
      tags: ["Finance", "Industry Trends", "Panel"],
      organizer_avatar: "/api/placeholder/40/40"
    }
  ];

  const eventTypes = ["All", "Tech Talk", "Networking", "Workshop", "Competition", "Mentorship", "Panel Discussion"];
  const timeframes = ["All", "This Week", "This Month", "Next Month", "Future"];

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedEventType === 'All' || event.type === selectedEventType;
    
    // Simple timeframe filtering (in a real app, this would be more sophisticated)
    let matchesTimeframe = true;
    if (selectedTimeframe !== 'All') {
      const eventDate = new Date(event.date);
      const now = new Date();
      const oneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const oneMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      switch (selectedTimeframe) {
        case 'This Week':
          matchesTimeframe = eventDate <= oneWeek;
          break;
        case 'This Month':
          matchesTimeframe = eventDate <= oneMonth;
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

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const toggleRegistration = (eventId) => {
    // In a real app, this would update the backend
    console.log(`Toggle registration for event ${eventId}`);
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

  return (
    <div className="min-h-screen bg-gray-50 poppins-regular">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Bottom Bar for Mobile */}
      <BottomBar />

      {/* Main Content */}
      <div className="md:ml-64 pb-20 md:pb-0 min-h-screen overflow-auto bg-gray-50">
        <div className="p-3 md:p-8 max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Events & Workshops</h1>
            <p className="text-sm md:text-base text-gray-600">Join our community events and professional workshops</p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
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
                <div className="grid grid-cols-2 md:flex gap-2 md:gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <select
                      value={selectedEventType}
                      onChange={(e) => setSelectedEventType(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      {eventTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      value={selectedTimeframe}
                      onChange={(e) => setSelectedTimeframe(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
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

          {/* Events Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg"></div>
                  <div className="flex flex-col gap-4">
                    <div className="mb-4">
                      <Badge variant={event.type === 'Workshop' ? 'default' : 'secondary'} className="mb-2 text-xs">
                        {event.type}
                      </Badge>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 poppins-medium mb-2">{event.title}</h3>
                      <p className="text-gray-600 text-xs md:text-sm line-clamp-2">{event.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {event.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {event.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{event.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={event.organizer_avatar} />
                          <AvatarFallback>{event.organizer[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-gray-600">Organized by {event.organizer}</span>
                      </div>
                      <div className="text-gray-500">
                        {event.attendees}/{event.maxAttendees} attending
                      </div>
                    </div>
                    <Separator />
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1 text-xs md:text-sm">
                        <UserPlus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                        Register
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
