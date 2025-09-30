import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell,
  Search,
  UserPlus,
  Building,
  Award,
  MapPin,
  MessageSquare,
  Users,
  Briefcase,
  Calendar,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Sidebar from '../components/Sidebar';
import BottomBar from '../components/BottomBar';
import { homeService } from '../services/homeService';



const HomePage = () => {
  const navigate = useNavigate();
  
  // State for real data
  const [currentUser, setCurrentUser] = useState(null);
  const [recentAlumni, setRecentAlumni] = useState([]);
  const [latestJobs, setLatestJobs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [platformStats, setPlatformStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all home page data
  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [userResponse, alumniResponse, jobsResponse, eventsResponse, statsResponse] = await Promise.all([
          homeService.getCurrentUser(),
          homeService.getRecentAlumni(4),
          homeService.getLatestJobs(4),
          homeService.getUpcomingEvents(4),
          homeService.getPlatformStats()
        ]);

        if (userResponse.success) {
          setCurrentUser(userResponse.user);
        }

        if (alumniResponse.success) {
          setRecentAlumni(alumniResponse.alumni || []);
        }

        if (jobsResponse.success) {
          setLatestJobs(jobsResponse.jobs || []);
        }

        if (eventsResponse.success) {
          setUpcomingEvents(eventsResponse.data || []);
        }

        setPlatformStats(statsResponse);

      } catch (error) {
        console.error('Error fetching home page data:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageData();
  }, []);

  // Format stats for display
  const formatStats = (stats) => {
    if (!stats) return [];
    
    return [
      { title: "Total Alumni", value: stats.totalAlumni.toLocaleString(), icon: Users, color: "text-blue-600" },
      { title: "Job Postings", value: stats.totalJobs.toLocaleString(), icon: Briefcase, color: "text-green-600" },
      { title: "Total Events", value: stats.totalEvents.toLocaleString(), icon: Calendar, color: "text-purple-600" },
      
    ];
  };

  // Format date for events
  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Format job posting date
  const formatJobDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  // Handle search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to alumni page with search term as query parameter
      navigate(`/alumni?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      // Navigate to alumni page without search
      navigate('/alumni');
    }
  };

  // Handle search input key press
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 poppins-regular flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 poppins-regular">
      {/* Sidebar */}
      <Sidebar user={currentUser} />
      
      {/* Bottom Bar for Mobile */}
      <BottomBar />

      {/* Main Content */}
      <div className="md:ml-64 pb-20 md:pb-0 min-h-screen overflow-auto bg-gray-50">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 md:px-6 py-4">
            <div className="flex items-center space-x-2 md:space-x-4 flex-1 md:flex-none">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <div className="min-w-0">
                <h1 className="text-lg md:text-2xl font-bold text-gray-900 poppins-bold truncate">Dashboard</h1>
                <p className="text-xs md:text-sm text-gray-500 truncate">
                  Welcome back{currentUser ? `, ${currentUser.name.split(' ')[0]}` : ''}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Search Bar - Hidden on mobile, shown on desktop */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search alumni ..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="pl-10 w-64 lg:w-80 bg-gray-50 border-gray-200"
                />
              </div>
              
              {/* Mobile Search Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="md:hidden"
                onClick={() => navigate('/alumni')}
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="sm" className="relative hidden md:flex">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser?.profile?.avatarUrl} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">
                  {currentUser?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          {/* Mobile Search Bar - Below header on mobile */}
          <div className="md:hidden px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search alumni ..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="pl-10 w-full bg-gray-50 border-gray-200"
              />
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <div className="p-3 md:p-8 max-w-7xl mx-auto">
          {/* Error Alert */}
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            {formatStats(platformStats).map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg md:text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs md:text-sm text-gray-600">{stat.title}</p>
                    </div>
                    <div className={`p-2 md:p-3 rounded-full bg-gray-100`}>
                      <stat.icon className={`h-4 w-4 md:h-6 md:w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Alumni */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-base md:text-lg">
                    <span>Recent Alumni</span>
                    <Button variant="outline" size="sm" onClick={() => navigate('/alumni')} className="text-xs md:text-sm">
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {recentAlumni.length > 0 ? (
                    recentAlumni.map((alumni, index) => (
                      <div key={alumni._id || index} className="p-3 md:p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
                           onClick={() => navigate(`/alumni/${alumni._id}`)}>
                        <div className="flex items-center space-x-3 md:space-x-4">
                          <Avatar className="h-10 w-10 md:h-12 md:w-12">
                            <AvatarImage src={alumni.profile?.avatarUrl} />
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-xs md:text-sm">
                              {alumni.name?.split(' ').map(n => n[0]).join('') || 'A'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs md:text-sm font-semibold text-gray-900 truncate">{alumni.name}</p>
                            <p className="text-xs md:text-sm text-gray-600">{alumni.profile?.currentPosition || 'Alumni'}</p>
                            <p className="text-xs text-gray-500">
                              {alumni.profile?.currentCompany || 'Company'} • Class of {alumni.batch || 'N/A'}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="hidden md:flex"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/messages');
                                  }}>
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No alumni found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center poppins-semibold">
                  <Calendar className="mr-2 h-5 w-5 text-purple-600" />
                  Upcoming Events
                </CardTitle>
                <CardDescription>Don't miss these upcoming events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event, index) => (
                    <div key={event._id || index} className="p-3 rounded-lg border hover:shadow-sm transition-shadow cursor-pointer"
                         onClick={() => navigate('/events')}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 poppins-medium">{event.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {event.eventType || 'Event'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{formatEventDate(event.date)}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        {event.registrationCount || 0} registered
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No upcoming events</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Job Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center poppins-semibold">
                <Briefcase className="mr-2 h-5 w-5 text-green-600" />
                Latest Job Opportunities
              </CardTitle>
              <CardDescription>Exclusive job postings from our alumni network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {latestJobs.length > 0 ? (
                  latestJobs.map((job, index) => (
                    <div key={job._id || index} className="p-4 rounded-lg border hover:shadow-sm transition-shadow cursor-pointer"
                         onClick={() => navigate(`/jobs/${job._id}`)}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 poppins-medium truncate">{job.title}</h4>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <Building className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{job.company}</span>
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                          {job.jobType || 'Full-time'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center truncate">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </span>
                        <span className="ml-2 flex-shrink-0">{formatJobDate(job.createdAt)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500 py-8">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No job postings available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="poppins-semibold">Quick Actions</CardTitle>
              <CardDescription>Frequently used features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2"
                        onClick={() => navigate('/alumni')}>
                  <Users className="h-6 w-6 text-blue-600" />
                  <span className="text-sm poppins-medium">Find Alumni</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2"
                        onClick={() => navigate('/jobs')}>
                  <Briefcase className="h-6 w-6 text-green-600" />
                  <span className="text-sm poppins-medium">
                    {currentUser?.role === 'alumni' ? 'Post Job' : 'Find Jobs'}
                  </span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2"
                        onClick={() => navigate('/events')}>
                  <Calendar className="h-6 w-6 text-purple-600" />
                  <span className="text-sm poppins-medium">View Events</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2"
                        onClick={() => navigate('/messages')}>
                  <MessageSquare className="h-6 w-6 text-orange-600" />
                  <span className="text-sm poppins-medium">Messages</span>
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default HomePage;
