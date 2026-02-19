import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Search,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Image as ImageIcon,
  Send,
  TrendingUp,
  Users,
  Award,
  Filter,
  Edit3,
  Trash2,
  Pin,
  Globe,
  Users2,
  GraduationCap
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import BottomBar from '../components/BottomBar';

const NewsStoriesPage = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPostType, setSelectedPostType] = useState('all');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    postType: 'community',
    visibility: 'public',
    images: []
  });

  const { user } = useSelector(state => state.user);
  const token = localStorage.getItem('token');
  const backendUrl = import.meta.env.VITE_BACKEND_URL ?? '';

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        if (!token) {
          setUserLoading(false);
          return;
        }

        const response = await fetch(`${backendUrl}/api/profile/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (data.success) {
          setCurrentUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  // Post types for filtering
  const postTypes = [
    { value: 'all', label: 'All Posts' },
    { value: 'success', label: 'Success Stories' },
    { value: 'news', label: 'College News' },
    { value: 'career', label: 'Career Updates' },
    { value: 'achievement', label: 'Achievements' },
    { value: 'learning', label: 'Learning' },
    { value: 'community', label: 'Community' },
    { value: 'announcement', label: 'Announcements' }
  ];

  // Fetch posts
  const fetchPosts = async (postType = 'all', search = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (postType !== 'all') params.append('postType', postType);
      if (search) params.append('query', search);

      const endpoint = search ? '/api/posts/search' : '/api/posts';
      const response = await fetch(`${backendUrl}${endpoint}?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new post
  const handleCreatePost = async () => {
    try {
      if (!newPost.content.trim()) return;

      const response = await fetch(`${backendUrl}/api/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
      });

      const data = await response.json();
      if (data.success) {
        setPosts([data.post, ...posts]);
        setNewPost({ content: '', postType: 'community', visibility: 'public', images: [] });
        setShowCreatePost(false);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  // Like/Unlike post
  const handleLikePost = async (postId) => {
    if (!currentUser?._id) {
      console.error('User not found');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/posts/${postId}/like`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setPosts(posts.map(post =>
          post._id === postId
            ? {
              ...post,
              likes: data.isLiked
                ? [...(post.likes || []), currentUser._id]
                : (post.likes || []).filter(id => id !== currentUser._id),
              likeCount: data.likeCount
            }
            : post
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Add comment
  const handleAddComment = async (postId, content) => {
    try {
      const response = await fetch(`${backendUrl}/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });

      const data = await response.json();
      if (data.success) {
        setPosts(posts.map(post =>
          post._id === postId
            ? { ...post, comments: [...post.comments, data.comment] }
            : post
        ));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  useEffect(() => {
    if (!userLoading && currentUser) {
      fetchPosts(selectedPostType, searchTerm);
    }
  }, [selectedPostType, userLoading, currentUser]);

  // Post type badge colors
  const getPostTypeBadge = (type) => {
    const colors = {
      success: 'bg-green-100 text-green-800',
      news: 'bg-blue-100 text-blue-800',
      career: 'bg-purple-100 text-purple-800',
      achievement: 'bg-yellow-100 text-yellow-800',
      learning: 'bg-indigo-100 text-indigo-800',
      community: 'bg-gray-100 text-gray-800',
      announcement: 'bg-red-100 text-red-800'
    };
    return colors[type] || colors.community;
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  // Show loading while user data is being fetched
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 poppins-regular">
        <Sidebar />
        <BottomBar />
        <div className="md:ml-64 pb-20 md:pb-0 min-h-screen overflow-auto bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading...</p>
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
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">News & Stories</h1>
            <p className="text-sm md:text-base text-gray-600">Share your journey and stay connected with the community</p>
          </div>


          {/* Tabs Navigation */}
          <Tabs defaultValue="feed" value={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="feed" onClick={() => setActiveTab('feed')}>Feed</TabsTrigger>
              <TabsTrigger value="create" onClick={() => setActiveTab('create')}>Create Post</TabsTrigger>
              <TabsTrigger value="my-posts" onClick={() => setActiveTab('my-posts')}>My Posts</TabsTrigger>
            </TabsList>

            {/* Feed Tab */}
            <TabsContent value="feed" className="space-y-6">
              {/* Search and Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search posts..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && fetchPosts(selectedPostType, searchTerm)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Select value={selectedPostType} onValueChange={setSelectedPostType}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          {postTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => fetchPosts(selectedPostType, searchTerm)}
                        variant="outline"
                      >
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Posts Feed */}
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading posts...</p>
                  </div>
                ) : posts.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                      <p className="text-gray-500">Be the first to share something with the community!</p>
                    </CardContent>
                  </Card>
                ) : (
                  posts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      currentUser={currentUser}
                      onLike={handleLikePost}
                      onComment={handleAddComment}
                      getPostTypeBadge={getPostTypeBadge}
                      formatTime={formatTime}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            {/* Create Post Tab */}
            <TabsContent value="create">
              <CreatePostForm
                newPost={newPost}
                setNewPost={setNewPost}
                onSubmit={handleCreatePost}
                postTypes={postTypes.slice(1)} // Remove 'all' option
              />
            </TabsContent>

            {/* My Posts Tab */}
            <TabsContent value="my-posts">
              <MyPostsTab userId={currentUser?._id} token={token} />
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>
  );
};

// Post Card Component
const PostCard = ({ post, currentUser, onLike, onComment, getPostTypeBadge, formatTime }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);

  const isLiked = currentUser?._id && post.likes?.some(likeId =>
    likeId === currentUser._id || likeId.toString() === currentUser._id
  );
  const displayComments = showAllComments ? post.comments : post.comments?.slice(0, 2);

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onComment(post._id, commentText);
      setCommentText('');
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author?.profile?.profileImage} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                {post.author?.name?.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-gray-900">{post.author?.name}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{post.author?.profile?.currentPosition}</span>
                {post.author?.profile?.currentCompany && (
                  <>
                    <span>•</span>
                    <span>{post.author?.profile?.currentCompany}</span>
                  </>
                )}
                <span>•</span>
                <span>{formatTime(post.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getPostTypeBadge(post.postType)}>
              {post.postType}
            </Badge>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>

          {post.images && post.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt="Post attachment"
                  className="rounded-lg object-cover w-full h-48"
                />
              ))}
            </div>
          )}

          <Separator />

          {/* Post Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike(post._id)}
                className={isLiked ? "text-red-600 hover:text-red-700" : "text-gray-600 hover:text-gray-700"}
              >
                <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-red-600 text-red-600' : ''}`} />
                {post.likes?.length || 0}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                className="text-gray-600 hover:text-gray-700"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                {post.comments?.length || 0}
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="space-y-3 pt-2">
              {displayComments?.map((comment, index) => (
                <div key={index} className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author?.profile?.profileImage} />
                    <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                      {comment.author?.name?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                      <p className="font-semibold text-sm text-gray-900">{comment.author?.name}</p>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                      <button className="hover:text-gray-700">Like</button>
                      <button className="hover:text-gray-700">Reply</button>
                      <span>{formatTime(comment.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}

              {post.comments?.length > 2 && !showAllComments && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllComments(true)}
                  className="text-blue-600"
                >
                  View {post.comments.length - 2} more comments
                </Button>
              )}

              {/* Add Comment */}
              <div className="flex space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser?.profile?.profileImage} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                    {currentUser?.name?.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex space-x-2">
                  <Input
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleSubmitComment}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Create Post Form Component
const CreatePostForm = ({ newPost, setNewPost, onSubmit, postTypes }) => {
  const [uploadingImages, setUploadingImages] = useState(false);
  const token = localStorage.getItem('token');
  const backendUrl = import.meta.env.VITE_BACKEND_URL ?? '';

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch(`${backendUrl}/api/upload/post-images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setNewPost({
          ...newPost,
          images: [...newPost.images, ...data.images]
        });
      } else {
        alert('Failed to upload images: ' + data.error);
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    const updatedImages = newPost.images.filter((_, i) => i !== index);
    setNewPost({ ...newPost, images: updatedImages });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Create New Post
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Select
            value={newPost.postType}
            onValueChange={(value) => setNewPost({ ...newPost, postType: value })}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Post type" />
            </SelectTrigger>
            <SelectContent>
              {postTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={newPost.visibility}
            onValueChange={(value) => setNewPost({ ...newPost, visibility: value })}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  Public
                </div>
              </SelectItem>
              <SelectItem value="alumni">
                <div className="flex items-center">
                  <Users2 className="h-4 w-4 mr-2" />
                  Alumni Only
                </div>
              </SelectItem>
              <SelectItem value="students">
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Students Only
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Textarea
          placeholder="What's on your mind? Share your story, achievement, or news with the community..."
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          rows={6}
          className="resize-none"
        />

        {/* Image Preview */}
        {newPost.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {newPost.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
              disabled={uploadingImages}
            />
            <label htmlFor="image-upload">
              <Button
                variant="outline"
                className="flex items-center cursor-pointer"
                disabled={uploadingImages}
                asChild
              >
                <span>
                  {uploadingImages ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Add Images
                    </>
                  )}
                </span>
              </Button>
            </label>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setNewPost({ content: '', postType: 'community', visibility: 'public', images: [] })}
            >
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={!newPost.content.trim() || uploadingImages}>
              <Send className="h-4 w-4 mr-2" />
              Post
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// My Posts Tab Component
const MyPostsTab = ({ userId, token }) => {
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL ?? '';
  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({
    content: '',
    postType: '',
    visibility: '',
    images: []
  });

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/posts/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setMyPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching my posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchMyPosts();
    }
  }, [userId, token]);

  const handleEditPost = (post) => {
    setEditingPost(post._id);
    setEditForm({
      content: post.content,
      postType: post.postType,
      visibility: post.visibility,
      images: post.images || []
    });
  };

  const handleUpdatePost = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/posts/${editingPost}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();
      if (data.success) {
        setMyPosts(myPosts.map(post =>
          post._id === editingPost ? data.post : post
        ));
        setEditingPost(null);
        setEditForm({ content: '', postType: '', visibility: '', images: [] });
      } else {
        alert('Failed to update post: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`${backendUrl}/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setMyPosts(myPosts.filter(post => post._id !== postId));
      } else {
        alert('Failed to delete post: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const postTypes = [
    { value: 'success', label: 'Success Stories' },
    { value: 'news', label: 'College News' },
    { value: 'career', label: 'Career Updates' },
    { value: 'achievement', label: 'Achievements' },
    { value: 'learning', label: 'Learning' },
    { value: 'community', label: 'Community' },
    { value: 'announcement', label: 'Announcements' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading your posts...</p>
            </div>
          ) : myPosts.length === 0 ? (
            <div className="text-center py-8">
              <Edit3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-500">Start sharing your journey with the community!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {myPosts.map((post) => (
                <Card key={post._id} className="hover:shadow-lg transition-all duration-200 border border-gray-200">
                  <CardContent className="p-5">
                    {editingPost === post._id ? (
                      // Edit Mode
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <Select
                            value={editForm.postType}
                            onValueChange={(value) => setEditForm({ ...editForm, postType: value })}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Post type" />
                            </SelectTrigger>
                            <SelectContent>
                              {postTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Textarea
                          value={editForm.content}
                          onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                          rows={4}
                          className="resize-none"
                        />
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingPost(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleUpdatePost}
                            disabled={!editForm.content.trim()}
                          >
                            Update
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="secondary" className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200">
                            {post.postType.charAt(0).toUpperCase() + post.postType.slice(1)}
                          </Badge>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditPost(post)}
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePost(post._id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 line-clamp-3 mb-3">{post.content}</p>

                        {/* Display Images */}
                        {post.images && post.images.length > 0 && (
                          <div className="mb-3">
                            {post.images.length === 1 ? (
                              // Single image - larger display
                              <div className="relative">
                                <img
                                  src={post.images[0]}
                                  alt="Post image"
                                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              </div>
                            ) : post.images.length === 2 ? (
                              // Two images - side by side
                              <div className="grid grid-cols-2 gap-2">
                                {post.images.slice(0, 2).map((image, index) => (
                                  <div key={index} className="relative">
                                    <img
                                      src={image}
                                      alt={`Post image ${index + 1}`}
                                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              // Multiple images - grid layout
                              <div className="grid grid-cols-2 gap-2">
                                {post.images.slice(0, 4).map((image, index) => (
                                  <div key={index} className="relative">
                                    <img
                                      src={image}
                                      alt={`Post image ${index + 1}`}
                                      className="w-full h-20 object-cover rounded-lg border border-gray-200"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                      }}
                                    />
                                    {index === 3 && post.images.length > 4 && (
                                      <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-xs font-semibold">
                                          +{post.images.length - 4}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                          <span>{post.likes?.length || 0} likes</span>
                          <span>{post.comments?.length || 0} comments</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};


export default NewsStoriesPage;
