import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell,
  Search,
  TrendingUp,
  UserPlus,
  Building,
  GraduationCap,
  Award,
  MapPin,
  Mail,
  Phone,
  Globe,
  ChevronRight,
  Activity,
  MessageSquare,
  Users,
  Briefcase,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Sidebar from '../components/Sidebar';
import BottomBar from '../components/BottomBar';

// Mock data
const mockUser = {
  name: "John Doe",
  role: "Alumni",
  graduation: "2020",
  department: "Computer Science",
  company: "Google",
  position: "Senior Software Engineer",
  location: "San Francisco, CA",
  avatar: "",
  email: "john.doe@gmail.com",
  phone: "+1 (555) 123-4567"
};

const mockStats = [
  { title: "Total Alumni", value: "5,247", change: "+12%", icon: Users, color: "text-blue-600" },
  { title: "Job Postings", value: "1,234", change: "+8%", icon: Briefcase, color: "text-green-600" },
  { title: "Events This Month", value: "24", change: "+15%", icon: Calendar, color: "text-purple-600" },
  { title: "Active Mentors", value: "892", change: "+5%", icon: Award, color: "text-orange-600" }
];

const mockRecentAlumni = [
  { name: "Sarah Johnson", company: "Microsoft", position: "Product Manager", graduation: "2019", avatar: "" },
  { name: "Mike Chen", company: "Tesla", position: "Engineering Lead", graduation: "2018", avatar: "" },
  { name: "Emily Davis", company: "Apple", position: "UX Designer", graduation: "2021", avatar: "" },
  { name: "David Wilson", company: "Amazon", position: "Data Scientist", graduation: "2020", avatar: "" }
];

const mockEvents = [
  { title: "Alumni Networking Night", date: "Dec 15, 2024", attendees: 45, type: "Networking" },
  { title: "Tech Career Fair", date: "Dec 20, 2024", attendees: 120, type: "Career" },
  { title: "Mentorship Program Launch", date: "Jan 5, 2025", attendees: 78, type: "Mentorship" },
  { title: "Annual Alumni Gala", date: "Jan 15, 2025", attendees: 200, type: "Social" }
];

const mockJobs = [
  { title: "Senior Frontend Developer", company: "Stripe", location: "Remote", type: "Full-time", posted: "2 days ago" },
  { title: "Product Manager", company: "Figma", location: "San Francisco", type: "Full-time", posted: "1 week ago" },
  { title: "Data Analyst", company: "Airbnb", location: "New York", type: "Contract", posted: "3 days ago" },
  { title: "UX Researcher", company: "Netflix", location: "Los Angeles", type: "Full-time", posted: "5 days ago" }
];


const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 poppins-regular">
      {/* Sidebar */}
      <Sidebar user={mockUser} />
      
      {/* Bottom Bar for Mobile */}
      <BottomBar />

      {/* Main Content */}
      <div className="md:ml-64 pb-20 md:pb-0 min-h-screen overflow-auto bg-gray-50">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 md:px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 poppins-bold">Dashboard</h1>
                <p className="text-xs md:text-sm text-gray-500">Welcome back, {mockUser.name}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search alumni, jobs, events..." 
                  className="pl-10 w-80 bg-gray-50 border-gray-200"
                />
              </div>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src={mockUser.avatar} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <div className="p-3 md:p-8 max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            {mockStats.map((stat, index) => (
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
                  {mockRecentAlumni.map((alumni, index) => (
                    <div className="p-3 md:p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3 md:space-x-4">
                        <Avatar className="h-10 w-10 md:h-12 md:w-12">
                          <AvatarImage src={alumni.avatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-xs md:text-sm">
                            {alumni.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs md:text-sm font-semibold text-gray-900 truncate">{alumni.name}</p>
                          <p className="text-xs md:text-sm text-gray-600">{alumni.position}</p>
                          <p className="text-xs text-gray-500">{alumni.company} • Class of {alumni.graduation}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="hidden md:flex">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
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
                {mockEvents.map((event, index) => (
                  <div key={index} className="p-3 rounded-lg border hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 poppins-medium">{event.title}</h4>
                      <Badge variant="secondary" className="text-xs">{event.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{event.date}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Users className="h-3 w-3 mr-1" />
                      {event.attendees} attending
                    </div>
                  </div>
                ))}
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                {mockJobs.map((job, index) => (
                  <div key={index} className="p-4 rounded-lg border hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 poppins-medium">{job.title}</h4>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <Building className="h-3 w-3 mr-1" />
                          {job.company}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">{job.type}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {job.location}
                      </span>
                      <span>{job.posted}</span>
                    </div>
                  </div>
                ))}
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
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  <span className="text-sm poppins-medium">Find Alumni</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Briefcase className="h-6 w-6 text-green-600" />
                  <span className="text-sm poppins-medium">Post Job</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Calendar className="h-6 w-6 text-purple-600" />
                  <span className="text-sm poppins-medium">Create Event</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <MessageSquare className="h-6 w-6 text-orange-600" />
                  <span className="text-sm poppins-medium">Start Chat</span>
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
