import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Trash2,
  Eye,
  AlertTriangle,
  Clock,
  GraduationCap,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import { Toaster, toast } from "sonner";

const UserManagement = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || 'all');
  const [verificationFilter, setVerificationFilter] = useState(
    searchParams.get('filter') === 'pending' ? 'false' : 'all'
  );
  const [branchFilter, setBranchFilter] = useState('all');
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionDialog, setActionDialog] = useState({ open: false, type: '', user: null });
  const [reason, setReason] = useState('');

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    fetchUsers();
  }, [navigate, currentPage, roleFilter, verificationFilter, branchFilter, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        ...(roleFilter !== 'all' && { role: roleFilter }),
        ...(verificationFilter !== 'all' && { isVerified: verificationFilter }),
        ...(branchFilter !== 'all' && { branch: branchFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`${backendUrl}/api/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data.users);
        setPagination(data.data.pagination);
      } else {
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Fetch users error:', error);
      toast.error('Network error while fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (action, userId, reason = '') => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      
      let endpoint = '';
      let method = '';
      let body = {};

      switch (action) {
        case 'verify':
          endpoint = `${backendUrl}/api/admin/users/${userId}/verify`;
          method = 'PUT';
          break;
        case 'suspend':
          endpoint = `${backendUrl}/api/admin/users/${userId}/suspend`;
          method = 'PUT';
          body = { reason };
          break;
        case 'delete':
          endpoint = `${backendUrl}/api/admin/users/${userId}`;
          method = 'DELETE';
          body = { reason };
          break;
        default:
          return;
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        fetchUsers(); // Refresh the list
        setActionDialog({ open: false, type: '', user: null });
        setReason('');
      } else {
        toast.error(data.error || 'Action failed');
      }
    } catch (error) {
      console.error('User action error:', error);
      toast.error('Network error while performing action');
    }
  };

  const openActionDialog = (type, user) => {
    setActionDialog({ open: true, type, user });
    setReason('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const branches = [
    'Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 
    'Civil', 'Electrical', 'Chemical', 'Biotechnology', 'Other'
  ];

  if (loading && users.length === 0) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 ml-64">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 ml-64 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 poppins-semibold">User Management</h1>
              <p className="text-gray-600">Manage and verify platform users</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => navigate('/admin/bulk-import')}
                variant="outline"
              >
                <Users className="w-4 h-4 mr-2" />
                Bulk Import
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filters & Search</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Role</label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="student">Students</SelectItem>
                      <SelectItem value="alumni">Alumni</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Verification</label>
                  <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Users" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="true">Verified</SelectItem>
                      <SelectItem value="false">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Branch</label>
                  <Select value={branchFilter} onValueChange={setBranchFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Branches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {branches.map(branch => (
                        <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button 
                    onClick={() => {
                      setSearchTerm('');
                      setRoleFilter('all');
                      setVerificationFilter('all');
                      setBranchFilter('all');
                      setCurrentPage(1);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Users ({pagination.totalUsers || 0})</span>
                </div>
                {loading && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {users.length > 0 ? (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1 min-w-0">
                          <Avatar className="h-12 w-12 flex-shrink-0">
                            <AvatarImage src={user.profile?.profileUrl} />
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center flex-wrap gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900 text-base">{user.name}</h3>
                              <Badge variant={user.role === 'alumni' ? 'default' : 'secondary'} className="text-xs">
                                {user.role}
                              </Badge>
                              {user.isVerified ? (
                                <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-orange-600 border-orange-600 text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Pending
                                </Badge>
                              )}
                            </div>
                            
                            <div className="space-y-1 mb-2">
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Mail className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{user.email}</span>
                              </div>
                              
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                {user.profile?.branch && (
                                  <div className="flex items-center space-x-1">
                                    <GraduationCap className="w-4 h-4 flex-shrink-0" />
                                    <span>{user.profile.branch}</span>
                                  </div>
                                )}
                                {user.batch && (
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4 flex-shrink-0" />
                                    <span>Batch {user.batch}</span>
                                  </div>
                                )}
                                {user.profile?.currentCompany && (
                                  <div className="flex items-center space-x-1">
                                    <Building className="w-4 h-4 flex-shrink-0" />
                                    <span>{user.profile.currentCompany}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-xs text-gray-500">
                              Joined {formatDate(user.createdAt)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedUser(user)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          {!user.isVerified ? (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white h-8 px-3"
                              onClick={() => handleUserAction('verify', user._id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Verify
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-orange-600 border-orange-600 hover:bg-orange-50 h-8 px-3"
                              onClick={() => openActionDialog('suspend', user)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Suspend
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50 h-8 w-8 p-0"
                            onClick={() => openActionDialog('delete', user)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No users found matching your criteria</p>
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, pagination.totalUsers)} of {pagination.totalUsers} users
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

      {/* User Details Dialog */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedUser.profile?.profileUrl} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span>{selectedUser.name}</span>
                  <Badge className="ml-2" variant={selectedUser.role === 'alumni' ? 'default' : 'secondary'}>
                    {selectedUser.role}
                  </Badge>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-sm text-gray-900">{selectedUser.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">GR Number</label>
                <p className="text-sm text-gray-900">{selectedUser.GrNo}</p>
              </div>
              {selectedUser.profile?.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-sm text-gray-900">{selectedUser.profile.phone}</p>
                </div>
              )}
              {selectedUser.batch && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Batch</label>
                  <p className="text-sm text-gray-900">{selectedUser.batch}</p>
                </div>
              )}
              {selectedUser.profile?.branch && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Branch</label>
                  <p className="text-sm text-gray-900">{selectedUser.profile.branch}</p>
                </div>
              )}
              {selectedUser.profile?.location && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Location</label>
                  <p className="text-sm text-gray-900">{selectedUser.profile.location}</p>
                </div>
              )}
              {selectedUser.profile?.currentCompany && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Company</label>
                  <p className="text-sm text-gray-900">{selectedUser.profile.currentCompany}</p>
                </div>
              )}
              {selectedUser.profile?.currentPosition && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Position</label>
                  <p className="text-sm text-gray-900">{selectedUser.profile.currentPosition}</p>
                </div>
              )}
            </div>
            
            {selectedUser.profile?.bio && (
              <div>
                <label className="text-sm font-medium text-gray-600">Bio</label>
                <p className="text-sm text-gray-900 mt-1">{selectedUser.profile.bio}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <span>Confirm {actionDialog.type === 'delete' ? 'Delete' : 'Suspend'} User</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionDialog.type} user "{actionDialog.user?.name}"? 
              {actionDialog.type === 'delete' && ' This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Reason {actionDialog.type === 'delete' ? '(Required)' : '(Optional)'}
            </label>
            <Textarea
              placeholder={`Enter reason for ${actionDialog.type}...`}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required={actionDialog.type === 'delete'}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ open: false, type: '', user: null })}>
              Cancel
            </Button>
            <Button
              variant={actionDialog.type === 'delete' ? 'destructive' : 'default'}
              onClick={() => handleUserAction(actionDialog.type, actionDialog.user?._id, reason)}
              disabled={actionDialog.type === 'delete' && !reason.trim()}
            >
              {actionDialog.type === 'delete' ? 'Delete User' : 'Suspend User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster position="top-right" />
    </div>
  );
};

export default UserManagement;
