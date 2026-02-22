import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
  ExternalLink,
  Plus,
  Loader2,
  Users,
  FileText,
  Eye,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import BottomBar from '../components/BottomBar';
import { jobService } from '../services/jobService';

const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser: user } = useSelector((state) => state.user);

  // Tab management
  const activeTab = searchParams.get('tab') || 'browse';

  // Common states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Data states
  const [jobs, setJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [selectedJobForApplications, setSelectedJobForApplications] = useState(null);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  const [deletingJobId, setDeletingJobId] = useState(null);

  // Define tabs based on user role
  const getTabs = () => {
    const baseTabs = [
      { id: 'browse', label: 'Browse Jobs', mobileLabel: 'Browse', icon: Search },
      { id: 'applications', label: 'My Applications', mobileLabel: 'Applications', icon: FileText }
    ];

    if (user?.role === 'alumni') {
      baseTabs.push(
        { id: 'posted', label: 'My Posted Jobs', mobileLabel: 'Posted', icon: Briefcase },
        { id: 'manage', label: 'Manage Applications', mobileLabel: 'Manage', icon: Users }
      );
    }

    return baseTabs;
  };

  // Tab change handler
  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
    setLoading(true);
    setError('');
  };

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');

      const filters = {
        search: searchTerm,
        jobType: selectedJobType,
        location: selectedLocation,
        category: selectedCategory,
        experienceLevel: selectedExperienceLevel,
        page: 1,
        limit: 20
      };

      const response = await jobService.getAllJobs(filters);
      setJobs(response.jobs || []);
      setPagination(response.pagination || {});
    } catch (err) {
      setError(err.message || 'Failed to fetch jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch my posted jobs (Alumni only)
  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      setError('');

      const filters = {
        status: selectedStatus,
        page: 1,
        limit: 20
      };

      const response = await jobService.getMyJobs(filters);
      setMyJobs(response.jobs || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch your jobs');
      console.error('Error fetching my jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch my applications
  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      setError('');

      const filters = {
        status: selectedStatus,
        page: 1,
        limit: 50
      };

      const response = await jobService.getMyApplications(filters);
      setMyApplications(response.applications || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch your applications');
      console.error('Error fetching my applications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch applications for a specific job (Alumni only)
  const fetchJobApplications = async (jobId) => {
    try {
      setLoading(true);
      setError('');

      const filters = {
        status: selectedStatus,
        page: 1,
        limit: 50
      };

      const response = await jobService.getJobApplications(jobId, filters);
      setJobApplications(response.applications || []);
      setSelectedJobForApplications(response.job || null);
    } catch (err) {
      setError(err.message || 'Failed to fetch applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data based on active tab
  useEffect(() => {
    switch (activeTab) {
      case 'browse':
        fetchJobs();
        break;
      case 'applications':
        fetchMyApplications();
        break;
      case 'posted':
        if (user?.role === 'alumni') {
          fetchMyJobs();
        }
        break;
      case 'manage':
        if (user?.role === 'alumni' && myJobs.length > 0) {
          // Auto-select first job for applications view
          fetchJobApplications(myJobs[0]._id);
        }
        break;
      default:
        fetchJobs();
    }
  }, [activeTab, selectedStatus]);

  // Fetch jobs when filters change (only for browse tab)
  useEffect(() => {
    if (activeTab === 'browse') {
      fetchJobs();
    }
  }, [searchTerm, selectedJobType, selectedLocation, selectedCategory, selectedExperienceLevel]);

  // Debounce search term for browse tab
  useEffect(() => {
    if (activeTab === 'browse') {
      const timeoutId = setTimeout(() => {
        fetchJobs();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm]);

  const jobTypes = ["All", "Full-time", "Part-time", "Contract", "Internship", "Remote"];
  const locations = ["All", "Remote", "San Francisco, CA", "Seattle, WA", "New York, NY", "Austin, TX", "Bangalore, India", "Mumbai, India", "Delhi, India"];
  const categories = [
    "All", "Software Development", "Data Science", "Product Management",
    "Design", "Marketing", "Sales", "Finance", "Operations",
    "Human Resources", "Engineering", "Other"
  ];
  const experienceLevels = ["All", "Entry Level", "Mid Level", "Senior Level", "Executive"];

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'hired', label: 'Hired' },
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'closed', label: 'Closed' },
    { value: 'expired', label: 'Expired' }
  ];

  // Handle job deletion
  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingJobId(jobId);
      await jobService.deleteJob(jobId);

      // Remove job from local state
      setMyJobs(prev => prev.filter(job => job._id !== jobId));

    } catch (err) {
      alert(err.message || 'Failed to delete job. Please try again.');
      console.error('Error deleting job:', err);
    } finally {
      setDeletingJobId(null);
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'reviewed': return 'outline';
      case 'shortlisted': return 'default';
      case 'rejected': return 'destructive';
      case 'hired': return 'default';
      case 'active': return 'default';
      case 'paused': return 'secondary';
      case 'closed': return 'outline';
      case 'expired': return 'destructive';
      default: return 'secondary';
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
  };

  // Format salary range
  const formatSalary = (salaryRange) => {
    if (!salaryRange || (!salaryRange.min && !salaryRange.max)) return 'Salary not disclosed';

    const currency = salaryRange.currency || 'USD';
    const symbol = currency === 'USD' ? '$' : currency === 'INR' ? '₹' : currency;

    if (salaryRange.min && salaryRange.max) {
      return `${symbol}${salaryRange.min.toLocaleString()} - ${symbol}${salaryRange.max.toLocaleString()}`;
    } else if (salaryRange.min) {
      return `${symbol}${salaryRange.min.toLocaleString()}+`;
    } else if (salaryRange.max) {
      return `Up to ${symbol}${salaryRange.max.toLocaleString()}`;
    }

    return 'Salary not disclosed';
  };

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
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Job Board</h1>
                <p className="text-sm md:text-base text-gray-600">Manage all your job-related activities in one place</p>
              </div>
              {user?.role === 'alumni' && (
                <Button
                  onClick={() => navigate('/jobs/post')}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Post New Job
                </Button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-1 md:space-x-8 overflow-x-auto scrollbar-hide">
                {getTabs().map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex items-center gap-1 md:gap-2 py-2 px-2 md:px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ${isActive
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                      <Icon className="h-4 w-4 hidden md:block" />
                      <span className="md:hidden">{tab.mobileLabel}</span>
                      <span className="hidden md:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'browse' && (
            <>
              {/* Search and Filters for Browse Tab */}
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <select
                        value={selectedJobType}
                        onChange={(e) => setSelectedJobType(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                      >
                        {jobTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select
                        value={selectedExperienceLevel}
                        onChange={(e) => setSelectedExperienceLevel(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                      >
                        {experienceLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                      >
                        {locations.map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-red-500 mb-4">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-lg font-medium">Error loading data</p>
                  <p className="text-sm">{error}</p>
                </div>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Tab Content */}
          {!loading && !error && (
            <>
              {/* Browse Jobs Tab */}
              {activeTab === 'browse' && (
                <div className="space-y-4 md:space-y-6">
                  {jobs.map((job) => (
                    <Card key={job._id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/jobs/${job._id}`)}>
                      <CardContent className="p-4 md:p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3 md:space-x-4">
                            <Avatar className="h-10 w-10 md:h-12 md:w-12">
                              <AvatarImage src={job.postedBy?.profile?.avatarUrl} />
                              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm">
                                {job.company?.charAt(0) || 'C'}
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
                                {formatTimeAgo(job.createdAt)}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col md:flex-row items-start md:items-center space-y-1 md:space-y-0 md:space-x-2">
                            <Badge variant={job.jobType === 'Full-time' ? 'default' : 'secondary'} className="text-xs">
                              {job.jobType}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {job.experienceLevel}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm md:text-base text-gray-700 mb-4 line-clamp-2">{job.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs md:text-sm text-gray-600">
                            <DollarSign className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            {formatSalary(job.salaryRange)}
                          </div>
                          <Button
                            size="sm"
                            className="text-xs md:text-sm"
                            onClick={(e) => { e.stopPropagation(); navigate(`/jobs/${job._id}`) }}
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {jobs.length === 0 && (
                    <Card className="text-center py-12">
                      <CardContent>
                        <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                        <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* My Applications Tab */}
              {activeTab === 'applications' && (
                <>
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {statusOptions.filter(opt => ['all', 'pending', 'reviewed', 'shortlisted', 'rejected', 'hired'].includes(opt.value)).map(option => (
                        <Button
                          key={option.value}
                          variant={selectedStatus === option.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedStatus(option.value)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {myApplications.map((application) => (
                      <Card key={application._id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 md:p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{application.job?.title}</h3>
                              <p className="text-gray-600">{application.job?.company}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                                <span>Applied {formatTimeAgo(application.appliedAt)}</span>
                                <Badge variant={getStatusBadgeVariant(application.status)} className="text-xs">
                                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/jobs/${application.job._id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Job
                            </Button>
                          </div>
                          {application.coverLetter && (
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mb-3">
                              {application.coverLetter}
                            </p>
                          )}
                          {application.notes && (
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                              <p className="text-sm font-medium text-blue-900 mb-1">Employer Notes:</p>
                              <p className="text-sm text-blue-800">{application.notes}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}

                    {myApplications.length === 0 && (
                      <Card className="text-center py-12">
                        <CardContent>
                          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                          <p className="text-gray-500 mb-4">Start applying to jobs to see your applications here.</p>
                          <Button onClick={() => handleTabChange('browse')}>
                            Browse Jobs
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </>
              )}

              {/* My Posted Jobs Tab (Alumni only) */}
              {activeTab === 'posted' && user?.role === 'alumni' && (
                <>
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {statusOptions.filter(opt => ['all', 'active', 'paused', 'closed', 'expired'].includes(opt.value)).map(option => (
                        <Button
                          key={option.value}
                          variant={selectedStatus === option.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedStatus(option.value)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {myJobs.map((job) => (
                      <Card key={job._id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 md:p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                                <Badge variant={getStatusBadgeVariant(job.status)} className="text-xs">
                                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-gray-600">{job.company} • {job.location}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                                <span>Posted {formatTimeAgo(job.createdAt)}</span>
                                <span>{job.applicationsCount || 0} applications</span>
                                <span>{job.viewsCount || 0} views</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchJobApplications(job._id)}
                              >
                                <Users className="h-4 w-4 mr-2" />
                                Applications ({job.applicationsCount || 0})
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/jobs/${job._id}`)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteJob(job._id)}
                                disabled={deletingJobId === job._id}
                                className="text-red-600 hover:text-red-700"
                              >
                                {deletingJobId === job._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">{job.description}</p>
                        </CardContent>
                      </Card>
                    ))}

                    {myJobs.length === 0 && (
                      <Card className="text-center py-12">
                        <CardContent>
                          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
                          <p className="text-gray-500 mb-4">Start by posting your first job opportunity.</p>
                          <Button onClick={() => navigate('/jobs/post')}>
                            <Plus className="h-4 w-4 mr-2" />
                            Post Your First Job
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </>
              )}

              {/* Manage Applications Tab (Alumni only) */}
              {activeTab === 'manage' && user?.role === 'alumni' && (
                <>
                  {selectedJobForApplications ? (
                    <>
                      <div className="mb-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Applications for: {selectedJobForApplications.title}</h3>
                            <p className="text-gray-600">{jobApplications.length} applications received</p>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedJobForApplications(null);
                              setJobApplications([]);
                            }}
                          >
                            Back to Jobs
                          </Button>
                        </div>
                      </div>


                      <div className="space-y-4">
                        {jobApplications.map((application) => (
                          <Card key={application._id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-4 md:p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage src={application.applicant?.profile?.avatarUrl} />
                                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                      {application.applicant?.name?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="font-semibold text-gray-900">{application.applicant?.name}</h4>
                                    <p className="text-gray-600">{application.applicant?.profile?.currentPosition}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                      <span>Applied {formatTimeAgo(application.appliedAt)}</span>
                                      <Badge variant={getStatusBadgeVariant(application.status)} className="text-xs">
                                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(application.resumeUrl, '_blank')}
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Resume
                                  </Button>
                                </div>
                              </div>
                              {application.coverLetter && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-sm font-medium text-gray-900 mb-1">Cover Letter:</p>
                                  <p className="text-sm text-gray-700">{application.coverLetter}</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}

                        {jobApplications.length === 0 && (
                          <Card className="text-center py-12">
                            <CardContent>
                              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                              <p className="text-gray-500">Applications will appear here once candidates start applying.</p>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </>
                  ) : (
                    <Card className="text-center py-12">
                      <CardContent>
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Select a job to manage applications</h3>
                        <p className="text-gray-500 mb-4">Go to "My Posted Jobs" tab and click on a job to view its applications.</p>
                        <Button onClick={() => handleTabChange('posted')}>
                          View My Jobs
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
