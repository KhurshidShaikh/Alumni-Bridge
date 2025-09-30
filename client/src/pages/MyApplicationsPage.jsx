import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ExternalLink,
  Calendar,
  Building,
  MapPin,
  Loader2,
  AlertCircle,
  FileText,
  Eye
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import BottomBar from '../components/BottomBar';
import { jobService } from '../services/jobService';

const MyApplicationsPage = () => {
  const navigate = useNavigate();
  const { currentUser: user } = useSelector((state) => state.user);
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Fetch user's applications
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
      setApplications(response.applications || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch your applications');
      console.error('Error fetching my applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyApplications();
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

  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'reviewed': return 'outline';
      case 'shortlisted': return 'default';
      case 'rejected': return 'destructive';
      case 'hired': return 'default';
      default: return 'secondary';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'reviewed': return 'text-blue-600';
      case 'shortlisted': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      case 'hired': return 'text-green-700';
      default: return 'text-gray-600';
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Applications' },
    { value: 'pending', label: 'Pending' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'hired', label: 'Hired' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 poppins-regular">
      <Sidebar />
      <BottomBar />

      <div className="md:ml-64 pb-20 md:pb-0 min-h-screen overflow-auto bg-gray-50">
        <div className="p-3 md:p-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
            <p className="text-sm md:text-base text-gray-600">Track the status of your job applications</p>
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
              <span className="ml-2 text-gray-600">Loading your applications...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="text-center py-12">
              <CardContent>
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading applications</h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <Button onClick={fetchMyApplications} variant="outline">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Applications List */}
          {!loading && !error && (
            <div className="space-y-4 md:space-y-6">
              {applications.map((application) => (
                <Card key={application._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="h-12 w-12 md:h-16 md:w-16">
                          <AvatarImage src={`https://logo.clearbit.com/${application.job?.company?.toLowerCase().replace(/\s+/g, '')}.com`} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                            {application.job?.company?.charAt(0) || 'C'}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {application.job?.title}
                              </h3>
                              <p className="text-gray-600 flex items-center gap-1">
                                <Building className="h-4 w-4" />
                                {application.job?.company}
                              </p>
                            </div>
                            <Badge variant={getStatusBadgeVariant(application.status)} className="text-xs">
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {application.job?.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Applied {formatTimeAgo(application.appliedAt)}
                            </div>
                          </div>

                          <div className={`text-sm font-medium mb-3 ${getStatusColor(application.status)}`}>
                            Status: {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            {application.reviewedAt && (
                              <span className="text-gray-500 font-normal ml-2">
                                • Updated {formatTimeAgo(application.reviewedAt)}
                              </span>
                            )}
                          </div>

                          {application.coverLetter && (
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-900 mb-2">Your Cover Letter:</h4>
                              <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg line-clamp-3">
                                {application.coverLetter}
                              </p>
                            </div>
                          )}

                          {application.notes && (
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-900 mb-2">Employer Notes:</h4>
                              <p className="text-gray-700 text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
                                {application.notes}
                              </p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/jobs/${application.job._id}`)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              View Job
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(application.resumeUrl, '_blank')}
                              className="flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View Resume
                            </Button>

                            {application.status === 'shortlisted' && (
                              <Badge variant="default" className="text-xs">
                                🎉 You've been shortlisted!
                              </Badge>
                            )}

                            {application.status === 'hired' && (
                              <Badge variant="default" className="text-xs bg-green-600">
                                🎉 Congratulations! You got the job!
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && applications.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {selectedStatus === 'all' ? 'No applications yet' : `No ${selectedStatus} applications`}
                </h3>
                <p className="text-gray-500 mb-4">
                  {selectedStatus === 'all' 
                    ? 'Start applying to jobs to see your applications here.'
                    : `You don't have any ${selectedStatus} applications at the moment.`
                  }
                </p>
                <Button onClick={() => navigate('/jobs')} className="mt-4">
                  Browse Jobs
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplicationsPage;
