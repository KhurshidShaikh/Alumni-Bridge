import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Linkedin, 
  Github, 
  Globe, 
  Edit, 
  Award, 
  Briefcase, 
  GraduationCap,
  Camera,
  Building,
  Loader2
} from 'lucide-react';
import { toast } from "sonner";
import Sidebar from '../components/Sidebar';
import BottomBar from '../components/BottomBar';
import { selectCurrentUser, selectToken } from '../store/selectors/userSelectors';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const token = useSelector(selectToken);

  // Fetch user profile from backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('http://localhost:3000/api/profile/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success) {
          setUserProfile(data.user);
        } else {
          throw new Error(data.error || 'Failed to fetch profile');
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        setError(error.message);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchUserProfile();
    } else {
      setError('No authentication token found');
      setIsLoading(false);
    }
  }, [token]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleEditProfile = () => {
    if (userProfile) {
      navigate(`/profile/edit/${userProfile._id || userProfile.id}`);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 poppins-regular">
        <Sidebar />
        <BottomBar />
        <div className="md:ml-64 pb-20 md:pb-0 min-h-screen flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-600">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 poppins-regular">
        <Sidebar />
        <BottomBar />
        <div className="md:ml-64 pb-20 md:pb-0 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load profile: {error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 poppins-regular">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Bottom Bar for Mobile */}
      <BottomBar />

      {/* Main Content */}
      <div className="md:ml-64 pb-20 md:pb-0 min-h-screen overflow-auto bg-gray-50">
        <div className="p-3 md:p-8 max-w-7xl mx-auto">
          {/* Profile Header */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-6">
                    <div className="text-center mb-6">
                      <Avatar className="h-20 w-20 md:h-24 md:w-24 mx-auto mb-4">
                        <AvatarImage src={userProfile.profile?.profileUrl} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xl md:text-2xl font-semibold">
                          {userProfile.name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <h2 className="text-lg md:text-xl font-semibold text-gray-900 poppins-medium">{userProfile.name}</h2>
                      <p className="text-sm md:text-base text-gray-600">{userProfile.profile?.currentPosition || userProfile.role}</p>
                      <p className="text-xs md:text-sm text-gray-500">
                        {userProfile.role === 'alumni' ? `Class of ${userProfile.profile?.graduationYear}` : `Batch ${userProfile.profile?.batch}`}
                      </p>
                    </div>
                    <div className="mb-6 md:mb-8">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                      <p className="text-sm md:text-base text-gray-600">Manage your profile information and settings</p>
                    </div>
                    <Badge variant="secondary">{userProfile.role}</Badge>
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 mr-1" />
                      {userProfile.role === 'alumni' ? `Class of ${userProfile.profile?.graduationYear}` : `Batch ${userProfile.profile?.batch}`}
                    </div>
                  </div>
                  <Button onClick={handleEditProfile} className="bg-blue-600 hover:bg-blue-700">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
                
                <p className="text-gray-700 mb-6">{userProfile.profile?.bio || 'No bio available'}</p>
                
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 md:gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{userProfile.email}</span>
                    </div>
                    {userProfile.profile?.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{userProfile.profile.phone}</span>
                      </div>
                    )}
                    {userProfile.profile?.location && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{userProfile.profile.location}</span>
                      </div>
                    )}
                    {userProfile.profile?.linkedin && (
                      <div className="flex items-center space-x-3">
                        <Linkedin className="h-4 w-4 text-gray-500" />
                        <a href={`https://${userProfile.profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                          {userProfile.profile.linkedin}
                        </a>
                      </div>
                    )}
                    {userProfile.profile?.github && (
                      <div className="flex items-center space-x-3">
                        <Github className="h-4 w-4 text-gray-500" />
                        <a href={`https://${userProfile.profile.github}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                          {userProfile.profile.github}
                        </a>
                      </div>
                    )}
                    {userProfile.profile?.website && (
                      <div className="flex items-center space-x-3">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <a href={`https://${userProfile.profile.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                          {userProfile.profile.website}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              {userProfile.role === 'alumni' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {userProfile.profile?.currentCompany && (
                        <div className="flex items-center space-x-3">
                          <Building className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{userProfile.profile.currentCompany}</span>
                        </div>
                      )}
                      {userProfile.profile?.currentPosition && (
                        <div className="flex items-center space-x-3">
                          <Briefcase className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{userProfile.profile.currentPosition}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Academic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Academic Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userProfile.profile?.branch && (
                      <div className="flex items-center space-x-3">
                        <GraduationCap className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{userProfile.profile.branch}</span>
                      </div>
                    )}
                    {userProfile.profile?.graduationYear && (
                      <div className="flex items-center space-x-3">
                        <Award className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Graduated: {userProfile.profile.graduationYear}</span>
                      </div>
                    )}
                    {userProfile.profile?.batch && (
                      <div className="flex items-center space-x-3">
                        <Award className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Batch: {userProfile.profile.batch}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">GR: {userProfile.grNo}</span>
                    </div>
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

export default ProfilePage;
