import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import AdminBottomBar from '../../components/AdminBottomBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  Briefcase, 
  Calendar, 
  FileText,
  TrendingUp,
  AlertCircle,
  Activity,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Shield
} from 'lucide-react';
import { Toaster, toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      
      const response = await fetch(`${backendUrl}/api/admin/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setDashboardData(data.data);
      } else {
        toast.error('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast.error('Network error while fetching dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, description, onClick }) => (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${onClick ? 'hover:scale-105' : ''}`} onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </CardContent>
    </Card>
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 md:ml-64">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
        <AdminBottomBar />
      </div>
    );
  }

  const { overview, recentUsers, recentLogs, departmentStats } = dashboardData || {};

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="text-white w-4 h-4" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 poppins-semibold">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome to Alumni Bridge management panel</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => navigate('/admin/users?filter=pending')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Verify Users
              </Button>
              
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <div className="p-4 md:p-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={overview?.totalUsers || 0}
              icon={Users}
              color="text-blue-600"
              description="All registered users"
              onClick={() => navigate('/admin/users')}
            />
            <StatCard
              title="Pending Verifications"
              value={overview?.pendingVerifications || 0}
              icon={AlertCircle}
              color="text-orange-600"
              description="Users awaiting approval"
              onClick={() => navigate('/admin/users?filter=pending')}
            />
            <StatCard
              title="Alumni"
              value={overview?.totalAlumni || 0}
              icon={GraduationCap}
              color="text-green-600"
              description="Verified alumni"
              onClick={() => navigate('/admin/users?role=alumni')}
            />
            <StatCard
              title="Students"
              value={overview?.totalStudents || 0}
              icon={Users}
              color="text-purple-600"
              description="Current students"
              onClick={() => navigate('/admin/users?role=student')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Active Jobs"
              value={overview?.totalJobs || 0}
              icon={Briefcase}
              color="text-indigo-600"
              description="Job postings"
              onClick={() => navigate('/admin/jobs')}
            />
            <StatCard
              title="Events"
              value={overview?.totalEvents || 0}
              icon={Calendar}
              color="text-pink-600"
              description="Scheduled events"
              onClick={() => navigate('/admin/events')}
            />
            <StatCard
              title="Posts"
              value={overview?.totalPosts || 0}
              icon={FileText}
              color="text-cyan-600"
              description="User posts"
              onClick={() => navigate('/admin/content')}
            />
            <StatCard
              title="Events"
              value={overview?.totalEvents || 0}
              icon={Calendar}
              color="text-purple-600"
              description="Upcoming events"
              onClick={() => navigate('/admin/events')}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Recent Registrations</span>
                </CardTitle>
                <CardDescription>Latest user registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers?.length > 0 ? recentUsers.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.role === 'alumni' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                        {user.isVerified ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-orange-600" />
                        )}
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-center py-4">No recent registrations</p>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate('/admin/users')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View All Users
                </Button>
              </CardContent>
            </Card>

            {/* Recent Admin Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span>Recent Admin Activity</span>
                </CardTitle>
                <CardDescription>Latest admin actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentLogs?.length > 0 ? recentLogs.map((log) => (
                    <div key={log._id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {log.action.includes('verified') && <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />}
                        {log.action.includes('created') && <FileText className="w-4 h-4 text-blue-600 mt-0.5" />}
                        {log.action.includes('deleted') && <XCircle className="w-4 h-4 text-red-600 mt-0.5" />}
                        {log.action.includes('login') && <Activity className="w-4 h-4 text-purple-600 mt-0.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{log.details}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-gray-500">by {log.admin?.name}</p>
                          <span className="text-xs text-gray-400">•</span>
                          <p className="text-xs text-gray-500">{formatDate(log.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-center py-4">No recent activity</p>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate('/admin/logs')}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  View All Logs
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Department Statistics */}
          {departmentStats?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <span>Department Statistics</span>
                </CardTitle>
                <CardDescription>User distribution across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departmentStats.map((dept) => (
                    <div key={dept._id} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">{dept._id || 'Not Specified'}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-medium">{dept.total}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Students:</span>
                          <span className="text-blue-600">{dept.students}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Alumni:</span>
                          <span className="text-green-600">{dept.alumni}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Verified:</span>
                          <span className="text-purple-600">{dept.verified}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          </div>
        </div>

        <AdminBottomBar />
      </div>

      <Toaster position="top-right" />
    </div>
  );
};

export default AdminDashboard;