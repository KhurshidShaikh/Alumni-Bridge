import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import AdminBottomBar from '../../components/AdminBottomBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  FileText, 
  Briefcase, 
  Trash2, 
  Eye,
  AlertTriangle,
  Users,
  Calendar,
  MapPin,
  Building,
  DollarSign,
  Clock
} from 'lucide-react';
import { Toaster, toast } from "sonner";

const ContentManagement = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState({ posts: true, jobs: true });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: '', item: null });
  const [selectedItem, setSelectedItem] = useState(null);

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    fetchPosts();
    fetchJobs();
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      
      const response = await fetch(`${backendUrl}/api/admin/posts`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setPosts(data.data);
      } else {
        toast.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Fetch posts error:', error);
      toast.error('Network error while fetching posts');
    } finally {
      setLoading(prev => ({ ...prev, posts: false }));
    }
  };

  const fetchJobs = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      
      const response = await fetch(`${backendUrl}/api/admin/jobs`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setJobs(data.data);
      } else {
        toast.error('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Fetch jobs error:', error);
      toast.error('Network error while fetching jobs');
    } finally {
      setLoading(prev => ({ ...prev, jobs: false }));
    }
  };

  const handleDeleteContent = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      
      const endpoint = deleteDialog.type === 'post' 
        ? `${backendUrl}/api/admin/posts/${deleteDialog.item._id}`
        : `${backendUrl}/api/admin/jobs/${deleteDialog.item._id}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`${deleteDialog.type === 'post' ? 'Post' : 'Job'} deleted successfully`);
        setDeleteDialog({ open: false, type: '', item: null });
        
        // Refresh the appropriate list
        if (deleteDialog.type === 'post') {
          fetchPosts();
        } else {
          fetchJobs();
        }
      } else {
        toast.error(data.error || `Failed to delete ${deleteDialog.type}`);
      }
    } catch (error) {
      console.error('Delete content error:', error);
      toast.error('Network error while deleting content');
    }
  };

  const openDeleteDialog = (type, item) => {
    setDeleteDialog({ open: true, type, item });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    return `₹${salary.toLocaleString()}`;
  };

  if (loading.posts && loading.jobs) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 md:ml-64">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading content...</p>
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
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Content</h1>
              <p className="text-xs text-gray-500">Moderation</p>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 poppins-semibold">Content Management</h1>
              <p className="text-gray-600">Moderate posts and job listings on the platform</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-20 md:pb-6">

        <div className="p-6">
          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="posts" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Posts ({posts.length})</span>
              </TabsTrigger>
              <TabsTrigger value="jobs" className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4" />
                <span>Jobs ({jobs.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* Posts Tab */}
            <TabsContent value="posts">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>User Posts</span>
                  </CardTitle>
                  <CardDescription>
                    Review and moderate posts shared by users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {posts.length > 0 ? (
                    <div className="space-y-4">
                      {posts.map((post) => (
                        <div key={post._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={post.author?.profile?.profileUrl} />
                                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                    {post.author?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold text-gray-900">{post.author?.name || 'Unknown User'}</p>
                                  <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                                </div>
                                <Badge variant="outline">
                                  {post.postType || 'general'}
                                </Badge>
                              </div>
                              
                              <div className="mb-3">
                                <p className="text-gray-900 mb-2">{post.content}</p>
                                {post.images && post.images.length > 0 && (
                                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                                    <Eye className="w-4 h-4" />
                                    <span>{post.images.length} image(s) attached</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Users className="w-4 h-4" />
                                  <span>{post.likes?.length || 0} likes</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <FileText className="w-4 h-4" />
                                  <span>{post.comments?.length || 0} comments</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedItem({ type: 'post', data: post })}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => openDeleteDialog('post', post)}
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
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No posts found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Jobs Tab */}
            <TabsContent value="jobs">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Briefcase className="w-5 h-5" />
                    <span>Job Listings</span>
                  </CardTitle>
                  <CardDescription>
                    Review and moderate job postings by alumni
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {jobs.length > 0 ? (
                    <div className="space-y-4">
                      {jobs.map((job) => (
                        <div key={job._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-gray-900 text-lg">{job.title}</h3>
                                <Badge variant="outline">
                                  {job.jobType || 'Full-time'}
                                </Badge>
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  {job.status || 'Active'}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <Building className="w-4 h-4" />
                                  <span>{job.company}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  <span>{job.location}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <DollarSign className="w-4 h-4" />
                                  <span>{formatSalary(job.salary)}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <Clock className="w-4 h-4" />
                                  <span>{formatDate(job.createdAt)}</span>
                                </div>
                              </div>
                              
                              <p className="text-gray-700 mb-3 line-clamp-2">{job.description}</p>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-2">
                                  <Avatar className="h-5 w-5">
                                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                      {job.postedBy?.name?.split(' ').map(n => n[0]).join('') || 'A'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>Posted by {job.postedBy?.name || 'Unknown'}</span>
                                </div>
                                <span>•</span>
                                <span>{job.applicants?.length || 0} applicants</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedItem({ type: 'job', data: job })}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => openDeleteDialog('job', job)}
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
                      <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No job listings found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        </div>

        <AdminBottomBar />
      </div>

      {/* Item Details Dialog */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedItem.type === 'post' ? 'Post Details' : 'Job Details'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              {selectedItem.type === 'post' ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Author</label>
                    <p className="text-sm text-gray-900">{selectedItem.data.author?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Content</label>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedItem.data.content}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Post Type</label>
                    <p className="text-sm text-gray-900">{selectedItem.data.postType || 'General'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Created</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedItem.data.createdAt)}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Job Title</label>
                    <p className="text-sm text-gray-900">{selectedItem.data.title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Company</label>
                    <p className="text-sm text-gray-900">{selectedItem.data.company}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Location</label>
                    <p className="text-sm text-gray-900">{selectedItem.data.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Description</label>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedItem.data.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Requirements</label>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedItem.data.requirements}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Salary</label>
                    <p className="text-sm text-gray-900">{formatSalary(selectedItem.data.salary)}</p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>Delete {deleteDialog.type === 'post' ? 'Post' : 'Job'}</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {deleteDialog.type}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, type: '', item: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteContent}>
              Delete {deleteDialog.type === 'post' ? 'Post' : 'Job'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster position="top-right" />
    </div>
  );
};

export default ContentManagement;
