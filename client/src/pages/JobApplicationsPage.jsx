import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft,
  Download,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  MessageCircle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import BottomBar from '../components/BottomBar';
import { jobService } from '../services/jobService';

const JobApplicationsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { currentUser: user } = useSelector((state) => state.user);
  
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [updatingApplicationId, setUpdatingApplicationId] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', notes: '' });

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
                <p className="text-gray-500 mb-4">Only alumni can view job applications.</p>
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

  // Fetch job applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      
      const filters = {
        status: selectedStatus,
        page: 1,
        limit: 50
      };
      
      const response = await jobService.getJobApplications(jobId, filters);
      setApplications(response.applications || []);
      setJob(response.job || null);
    } catch (err) {
      setError(err.message || 'Failed to fetch applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchApplications();
    }
  }, [jobId, selectedStatus]);

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

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedApplication || !statusUpdate.status) return;

    try {
      setUpdatingApplicationId(selectedApplication._id);
      
      await jobService.updateApplicationStatus(
        selectedApplication._id, 
        statusUpdate.status, 
        statusUpdate.notes
      );
      
      // Update local state
      setApplications(prev => prev.map(app => 
        app._id === selectedApplication._id 
          ? { ...app, status: statusUpdate.status, notes: statusUpdate.notes }
          : app
      ));
      
      setShowStatusModal(false);
      setSelectedApplication(null);
      setStatusUpdate({ status: '', notes: '' });
      
    } catch (err) {
      alert(err.message || 'Failed to update application status');
      console.error('Error updating application status:', err);
    } finally {
      setUpdatingApplicationId(null);
    }
  };

  // Open status update modal
  const openStatusModal = (application) => {
    setSelectedApplication(application);
    setStatusUpdate({ 
      status: application.status, 
      notes: application.notes || '' 
    });
    setShowStatusModal(true);
  };

  const statusOptions = [
    { value: 'all', label: 'All Applications' },
    { value: 'pending', label: 'Pending' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'hired', label: 'Hired' }
  ];

  const statusUpdateOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'hired', label: 'Hired' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 poppins-regular">
        <Sidebar />
        <BottomBar />
        <div className="md:ml-64 pb-20 md:pb-0 min-h-screen overflow-auto bg-gray-50">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading applications...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 poppins-regular">
        <Sidebar />
        <BottomBar />
        <div className="md:ml-64 pb-20 md:pb-0 min-h-screen overflow-auto bg-gray-50">
          <div className="p-3 md:p-8 max-w-6xl mx-auto">
            <Card className="text-center py-12">
              <CardContent>
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading applications</h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => navigate('/jobs/my-jobs')} variant="outline">
                    My Jobs
                  </Button>
                  <Button onClick={fetchApplications}>
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 poppins-regular">
      <Sidebar />
      <BottomBar />

      <div className="md:ml-64 pb-20 md:pb-0 min-h-screen overflow-auto bg-gray-50">
        <div className="p-3 md:p-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/jobs/my-jobs')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              My Jobs
            </Button>
          </div>

          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Applications for {job?.title}
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              {job?.company} • {applications.length} applications received
            </p>
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

          {/* Applications List */}
          <div className="space-y-4 md:space-y-6">
            {applications.map((application) => (
              <Card key={application._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="h-12 w-12 md:h-16 md:w-16">
                        <AvatarImage src={application.applicant?.profile?.avatarUrl} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                          {application.applicant?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {application.applicant?.name}
                            </h3>
                            <p className="text-gray-600">
                              {application.applicant?.profile?.currentPosition} 
                              {application.applicant?.profile?.currentCompany && 
                                ` at ${application.applicant?.profile?.currentCompany}`
                              }
                            </p>
                          </div>
                          <Badge variant={getStatusBadgeVariant(application.status)} className="text-xs">
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                          {application.applicant?.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {application.applicant.email}
                            </div>
                          )}
                          {application.applicant?.profile?.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {application.applicant.profile.phone}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Applied {formatTimeAgo(application.appliedAt)}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                          {application.applicant?.batch && (
                            <span>Batch: {application.applicant.batch}</span>
                          )}
                          {application.applicant?.profile?.branch && (
                            <span>Branch: {application.applicant.profile.branch}</span>
                          )}
                        </div>

                        {application.coverLetter && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Cover Letter:</h4>
                            <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                              {application.coverLetter}
                            </p>
                          </div>
                        )}

                        {application.notes && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Notes:</h4>
                            <p className="text-gray-700 text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                              {application.notes}
                            </p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(application.resumeUrl, '_blank')}
                            className="flex items-center gap-1"
                          >
                            <Download className="h-3 w-3" />
                            View Resume
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/chat/user/${application.applicant._id}`)}
                            className="flex items-center gap-1"
                          >
                            <MessageCircle className="h-3 w-3" />
                            Message
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openStatusModal(application)}
                            disabled={updatingApplicationId === application._id}
                            className="flex items-center gap-1"
                          >
                            {updatingApplicationId === application._id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle className="h-3 w-3" />
                            )}
                            Update Status
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {applications.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {selectedStatus === 'all' ? 'No applications yet' : `No ${selectedStatus} applications`}
                </h3>
                <p className="text-gray-500">
                  {selectedStatus === 'all' 
                    ? 'Applications will appear here once candidates start applying to your job.'
                    : `There are no ${selectedStatus} applications for this job.`
                  }
                </p>
              </CardContent>
            </Card>
          )}

          {/* Status Update Modal */}
          {showStatusModal && selectedApplication && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Update Application Status</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowStatusModal(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Applicant: {selectedApplication.applicant?.name}</Label>
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={statusUpdate.status}
                      onChange={(e) => setStatusUpdate(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1"
                    >
                      {statusUpdateOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any notes about this application..."
                      value={statusUpdate.notes}
                      onChange={(e) => setStatusUpdate(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowStatusModal(false)}
                      className="flex-1"
                      disabled={updatingApplicationId === selectedApplication._id}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleStatusUpdate}
                      disabled={!statusUpdate.status || updatingApplicationId === selectedApplication._id}
                      className="flex-1"
                    >
                      {updatingApplicationId === selectedApplication._id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Status'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplicationsPage;
