import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/selectors/userSelectors';
import { toast } from 'sonner';
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
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [connectionStatuses, setConnectionStatuses] = useState({});
  const [connectionLoading, setConnectionLoading] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector(selectCurrentUser);

  // Get search term from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchFromUrl = urlParams.get('search');
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [location.search]);

  // Fetch alumni data from backend
  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Please login to view alumni directory');
        navigate('/login');
        return;
      }

      // Build query parameters
      const params = new URLSearchParams();
      if (selectedBatch !== 'All') params.append('batch', selectedBatch);
      if (selectedDepartment !== 'All') params.append('branch', selectedDepartment);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());

      const backendUrl = import.meta.env.VITE_BACKEND_URL ?? '';
      const response = await fetch(`${backendUrl}/api/profile/alumni?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setAlumni(data.alumni);
        setPagination(data.pagination);
        // Fetch connection statuses for each alumni
        fetchConnectionStatuses(data.alumni);
      } else {
        toast.error(data.error || 'Failed to fetch alumni data');
      }
    } catch (error) {
      console.error('Fetch alumni error:', error);
      toast.error('Failed to load alumni directory');
    } finally {
      setLoading(false);
    }
  };

  // Fetch connection statuses for alumni
  const fetchConnectionStatuses = async (alumniList) => {
    const token = localStorage.getItem('token');
    const backendUrl = import.meta.env.VITE_BACKEND_URL ?? '';

    const statuses = {};

    for (const alumniProfile of alumniList) {
      try {
        const response = await fetch(`${backendUrl}/api/connections/status/${alumniProfile._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (data.success) {
          statuses[alumniProfile._id] = data.status;
        }
      } catch (error) {
        console.error('Error fetching connection status:', error);
      }
    }

    setConnectionStatuses(statuses);
  };

  // Handle connection request
  const handleConnectionRequest = async (alumniId) => {
    try {
      setConnectionLoading(prev => ({ ...prev, [alumniId]: true }));
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL ?? '';

      const response = await fetch(`${backendUrl}/api/connections/request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          toUserId: alumniId,
          message: 'Hi! I would like to connect with you.'
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Connection request sent successfully!');
        setConnectionStatuses(prev => ({ ...prev, [alumniId]: 'request_sent' }));
      } else {
        toast.error(data.error || 'Failed to send connection request');
      }
    } catch (error) {
      console.error('Connection request error:', error);
      toast.error('Failed to send connection request');
    } finally {
      setConnectionLoading(prev => ({ ...prev, [alumniId]: false }));
    }
  };

  // Handle accept connection request
  const handleAcceptRequest = async (alumniId) => {
    // This would need the request ID, which we'd get from a different endpoint
    // For now, we'll implement this in the connections page
    toast.info('Please visit the Connections page to manage requests');
  };

  // Fetch alumni on component mount and when filters change
  useEffect(() => {
    fetchAlumni();
  }, [selectedBatch, selectedDepartment]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAlumni();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Generate batch years dynamically
  const currentYear = new Date().getFullYear();
  const batches = ["All", ...Array.from({ length: 10 }, (_, i) => (currentYear - i).toString())];
  const departments = ["All", "Computer Science", "Computer Engineering", "Information Technology", "Electronics", "Mechanical", "Civil", "Electrical", "Chemical"];

  // Handle alumni profile card click
  const handleAlumniClick = (alumniId) => {
    navigate(`/alumni/${alumniId}`);
  };

  // Render connection button based on status
  const renderConnectionButton = (alumniId) => {
    const status = connectionStatuses[alumniId];
    const isLoading = connectionLoading[alumniId];

    const handleClick = (e, action) => {
      e.stopPropagation();
      if (action === 'connect') {
        handleConnectionRequest(alumniId);
      } else if (action === 'accept') {
        handleAcceptRequest(alumniId);
      } else if (action === 'view') {
        handleAlumniClick(alumniId);
      }
    };

    if (isLoading) {
      return (
        <Button size="sm" disabled className="bg-gray-400">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
          Loading...
        </Button>
      );
    }

    switch (status) {
      case 'connected':
        return (
          <Button
            size="sm"
            variant="outline"
            className="border-green-500 text-green-600 hover:bg-green-50"
            onClick={(e) => handleClick(e, 'view')}
          >
            Connected
          </Button>
        );

      case 'request_sent':
        return (
          <Button
            size="sm"
            variant="outline"
            className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
            onClick={(e) => handleClick(e, 'view')}
          >
            Request Sent
          </Button>
        );

      case 'request_received':
        return (
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={(e) => handleClick(e, 'accept')}
          >
            Accept Request
          </Button>
        );

      case 'not_connected':
      default:
        return (
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={(e) => handleClick(e, 'connect')}
          >
            Connect
          </Button>
        );
    }
  };

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
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading alumni...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {alumni.map((alumniProfile) => (
                <Card
                  key={alumniProfile._id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleAlumniClick(alumniProfile._id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 md:space-x-4 mb-4">
                        <Avatar className="h-12 w-12 md:h-16 md:w-16">
                          <AvatarImage src={alumniProfile.profile?.profileUrl || alumniProfile.profile?.avatarUrl} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm md:text-lg">
                            {alumniProfile.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-base md:text-lg font-semibold text-gray-900 poppins-medium">{alumniProfile.name}</h3>
                          <p className="text-xs md:text-sm text-gray-600">{alumniProfile.batch} Graduate</p>
                          <Badge variant="outline" className="mt-1 text-xs">{alumniProfile.profile?.branch || 'Not specified'}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        {alumniProfile.profile?.branch || 'Not specified'}
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-xs md:text-sm text-gray-600">
                          <Building className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                          {alumniProfile.profile?.currentCompany || 'Not specified'}
                        </div>
                        <div className="flex items-center text-xs md:text-sm text-gray-600">
                          <Briefcase className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                          {alumniProfile.profile?.currentPosition || 'Not specified'}
                        </div>
                        <div className="flex items-center text-xs md:text-sm text-gray-600">
                          <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                          {alumniProfile.profile?.location || 'Not specified'}
                        </div>
                      </div>
                      <Separator className="my-3" />
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          {alumniProfile.profile?.linkedin && (
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Linkedin className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        {renderConnectionButton(alumniProfile._id)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && alumni.length === 0 && (
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
