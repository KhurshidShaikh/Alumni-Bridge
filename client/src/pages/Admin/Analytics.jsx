import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminBottomBar from '../../components/AdminBottomBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Calendar,
  GraduationCap,
  Briefcase,
  MessageSquare,
  Activity,
  Download,
  RefreshCw,
  Eye,
  UserCheck,
  FileText
} from 'lucide-react';
import { Toaster, toast } from "sonner";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      
      const response = await fetch(`${backendUrl}/api/admin/analytics?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setAnalyticsData(data.data);
      } else {
        toast.error(data.error || 'Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, description, trend }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
            {trend && (
              <div className="flex items-center mt-2">
                <TrendingUp className={`w-4 h-4 mr-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`} />
                <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend > 0 ? '+' : ''}{trend}% from last period
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DepartmentCard = ({ department, stats }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{department}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Users</span>
            <span className="font-semibold">{stats.totalUsers}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Alumni</span>
            <span className="font-semibold text-blue-600">{stats.alumni}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Students</span>
            <span className="font-semibold text-green-600">{stats.students}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Active This Month</span>
            <span className="font-semibold text-purple-600">{stats.activeThisMonth}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 md:ml-64">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading analytics...</p>
            </div>
          </div>
        </div>
        <AdminBottomBar />
      </div>
    );
  }

  const { overview, departmentStats, recentActivity, growthMetrics } = analyticsData || {};

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Analytics</h1>
              <p className="text-xs text-gray-500">Platform Insights</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <div className="p-4 md:p-8">
          {/* Header */}
          <div className="hidden md:flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Platform insights and performance metrics</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchAnalytics} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={overview?.totalUsers || 0}
              icon={Users}
              color="bg-blue-600"
              description="Registered users"
              trend={growthMetrics?.userGrowth}
            />
            <StatCard
              title="Active Users"
              value={overview?.activeUsers || 0}
              icon={Activity}
              color="bg-green-600"
              description="Active this month"
              trend={growthMetrics?.activityGrowth}
            />
            <StatCard
              title="Job Posts"
              value={overview?.totalJobs || 0}
              icon={Briefcase}
              color="bg-purple-600"
              description="Total job postings"
              trend={growthMetrics?.jobGrowth}
            />
            <StatCard
              title="Connections"
              value={overview?.totalConnections || 0}
              icon={MessageSquare}
              color="bg-orange-600"
              description="Alumni connections"
              trend={growthMetrics?.connectionGrowth}
            />
          </div>

          {/* Engagement Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>Platform Engagement</span>
                </CardTitle>
                <CardDescription>User activity and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Eye className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Profile Views</span>
                      </div>
                      <span className="text-xl font-bold text-blue-600">
                        {overview?.profileViews || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Messages Sent</span>
                      </div>
                      <span className="text-xl font-bold text-green-600">
                        {overview?.messagesSent || 0}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <UserCheck className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">New Registrations</span>
                      </div>
                      <span className="text-xl font-bold text-purple-600">
                        {overview?.newRegistrations || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-orange-600" />
                        <span className="font-medium">Posts Created</span>
                      </div>
                      <span className="text-xl font-bold text-orange-600">
                        {overview?.postsCreated || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span>Growth Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">User Growth Rate</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {growthMetrics?.userGrowth > 0 ? '+' : ''}{growthMetrics?.userGrowth || 0}%
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Engagement Rate</p>
                    <p className="text-2xl font-bold text-green-700">
                      {growthMetrics?.engagementRate || 0}%
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium">Retention Rate</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {growthMetrics?.retentionRate || 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department Statistics */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span>Department-wise Statistics</span>
              </CardTitle>
              <CardDescription>User distribution across different departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {departmentStats && Object.entries(departmentStats).map(([department, stats]) => (
                  <DepartmentCard key={department} department={department} stats={stats} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span>Recent Platform Activity</span>
              </CardTitle>
              <CardDescription>Latest user activities and system events</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm text-gray-900">{activity.description}</span>
                      </div>
                      <span className="text-xs text-gray-500">{activity.timestamp}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activity data available</p>
                </div>
              )}
            </CardContent>
          </Card>
          </div>
        </div>

        <AdminBottomBar />
      </div>

      <Toaster position="top-right" />
    </div>
  );
};

export default Analytics;
