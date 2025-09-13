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
  Briefcase, 
  Search, 
  Filter, 
  MapPin, 
  Building, 
  Clock, 
  DollarSign, 
  Bookmark, 
  BookmarkPlus,
  ExternalLink
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import BottomBar from '../components/BottomBar';

const JobsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [bookmarkedJobs, setBookmarkedJobs] = useState(new Set());
  const navigate = useNavigate();

  // Mock job data
  const mockJobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "Google",
      location: "Mountain View, CA",
      type: "Full-time",
      salary: "$150,000 - $200,000",
      postedBy: "Sarah Johnson",
      postedDate: "2 days ago",
      logo: "/api/placeholder/40/40",
      description: "Join our team to build next-generation web applications using React, Node.js, and cloud technologies.",
      requirements: ["5+ years experience", "React/Node.js", "Cloud platforms", "System design"],
      benefits: ["Health insurance", "401k matching", "Remote work", "Stock options"],
      applicants: 24,
      isBookmarked: false
    },
    {
      id: 2,
      title: "Product Manager",
      company: "Microsoft",
      location: "Seattle, WA",
      type: "Full-time",
      salary: "$130,000 - $170,000",
      postedBy: "David Kim",
      postedDate: "1 week ago",
      logo: "/api/placeholder/40/40",
      description: "Lead product strategy and development for our cloud services platform.",
      requirements: ["3+ years PM experience", "Technical background", "Agile methodology", "Data analysis"],
      benefits: ["Health insurance", "Flexible hours", "Learning budget", "Stock options"],
      applicants: 18,
      isBookmarked: true
    },
    {
      id: 3,
      title: "Data Scientist",
      company: "Netflix",
      location: "Los Gatos, CA",
      type: "Full-time",
      salary: "$140,000 - $180,000",
      postedBy: "Emily Rodriguez",
      postedDate: "3 days ago",
      logo: "/api/placeholder/40/40",
      description: "Analyze user behavior and content performance to drive business decisions.",
      requirements: ["PhD/Masters in relevant field", "Python/R", "Machine Learning", "Statistics"],
      benefits: ["Unlimited PTO", "Health insurance", "Stock options", "Free Netflix"],
      applicants: 31,
      isBookmarked: false
    },
    {
      id: 4,
      title: "UX Designer",
      company: "Apple",
      location: "Cupertino, CA",
      type: "Full-time",
      salary: "$120,000 - $160,000",
      postedBy: "Lisa Thompson",
      postedDate: "5 days ago",
      logo: "/api/placeholder/40/40",
      description: "Design intuitive user experiences for our next-generation consumer products.",
      requirements: ["4+ years UX experience", "Figma/Sketch", "User research", "Prototyping"],
      benefits: ["Health insurance", "Employee discounts", "Gym membership", "Stock purchase plan"],
      applicants: 42,
      isBookmarked: false
    },
    {
      id: 5,
      title: "Marketing Manager",
      company: "Tesla",
      location: "Austin, TX",
      type: "Full-time",
      salary: "$90,000 - $120,000",
      postedBy: "Michael Chen",
      postedDate: "1 day ago",
      logo: "/api/placeholder/40/40",
      description: "Drive marketing campaigns for our sustainable energy products.",
      requirements: ["3+ years marketing experience", "Digital marketing", "Analytics", "Campaign management"],
      benefits: ["Health insurance", "Employee vehicle program", "Stock options", "Flexible work"],
      applicants: 15,
      isBookmarked: true
    },
    {
      id: 6,
      title: "DevOps Engineer",
      company: "Amazon",
      location: "Remote",
      type: "Full-time",
      salary: "$110,000 - $150,000",
      postedBy: "James Wilson",
      postedDate: "4 days ago",
      logo: "/api/placeholder/40/40",
      description: "Build and maintain scalable infrastructure for our cloud services.",
      requirements: ["AWS certification", "Kubernetes", "CI/CD pipelines", "Infrastructure as Code"],
      benefits: ["Remote work", "Health insurance", "401k matching", "Professional development"],
      applicants: 28,
      isBookmarked: false
    }
  ];

  const jobTypes = ["All", "Full-time", "Part-time", "Contract", "Internship"];
  const locations = ["All", "Remote", "San Francisco, CA", "Seattle, WA", "New York, NY", "Austin, TX"];

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedJobType === 'All' || job.type === selectedJobType;
    const matchesLocation = selectedLocation === 'All' || job.location.includes(selectedLocation) || 
                           (selectedLocation === 'Remote' && job.location === 'Remote');
    
    return matchesSearch && matchesType && matchesLocation;
  });

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const toggleBookmark = (jobId) => {
    // In a real app, this would update the backend
    console.log(`Toggle bookmark for job ${jobId}`);
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Job Opportunities</h1>
            <p className="text-sm md:text-base text-gray-600">Discover career opportunities posted by our alumni network</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 mb-6 md:mb-8">
            <div className="flex flex-col gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search jobs..."
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
                    value={selectedJobType}
                    onChange={(e) => setSelectedJobType(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-4 md:space-y-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <Avatar className="h-10 w-10 md:h-12 md:w-12">
                        <AvatarImage src={job.companyLogo} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm">
                          {job.company.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 poppins-medium">{job.title}</h3>
                        <p className="text-sm md:text-base text-gray-600">{job.company}</p>
                        <div className="flex items-center text-xs md:text-sm text-gray-500 mt-1">
                          <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                          {job.location}
                          <span className="mx-2">•</span>
                          <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                          {job.postedDate}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-1 md:space-y-0 md:space-x-2">
                      <Badge variant={job.type === 'Full-time' ? 'default' : 'secondary'} className="text-xs">
                        {job.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {job.experience}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {job.applicants} applicants
                  </div>
                  <p className="text-sm md:text-base text-gray-700 mb-4 line-clamp-2">{job.description}</p>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                    <div className="flex flex-wrap gap-1 md:gap-2 mb-4">
                      {job.requirements?.slice(0, 4).map((requirement, requirementIndex) => (
                        <Badge key={requirementIndex} variant="secondary" className="text-xs">
                          {requirement}
                        </Badge>
                      ))}
                      {job.requirements && job.requirements.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{job.requirements.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Benefits:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.benefits?.map((benefit, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
                    <div className="flex items-center text-xs md:text-sm text-gray-600">
                      <DollarSign className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                      {job.salary}
                    </div>
                    <div className="flex space-x-2 w-full md:w-auto">
                      <Button variant="outline" size="sm" className="flex-1 md:flex-none text-xs md:text-sm">
                        <Bookmark className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                        Save
                      </Button>
                      <Button size="sm" className="flex-1 md:flex-none text-xs md:text-sm">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
