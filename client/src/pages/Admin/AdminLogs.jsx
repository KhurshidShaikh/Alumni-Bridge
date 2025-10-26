import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import AdminBottomBar from '../../components/AdminBottomBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Activity, 
  Filter, 
  Search, 
  CheckCircle, 
  XCircle,
  FileText,
  Users,
  Calendar,
  Briefcase,
  Shield,
  LogIn,
  UserCheck,
  Trash2,
  Edit,
  Plus,
  Download
} from 'lucide-react';
import { Toaster, toast } from "sonner";

const AdminLogs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    action: 'all',
    targetType: 'all',
    adminId: '',
    startDate: '',
    endDate: ''
  });

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    fetchLogs();
  }, [navigate, currentPage, filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 50,
        ...(filters.action !== 'all' && { action: filters.action }),
        ...(filters.targetType !== 'all' && { targetType: filters.targetType }),
        ...(filters.adminId && { adminId: filters.adminId }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      });

      const response = await fetch(`${backendUrl}/api/admin/logs?${params}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setLogs(data.data.logs);
        setPagination(data.data.pagination);
      } else {
        toast.error('Failed to fetch admin logs');
      }
    } catch (error) {
      console.error('Fetch logs error:', error);
      toast.error('Network error while fetching logs');
    } finally {
      setLoading(false);
    }
  };

  const exportLogs = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      
      const params = new URLSearchParams({
        ...(filters.action !== 'all' && { action: filters.action }),
        ...(filters.targetType !== 'all' && { targetType: filters.targetType }),
        ...(filters.adminId && { adminId: filters.adminId }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        export: 'csv'
      });

      const response = await fetch(`${backendUrl}/api/admin/logs?${params}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `admin_logs_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success('Logs exported successfully');
      } else {
        toast.error('Failed to export logs');
      }
    } catch (error) {
      console.error('Export logs error:', error);
      toast.error('Network error while exporting logs');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionIcon = (action) => {
    if (action.includes('verified') || action.includes('login')) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (action.includes('created') || action.includes('import')) return <Plus className="w-4 h-4 text-blue-600" />;
    if (action.includes('updated') || action.includes('edited')) return <Edit className="w-4 h-4 text-orange-600" />;
    if (action.includes('deleted') || action.includes('suspended')) return <XCircle className="w-4 h-4 text-red-600" />;
    if (action.includes('logout')) return <LogIn className="w-4 h-4 text-gray-600" />;
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  const getActionColor = (action) => {
    if (action.includes('verified') || action.includes('login')) return 'text-green-600 bg-green-50';
    if (action.includes('created') || action.includes('import')) return 'text-blue-600 bg-blue-50';
    if (action.includes('updated') || action.includes('edited')) return 'text-orange-600 bg-orange-50';
    if (action.includes('deleted') || action.includes('suspended')) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getTargetTypeIcon = (targetType) => {
    switch (targetType) {
      case 'user': return <Users className="w-4 h-4" />;
      case 'announcement': return <FileText className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'job': return <Briefcase className="w-4 h-4" />;
      case 'post': return <FileText className="w-4 h-4" />;
      case 'system': return <Shield className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  if (loading && logs.length === 0) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 md:ml-64">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading admin logs...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-3">
            <Activity className="w-5 h-5 text-blue-600" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Logs</h1>
              <p className="text-xs text-gray-500">Activity Logs</p>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 poppins-semibold">Admin Activity Logs</h1>
              <p className="text-gray-600">Monitor all administrative actions and system activities</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={exportLogs}
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Logs
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <div className="p-4 md:p-6">
          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <Label>Action</Label>
                  <Select value={filters.action} onValueChange={(value) => setFilters({...filters, action: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="login">Login</SelectItem>
                      <SelectItem value="logout">Logout</SelectItem>
                      <SelectItem value="user_verified">User Verified</SelectItem>
                      <SelectItem value="user_suspended">User Suspended</SelectItem>
                      <SelectItem value="user_deleted">User Deleted</SelectItem>
                      <SelectItem value="announcement_created">Announcement Created</SelectItem>
                      <SelectItem value="event_created">Event Created</SelectItem>
                      <SelectItem value="bulk_import">Bulk Import</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Target Type</Label>
                  <Select value={filters.targetType} onValueChange={(value) => setFilters({...filters, targetType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="job">Job</SelectItem>
                      <SelectItem value="post">Post</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                  />
                </div>

                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                  />
                </div>

                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setFilters({ action: 'all', targetType: 'all', adminId: '', startDate: '', endDate: '' })}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logs List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Activity Logs ({pagination.totalLogs || 0})</span>
                </div>
                {loading && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {logs.length > 0 ? (
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div key={log._id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-shrink-0 mt-1">
                        {getActionIcon(log.action)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                          <Badge className={`${getActionColor(log.action)} border-0 text-xs`}>
                            {log.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <div className="flex items-center space-x-1">
                              {getTargetTypeIcon(log.targetType)}
                              <span className="capitalize">{log.targetType}</span>
                            </div>
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-900 mb-2">{log.details}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                {log.admin?.name?.split(' ').map(n => n[0]).join('') || 'A'}
                              </AvatarFallback>
                            </Avatar>
                            <span>{log.admin?.name || 'Unknown Admin'}</span>
                          </div>
                          <span>•</span>
                          <span>{formatDate(log.createdAt)}</span>
                          {log.ipAddress && (
                            <>
                              <span>•</span>
                              <span>IP: {log.ipAddress}</span>
                            </>
                          )}
                        </div>
                        
                        {/* Metadata */}
                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                          <div className="mt-2 p-2 bg-white rounded border">
                            <p className="text-xs text-gray-600 mb-1">Additional Details:</p>
                            <div className="text-xs text-gray-700">
                              {Object.entries(log.metadata).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="font-medium">{key}:</span>
                                  <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No activity logs found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * 50) + 1} to {Math.min(currentPage * 50, pagination.totalLogs)} of {pagination.totalLogs} logs
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!pagination.hasPrev}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!pagination.hasNext}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
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

export default AdminLogs;
