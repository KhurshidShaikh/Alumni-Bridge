import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  Eye,
  Users,
  Edit,
  Trash2,
  MoreVertical,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import BottomBar from '../components/BottomBar';
import { jobService } from '../services/jobService';

const MyJobsPage = () => {
  const navigate = useNavigate();
  const { currentUser: user } = useSelector((state) => state.user);
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [deletingJobId, setDeletingJobId] = useState(null);

  // Check if user is alumni
  if (user?.role !== 'alumni') {
    return (
      <div className="min-h-screen bg-gray-50 poppins-regular">
        <Sidebar />
        <BottomBar />
        <div className="md:ml-64 pb-20 md:pb-0 min-h-screen overflow-auto bg-gray-50">
          <div className="p-3 md:p-8 max-w-6xl mx-auto">
            <Card className="text-center py-12">
              <CardContent>
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
                <p className="text-gray-500 mb-4">Only alumni can access job management.</p>
                <Button onClick={() => navigate('/jobs')}>
                  Back to Jobs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Fetch user's jobs
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
      setJobs(response.jobs || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch your jobs');
      console.error('Error fetching my jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, [selectedStatus]);

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

  // Handle job deletion
  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingJobId(jobId);
      await jobService.deleteJob(jobId);
      
      // Remove job from local state
      setJobs(prev => prev.filter(job => job._id !== jobId));
      
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
      case 'active': return 'default';
      case 'paused': return 'secondary';
      case 'closed': return 'outline';
      case 'expired': return 'destructive';
      default: return 'secondary';
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Jobs' },
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'closed', label: 'Closed' },
    { value: 'expired', label: 'Expired' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 poppins-regular">
      <Sidebar />
      <BottomBar />

      <div className="md:ml-64 pb-20 md:pb-0 min-h-screen overflow-auto bg-gray-50">
        <div className="p-3 md:p-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Job Postings</h1>
                <p className="text-sm md:text-base text-gray-600">Manage your job postings and view applications</p>
              </div>
              <Button 
                onClick={() => navigate('/jobs/post')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Post New Job
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 mb-6 md:mb-8">
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(option => (
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

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading your jobs...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="text-center py-12">
              <CardContent>
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading jobs</h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <Button onClick={fetchMyJobs} variant="outline">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Job Listings */}
          {!loading && !error && (
            <div className="space-y-4 md:space-y-6">
              {jobs.map((job) => (
                <Card key={job._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg md:text-xl font-semibold text-gray-900 poppins-medium">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 ml-4">
                            <Badge variant={getStatusBadgeVariant(job.status)} className="text-xs">
                              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </Badge>
                            {job.isUrgent && (
                              <Badge variant="destructive" className="text-xs">
                                Urgent
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm md:text-base text-gray-600 mb-2">{job.company}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-500 mb-3">
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.jobType}</span>
                          <span>•</span>
                          <span>{job.category}</span>
                          <span>•</span>
                          <span>Posted {formatTimeAgo(job.createdAt)}</span>
                        </div>

                        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{job.applicationsCount || 0} applications</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{job.viewsCount || 0} views</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/jobs/${job._id}`)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/jobs/${job._id}/applications`)}
                            className="flex items-center gap-1"
                          >
                            <Users className="h-3 w-3" />
                            Applications ({job.applicationsCount || 0})
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/jobs/${job._id}/edit`)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteJob(job._id)}
                            disabled={deletingJobId === job._id}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:border-red-300"
                          >
                            {deletingJobId === job._id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Application Deadline Warning */}
                    {job.applicationDeadline && new Date(job.applicationDeadline) < new Date() && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-800">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Application deadline has passed</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && jobs.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-gray-400 mb-4">
                  <Users className="h-12 w-12 mx-auto mb-2" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {selectedStatus === 'all' ? 'No job postings yet' : `No ${selectedStatus} jobs`}
                </h3>
                <p className="text-gray-500 mb-4">
                  {selectedStatus === 'all' 
                    ? 'Start by posting your first job opportunity to connect with talented students and alumni.'
                    : `You don't have any ${selectedStatus} job postings at the moment.`
                  }
                </p>
                <Button onClick={() => navigate('/jobs/post')} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Your First Job
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyJobsPage;
