import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/selectors/userSelectors';
import { toast } from 'sonner';
import { 
  ArrowLeft,
  MapPin, 
  Building, 
  GraduationCap, 
  Mail, 
  Phone, 
  Linkedin, 
  Github,
  Globe,
  Calendar,
  Award,
  MessageCircle,
  UserPlus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Sidebar from '../components/Sidebar';
import BottomBar from '../components/BottomBar';

const AlumniDetailPage = () => {
  const { alumniId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch alumni profile data
  const fetchAlumniProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to view alumni profiles');
        navigate('/login');
        return;
      }

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      const response = await fetch(`${backendUrl}/api/profile/alumni/${alumniId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setAlumni(data.alumni);
      } else {
        toast.error(data.error || 'Failed to fetch alumni profile');
        navigate('/alumni');
      }
    } catch (error) {
      console.error('Fetch alumni profile error:', error);
      toast.error('Failed to load alumni profile');
      navigate('/alumni');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (alumniId) {
      fetchAlumniProfile();
    }
  }, [alumniId]);

  const handleBack = () => {
    navigate('/alumni');
  };

  const handleConnect = () => {
    // TODO: Implement connection functionality
    toast.success('Connection request sent!');
  };

  const handleMessage = async () => {
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

      // Get or create conversation
      const response = await fetch(`${backendUrl}/api/messages/conversation/${alumni._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        // Navigate to chat page with conversation ID
        navigate(`/chat/${data.conversation._id}`);
      } else {
        toast.error(data.error || 'Failed to start conversation');
      }
    } catch (error) {
      console.error('Start conversation error:', error);
      toast.error('Failed to start conversation');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 poppins-regular">
        <Sidebar />
        <BottomBar />
        <div className="md:ml-64 pb-20 md:pb-0 min-h-screen overflow-auto bg-gray-50">
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading alumni profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!alumni) {
    return (
      <div className="min-h-screen bg-gray-50 poppins-regular">
        <Sidebar />
        <BottomBar />
        <div className="md:ml-64 pb-20 md:pb-0 min-h-screen overflow-auto bg-gray-50">
          <div className="flex justify-center items-center min-h-screen">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Alumni not found</h2>
              <p className="text-gray-600 mb-4">The alumni profile you're looking for doesn't exist.</p>
              <Button onClick={handleBack}>Back to Alumni Directory</Button>
            </div>
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
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/alumni')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Directory
          </Button>

          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-24 w-24 md:h-32 md:w-32">
                  <AvatarImage src={alumni.profile?.profileUrl || alumni.profile?.avatarUrl} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl md:text-3xl font-semibold">
                    {alumni.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{alumni.name}</h1>
                  <p className="text-lg text-gray-600 mb-2">
                    {alumni.role === 'alumni' 
                      ? (alumni.profile?.currentPosition || 'Alumni') 
                      : (alumni.profile?.currentPosition || 'Student')
                    }
                  </p>
                  <p className="text-base text-gray-500 mb-4">
                    {alumni.role === 'alumni' 
                      ? (alumni.profile?.currentCompany || 'Company not specified')
                      : (alumni.profile?.currentCompany || 'Institution not specified')
                    }
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Class of {alumni.batch}
                    </Badge>
                    <Badge variant="outline">
                      {alumni.profile?.branch || 'Branch not specified'}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button onClick={handleConnect} className="bg-blue-600 hover:bg-blue-700">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                    <Button variant="outline" onClick={handleMessage}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {alumni.profile?.bio || 'No bio available.'}
                  </p>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alumni.profile?.currentCompany && (
                      <div className="flex items-center space-x-3">
                        <Building className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">Current Company</p>
                          <p className="text-gray-600">{alumni.profile.currentCompany}</p>
                        </div>
                      </div>
                    )}
                    
                    {alumni.profile?.currentPosition && (
                      <div className="flex items-center space-x-3">
                        <Award className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">Current Position</p>
                          <p className="text-gray-600">{alumni.profile.currentPosition}</p>
                        </div>
                      </div>
                    )}

                    {alumni.profile?.location && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">Location</p>
                          <p className="text-gray-600">{alumni.profile.location}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Academic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Academic Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{alumni.profile?.branch || 'Branch not specified'}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Graduated: {alumni.batch}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">GR: {alumni.grNo}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alumni.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <a 
                          href={`mailto:${alumni.email}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {alumni.email}
                        </a>
                      </div>
                    )}
                    
                    {alumni.profile?.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <a 
                          href={`tel:${alumni.profile.phone}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {alumni.profile.phone}
                        </a>
                      </div>
                    )}

                    {alumni.profile?.linkedin && (
                      <div className="flex items-center space-x-3">
                        <Linkedin className="h-4 w-4 text-gray-500" />
                        <a 
                          href={alumni.profile.linkedin.startsWith('http') ? alumni.profile.linkedin : `https://${alumni.profile.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    )}

                    {alumni.profile?.github && (
                      <div className="flex items-center space-x-3">
                        <Github className="h-4 w-4 text-gray-500" />
                        <a 
                          href={alumni.profile.github.startsWith('http') ? alumni.profile.github : `https://${alumni.profile.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          GitHub Profile
                        </a>
                      </div>
                    )}

                    {alumni.profile?.website && (
                      <div className="flex items-center space-x-3">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <a 
                          href={alumni.profile.website.startsWith('http') ? alumni.profile.website : `https://${alumni.profile.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Personal Website
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniDetailPage;
