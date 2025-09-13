import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search,
  MapPin,
  Building,
  GraduationCap,
  Star,
  MessageCircle,
  Filter,
  BookmarkPlus,
  UserPlus,
  Clock,
  MessageSquare,
  ExternalLink,
  Bookmark,
  UserCheck,
  Users,
  TrendingUp,
  Award,
  Briefcase
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import BottomBar from '../components/BottomBar';

const MentorshipPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [bookmarkedMentors, setBookmarkedMentors] = useState(new Set());
  const [requestedMentors, setRequestedMentors] = useState(new Set());
  const navigate = useNavigate();

  // Mock stats data
  const stats = [
    {
      icon: Users,
      label: "Active Mentors",
      value: "150+"
    },
    {
      icon: TrendingUp,
      label: "Success Rate",
      value: "94%"
    },
    {
      icon: Award,
      label: "Sessions Completed",
      value: "2,500+"
    }
  ];

  // Mock mentorship data
  const mockMentors = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Senior Software Engineer",
      company: "Google",
      batch: "2018",
      expertise: ["Software Development", "Machine Learning", "Career Growth"],
      rating: 4.9,
      reviews: 23,
      location: "San Francisco, CA",
      avatar: "/api/placeholder/40/40",
      bio: "Passionate about helping students transition into tech careers. Specialized in full-stack development and ML applications.",
      availability: "Available",
      responseTime: "Within 24 hours",
      mentees: 12,
      sessions: 45,
      languages: ["English", "Spanish"],
      isBookmarked: false
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Hardware Engineer",
      company: "Tesla",
      batch: "2017",
      expertise: ["Hardware Design", "Embedded Systems", "Product Development"],
      rating: 4.8,
      reviews: 18,
      location: "Austin, TX",
      avatar: "/api/placeholder/40/40",
      bio: "10+ years in hardware engineering. Love mentoring students interested in automotive and clean energy technologies.",
      availability: "Limited",
      responseTime: "Within 48 hours",
      mentees: 8,
      sessions: 32,
      languages: ["English", "Mandarin"],
      isBookmarked: true
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      title: "Management Consultant",
      company: "McKinsey & Company",
      batch: "2019",
      expertise: ["Business Strategy", "Leadership", "Case Interview Prep"],
      rating: 4.9,
      reviews: 31,
      location: "New York, NY",
      avatar: "/api/placeholder/40/40",
      bio: "Former investment banker turned consultant. Helping students navigate business careers and develop leadership skills.",
      availability: "Available",
      responseTime: "Within 12 hours",
      mentees: 15,
      sessions: 67,
      languages: ["English", "Portuguese"],
      isBookmarked: false
    },
    {
      id: 4,
      name: "David Kim",
      title: "Principal Engineer",
      company: "Microsoft",
      batch: "2016",
      expertise: ["Cloud Architecture", "DevOps", "Technical Leadership"],
      rating: 4.7,
      reviews: 26,
      location: "Seattle, WA",
      avatar: "/api/placeholder/40/40",
      bio: "Leading cloud infrastructure teams. Passionate about mentoring engineers on technical growth and leadership transition.",
      availability: "Available",
      responseTime: "Within 24 hours",
      mentees: 10,
      sessions: 38,
      languages: ["English", "Korean"],
      isBookmarked: true
    },
    {
      id: 5,
      name: "Lisa Thompson",
      title: "Propulsion Engineer",
      company: "SpaceX",
      batch: "2018",
      expertise: ["Aerospace Engineering", "Rocket Propulsion", "STEM Careers"],
      rating: 4.8,
      reviews: 14,
      location: "Hawthorne, CA",
      avatar: "/api/placeholder/40/40",
      bio: "Rocket engineer working on next-gen propulsion systems. Mentoring students interested in aerospace and STEM fields.",
      availability: "Limited",
      responseTime: "Within 72 hours",
      mentees: 6,
      sessions: 21,
      languages: ["English"],
      isBookmarked: false
    },
    {
      id: 6,
      name: "James Wilson",
      title: "Investment Banker",
      company: "Goldman Sachs",
      batch: "2017",
      expertise: ["Investment Banking", "Finance", "Wall Street Careers"],
      rating: 4.6,
      reviews: 19,
      location: "New York, NY",
      avatar: "/api/placeholder/40/40",
      bio: "Senior banker with expertise in M&A and capital markets. Helping students break into finance and navigate Wall Street.",
      availability: "Available",
      responseTime: "Within 24 hours",
      mentees: 9,
      sessions: 29,
      languages: ["English", "French"],
      isBookmarked: false
    }
  ];

  const expertiseAreas = ["All", "Software Development", "Hardware Design", "Business Strategy", "Finance", "Aerospace Engineering", "Machine Learning"];
  const availabilityOptions = ["All", "Available", "Limited"];

  const filteredMentors = mockMentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesExpertise = selectedExpertise === 'All' || mentor.expertise.includes(selectedExpertise);
    const matchesAvailability = selectedAvailability === 'All' || mentor.availability === selectedAvailability;
    
    return matchesSearch && matchesExpertise && matchesAvailability;
  });

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const toggleBookmark = (mentorId) => {
    console.log(`Toggle bookmark for mentor ${mentorId}`);
  };

  const requestMentorship = (mentorId) => {
    console.log(`Request mentorship from mentor ${mentorId}`);
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Mentorship Program</h1>
            <p className="text-sm md:text-base text-gray-600">Connect with experienced alumni for guidance and career development</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {stats.map(stat => (
              <Card key={stat.label}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs md:text-sm text-gray-600">{stat.label}</p>
                    </div>
                    <div className="p-2 md:p-3 bg-blue-100 rounded-full">
                      <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
                </Card>
            ))}
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search mentors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:flex gap-2 md:gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <select
                      value={selectedExpertise}
                      onChange={(e) => setSelectedExpertise(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      {expertiseAreas.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      value={selectedAvailability}
                      onChange={(e) => setSelectedAvailability(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      {availabilityOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredMentors.map((mentor) => (
              <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 md:space-x-4 mb-4">
                      <Avatar className="h-12 w-12 md:h-16 md:w-16">
                        <AvatarImage src={mentor.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm md:text-lg">
                          {mentor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 poppins-medium">{mentor.name}</h3>
                        <p className="text-xs md:text-sm text-gray-600">{mentor.title}</p>
                        <div className="flex items-center text-xs md:text-sm text-gray-500 mt-1">
                          <Building className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                          {mentor.company}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={mentor.availability === 'Available' ? 'default' : 'secondary'}
                      className={mentor.availability === 'Available' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {mentor.availability}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-xs md:text-sm text-gray-600">
                      <GraduationCap className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                      {mentor.experience} years experience
                    </div>
                    <div className="flex items-center text-xs md:text-sm text-gray-600">
                      <Briefcase className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                      {mentor.expertise.slice(0, 2).join(', ')}{mentor.expertise.length > 2 && '...'}
                    </div>
                    <div className="flex items-center text-xs md:text-sm text-gray-600">
                      <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                      {mentor.location}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 md:h-4 md:w-4 ${
                              i < Math.floor(mentor.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs md:text-sm text-gray-600">({mentor.reviews})</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                      Available
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {mentor.expertise.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between items-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleBookmark(mentor.id)}
                      className={mentor.isBookmarked ? "text-blue-600 border-blue-600" : ""}
                    >
                      <BookmarkPlus className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => requestMentorship(mentor.id)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Request Mentorship
                    </Button>
                    <div className="flex justify-between text-xs text-gray-500 mt-3">
                      <span>{mentor.mentees} mentees</span>
                      <span>{mentor.sessions} sessions</span>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="flex justify-between items-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleBookmark(mentor.id)}
                        className={mentor.isBookmarked ? "text-blue-600 border-blue-600" : ""}
                      >
                        <BookmarkPlus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => requestMentorship(mentor.id)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Request Mentorship
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMentors.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorshipPage;
