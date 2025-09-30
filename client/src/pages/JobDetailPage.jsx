import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft,
  MapPin, 
  Clock, 
  DollarSign, 
  Building,
  Users,
  Eye,
  Calendar,
  FileText,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import BottomBar from '../components/BottomBar';
import { jobService } from '../services/jobService';

const JobDetailPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { currentUser: user } = useSelector((state) => state.user);
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: null
  });
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await jobService.getJobById(jobId);
        setJob(response.job);
      } catch (err) {
        setError(err.message || 'Failed to fetch job details');
        console.error('Error fetching job details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

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

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file for your resume.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should be less than 5MB.');
        return;
      }
      setApplicationData(prev => ({ ...prev, resume: file }));
    }
  };

  // Handle job application
  const handleApply = async () => {
    if (!applicationData.resume) {
      alert('Please upload your resume to apply.');
      return;
    }

    try {
      setApplying(true);
      
      const formData = new FormData();
      formData.append('resume', applicationData.resume);
      if (applicationData.coverLetter.trim()) {
        formData.append('coverLetter', applicationData.coverLetter);
      }

      await jobService.applyToJob(jobId, formData);
      
      setApplicationSuccess(true);
      setShowApplicationForm(false);
      
      // Update job state to reflect application
      setJob(prev => ({ ...prev, hasApplied: true }));
      
    } catch (err) {
      alert(err.message || 'Failed to submit application. Please try again.');
      console.error('Error applying to job:', err);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 poppins-regular">
        <Sidebar />
        <BottomBar />
        <div className="md:ml-64 pb-20 md:pb-0 min-h-screen overflow-auto bg-gray-50">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading job details...</span>
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
          <div className="p-3 md:p-8 max-w-4xl mx-auto">
            <Card className="text-center py-12">
              <CardContent>
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading job</h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => navigate('/jobs')} variant="outline">
                    Back to Jobs
                  </Button>
                  <Button onClick={() => window.location.reload()}>
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

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 poppins-regular">
        <Sidebar />
        <BottomBar />
        <div className="md:ml-64 pb-20 md:pb-0 min-h-screen overflow-auto bg-gray-50">
          <div className="p-3 md:p-8 max-w-4xl mx-auto">
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Job not found</h3>
                <p className="text-gray-500 mb-4">The job you're looking for doesn't exist or has been removed.</p>
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

  return (
    <div className="min-h-screen bg-gray-50 poppins-regular">
      <Sidebar />
      <BottomBar />

      <div className="md:ml-64 pb-20 md:pb-0 min-h-screen overflow-auto bg-gray-50">
        <div className="p-3 md:p-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/jobs')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Button>
          </div>

          {/* Success Message */}
          {applicationSuccess && (
            <Card className="mb-6 border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-900">Application Submitted Successfully!</h4>
                    <p className="text-sm text-green-700">Your application has been sent to the employer. They will contact you if you're selected.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Job Header Card */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={job.postedBy?.profile?.avatarUrl} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-lg">
                      {job.company?.charAt(0) || 'C'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                    <div className="flex items-center gap-2 text-lg text-gray-700 mb-2">
                      <Building className="h-5 w-5" />
                      {job.company}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatTimeAgo(job.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {job.applicationsCount || 0} applicants
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {job.viewsCount || 0} views
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      Posted by {job.postedBy?.name} • {job.postedBy?.profile?.currentPosition} at {job.postedBy?.profile?.currentCompany}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={job.jobType === 'Full-time' ? 'default' : 'secondary'}>
                      {job.jobType}
                    </Badge>
                    <Badge variant="outline">
                      {job.experienceLevel}
                    </Badge>
                    <Badge variant="secondary">
                      {job.category}
                    </Badge>
                    {job.isUrgent && (
                      <Badge variant="destructive">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  
                  
                  {!job.hasApplied ? (
                    <Button 
                      onClick={() => setShowApplicationForm(true)}
                      className="w-full"
                      disabled={job.status !== 'active'}
                    >
                      Apply Now
                    </Button>
                  ) : (
                    <Button disabled className="w-full">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Applied
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{job.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {job.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Responsibilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {job.responsibilities.map((responsibility, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Benefits & Perks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {job.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Job Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Salary</span>
                    <span className="font-medium">{formatSalary(job.salaryRange)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Job Type</span>
                    <span className="font-medium">{job.jobType}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-medium">{job.experienceLevel}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Work Mode</span>
                    <span className="font-medium">{job.workMode}</span>
                  </div>
                  {job.applicationDeadline && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Deadline</span>
                        <span className="font-medium">
                          {new Date(job.applicationDeadline).toLocaleDateString()}
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Required Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            </div>
          </div>

          {/* Application Form Modal */}
          {showApplicationForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle>Apply for {job.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="resume">Resume (PDF) *</Label>
                    <div className="mt-2">
                      <input
                        type="file"
                        id="resume"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('resume').click()}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {applicationData.resume ? applicationData.resume.name : 'Upload Resume'}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                    <Textarea
                      id="coverLetter"
                      placeholder="Tell the employer why you're interested in this position..."
                      value={applicationData.coverLetter}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                      rows={4}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowApplicationForm(false)}
                      className="flex-1"
                      disabled={applying}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleApply}
                      disabled={!applicationData.resume || applying}
                      className="flex-1"
                    >
                      {applying ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Applying...
                        </>
                      ) : (
                        'Submit Application'
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

export default JobDetailPage;
