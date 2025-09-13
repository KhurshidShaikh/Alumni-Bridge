import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  MapPin, 
  Building, 
  GraduationCap, 
  Mail, 
  Phone, 
  Linkedin, 
  MessageCircle,
  Briefcase
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

const AlumniPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const navigate = useNavigate();

  // Mock alumni data
  const mockAlumni = [
    {
      id: 1,
      name: "Sarah Johnson",
      batch: "2020",
      department: "Computer Science",
      company: "Google",
      position: "Senior Software Engineer",
      location: "San Francisco, CA",
      avatar: "/api/placeholder/40/40",
      email: "sarah.johnson@gmail.com",
      phone: "+1 (555) 123-4567",
      linkedin: "linkedin.com/in/sarahjohnson",
      skills: ["React", "Python", "Machine Learning"],
      isAvailableForMentorship: true
    },
    {
      id: 2,
      name: "Michael Chen",
      batch: "2019",
      department: "Electrical Engineering",
      company: "Tesla",
      position: "Hardware Engineer",
      location: "Austin, TX",
      avatar: "/api/placeholder/40/40",
      email: "michael.chen@tesla.com",
      phone: "+1 (555) 234-5678",
      linkedin: "linkedin.com/in/michaelchen",
      skills: ["Circuit Design", "Embedded Systems", "IoT"],
      isAvailableForMentorship: true
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      batch: "2021",
      department: "Business Administration",
      company: "McKinsey & Company",
      position: "Management Consultant",
      location: "New York, NY",
      avatar: "/api/placeholder/40/40",
      email: "emily.rodriguez@mckinsey.com",
      phone: "+1 (555) 345-6789",
      linkedin: "linkedin.com/in/emilyrodriguez",
      skills: ["Strategy", "Analytics", "Leadership"],
      isAvailableForMentorship: false
    },
    {
      id: 4,
      name: "David Kim",
      batch: "2018",
      department: "Computer Science",
      company: "Microsoft",
      position: "Principal Engineer",
      location: "Seattle, WA",
      avatar: "/api/placeholder/40/40",
      email: "david.kim@microsoft.com",
      phone: "+1 (555) 456-7890",
      linkedin: "linkedin.com/in/davidkim",
      skills: ["Azure", "C#", "DevOps"],
      isAvailableForMentorship: true
    },
    {
      id: 5,
      name: "Lisa Thompson",
      batch: "2020",
      department: "Mechanical Engineering",
      company: "SpaceX",
      position: "Propulsion Engineer",
      location: "Hawthorne, CA",
      avatar: "/api/placeholder/40/40",
      email: "lisa.thompson@spacex.com",
      phone: "+1 (555) 567-8901",
      linkedin: "linkedin.com/in/lisathompson",
      skills: ["Rocket Propulsion", "CAD", "Testing"],
      isAvailableForMentorship: true
    },
    {
      id: 6,
      name: "James Wilson",
      batch: "2019",
      department: "Business Administration",
      company: "Goldman Sachs",
      position: "Investment Banker",
      location: "New York, NY",
      avatar: "/api/placeholder/40/40",
      email: "james.wilson@gs.com",
      phone: "+1 (555) 678-9012",
      linkedin: "linkedin.com/in/jameswilson",
      skills: ["Finance", "M&A", "Valuation"],
      isAvailableForMentorship: false
    }
  ];

  const batches = ["All", "2018", "2019", "2020", "2021", "2022"];
  const departments = ["All", "Computer Science", "Electrical Engineering", "Mechanical Engineering", "Business Administration"];

  const filteredAlumni = mockAlumni.filter(alumni => {
    const matchesSearch = alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alumni.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alumni.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = selectedBatch === 'All' || alumni.batch === selectedBatch;
    const matchesDepartment = selectedDepartment === 'All' || alumni.department === selectedDepartment;
    
    return matchesSearch && matchesBatch && matchesDepartment;
  });

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/');
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Alumni Directory</h1>
            <p className="text-sm md:text-base text-gray-600">Connect with our accomplished alumni network</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 mb-6 md:mb-8">
            <div className="flex flex-col gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search alumni..."
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
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    {batches.map(batch => (
                      <option key={batch} value={batch}>Batch {batch}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Alumni Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredAlumni.map((alumni) => (
              <Card key={alumni.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 md:space-x-4 mb-4">
                      <Avatar className="h-12 w-12 md:h-16 md:w-16">
                        <AvatarImage src={alumni.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm md:text-lg">
                          {alumni.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 poppins-medium">{alumni.name}</h3>
                        <p className="text-xs md:text-sm text-gray-600">{alumni.batch} Graduate</p>
                        <Badge variant="outline" className="mt-1 text-xs">{alumni.department}</Badge>
                      </div>
                    </div>
                    {alumni.isAvailableForMentorship && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Available for Mentorship
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      {alumni.department}
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-xs md:text-sm text-gray-600">
                        <Building className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                        {alumni.company}
                      </div>
                      <div className="flex items-center text-xs md:text-sm text-gray-600">
                        <Briefcase className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                        {alumni.position}
                      </div>
                      <div className="flex items-center text-xs md:text-sm text-gray-600">
                        <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                        {alumni.location}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {alumni.skills.slice(0, 2).map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {alumni.skills.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{alumni.skills.length - 2} more
                        </Badge>
                      )}
                    </div>
                    <Separator className="my-3" />
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Mail className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Linkedin className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Connect
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAlumni.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No alumni found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlumniPage;
