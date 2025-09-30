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
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          
          {/* Profile Header Card */}
          <Card className="mb-6 md:mb-8 shadow-sm border-0 bg-white">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                
                {/* Profile Info Section */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1">
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="h-24 w-24 md:h-28 md:w-28 border-4 border-white shadow-lg">
                      <AvatarImage src={userProfile.profile?.profileUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl md:text-3xl font-bold">
                        {userProfile.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {userProfile.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                        <Award className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Name and Details */}
                  <div className="text-center sm:text-left flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {userProfile.name}
                      </h1>
                      <Badge 
                        variant="secondary" 
                        className={`px-3 py-1 text-xs font-medium ${
                          userProfile.role === 'alumni' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
                      </Badge>
                    </div>
                    
                    {/* Position/Role */}
                    {userProfile.profile?.currentPosition && (
                      <p className="text-lg text-gray-700 font-medium mb-1">
                        {userProfile.profile.currentPosition}
                      </p>
                    )}
                    
                    {/* Company */}
                    {userProfile.profile?.currentCompany && (
                      <p className="text-gray-600 mb-2">
                        at {userProfile.profile.currentCompany}
                      </p>
                    )}
                    
                    {/* Batch/Year */}
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500 mb-3">
                      <GraduationCap className="h-4 w-4" />
                      <span>
                        {userProfile.role === 'alumni' 
                          ? `Class of ${userProfile.batch}` 
                          : `Batch ${userProfile.batch}`
                        }
                      </span>
                      {userProfile.profile?.branch && (
                        <>
                          <span>•</span>
                          <span>{userProfile.profile.branch}</span>
                        </>
                      )}
                    </div>

                    {/* Bio */}
                    {userProfile.profile?.bio && (
                      <p className="text-gray-700 text-sm md:text-base leading-relaxed max-w-2xl">
                        {userProfile.profile.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Edit Button */}
                <Button 
                  onClick={handleEditProfile} 
                  className="bg-blue-600 hover:bg-blue-700 shadow-sm w-full sm:w-auto"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Contact & Links */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Contact Information */}
              <Card className="shadow-sm border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-blue-600" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 break-all">{userProfile.email}</span>
                  </div>
                  
                  {userProfile.profile?.phone && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{userProfile.profile.phone}</span>
                    </div>
                  )}
                  
                  {userProfile.profile?.location && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{userProfile.profile.location}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Social Links */}
              {(userProfile.profile?.linkedin || userProfile.profile?.github || userProfile.profile?.website) && (
                <Card className="shadow-sm border-0">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                      <Globe className="h-5 w-5 mr-2 text-blue-600" />
                      Social Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {userProfile.profile?.linkedin && (
                      <a 
                        href={`https://${userProfile.profile.linkedin}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Linkedin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm text-blue-700 hover:underline truncate">
                          {userProfile.profile.linkedin}
                        </span>
                      </a>
                    )}
                    
                    {userProfile.profile?.github && (
                      <a 
                        href={`https://${userProfile.profile.github}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Github className="h-4 w-4 text-gray-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700 hover:underline truncate">
                          {userProfile.profile.github}
                        </span>
                      </a>
                    )}
                    
                    {userProfile.profile?.website && (
                      <a 
                        href={`https://${userProfile.profile.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <Globe className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-green-700 hover:underline truncate">
                          {userProfile.profile.website}
                        </span>
                      </a>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Professional & Academic Info */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Professional Information - Alumni Only */}
              {userProfile.role === 'alumni' && (userProfile.profile?.currentCompany || userProfile.profile?.currentPosition) && (
                <Card className="shadow-sm border-0">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                      <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                      Professional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userProfile.profile?.currentPosition && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Briefcase className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Position</span>
                          </div>
                          <p className="text-gray-800 font-medium">{userProfile.profile.currentPosition}</p>
                        </div>
                      )}
                      
                      {userProfile.profile?.currentCompany && (
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Building className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-900">Company</span>
                          </div>
                          <p className="text-gray-800 font-medium">{userProfile.profile.currentCompany}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Academic Information */}
              <Card className="shadow-sm border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                    Academic Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userProfile.profile?.branch && (
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <GraduationCap className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-900">Branch</span>
                        </div>
                        <p className="text-gray-800 font-medium">{userProfile.profile.branch}</p>
                      </div>
                    )}
                    
                    {userProfile.batch && (
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Award className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium text-orange-900">
                            {userProfile.role === 'alumni' ? 'Graduation Year' : 'Batch Year'}
                          </span>
                        </div>
                        <p className="text-gray-800 font-medium">{userProfile.batch}</p>
                      </div>
                    )}
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Mail className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">GR Number</span>
                      </div>
                      <p className="text-gray-800 font-medium">{userProfile.GrNo}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Status */}
              <Card className="shadow-sm border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900">Account Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`h-3 w-3 rounded-full ${userProfile.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <span className="text-sm font-medium text-gray-900">
                        {userProfile.isVerified ? 'Verified Account' : 'Pending Verification'}
                      </span>
                    </div>
                    <Badge variant={userProfile.isVerified ? 'default' : 'secondary'}>
                      {userProfile.isVerified ? 'Verified' : 'Pending'}
                    </Badge>
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
