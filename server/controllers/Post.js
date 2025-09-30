import { Post } from '../models/postModel.js';
import { userModel } from '../models/userModel.js';
import mongoose from 'mongoose';

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { content, postType, images, tags, visibility } = req.body;
    const userId = req.userId;

    // Validate required fields
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Post content is required"
      });
    }

    // Create new post
    const newPost = new Post({
      author: userId,
      content: content.trim(),
      postType: postType || 'community',
      images: images || [],
      tags: tags || [],
      visibility: visibility || 'public'
    });

    await newPost.save();

    // Populate author details
    await newPost.populate('author', 'name email role profile.profileImage profile.currentCompany profile.currentPosition batch');
    await newPost.populate('tags', 'name email profile.profileImage');

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to create post"
    });
  }
};

// Get all posts (feed)
export const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, postType, visibility, author } = req.query;
    const userId = req.userId;

    // Build filter object
    const filter = {};
    
    if (postType && postType !== 'all') {
      filter.postType = postType;
    }
    
    if (visibility && visibility !== 'all') {
      filter.visibility = visibility;
    }
    
    if (author) {
      filter.author = author;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get posts with pagination
    const posts = await Post.find(filter)
      .populate('author', 'name email role profile.profileImage profile.currentCompany profile.currentPosition batch')
      .populate('tags', 'name email profile.profileImage')
      .populate('comments.author', 'name profile.profileImage')
      .populate('comments.replies.author', 'name profile.profileImage')
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalPosts = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / parseInt(limit));

    res.status(200).json({
      success: true,
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalPosts,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch posts"
    });
  }
};

// Get single post
export const getPost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid post ID"
      });
    }

    const post = await Post.findById(postId)
      .populate('author', 'name email role profile.profileImage profile.currentCompany profile.currentPosition batch')
      .populate('tags', 'name email profile.profileImage')
      .populate('comments.author', 'name profile.profileImage')
      .populate('comments.replies.author', 'name profile.profileImage');

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found"
      });
    }

    res.status(200).json({
      success: true,
      post
    });

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch post"
    });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, postType, images, tags, visibility } = req.body;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid post ID"
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found"
      });
    }

    // Check if user is the author
    if (post.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: "You can only edit your own posts"
      });
    }

    // Update post fields
    if (content) post.content = content.trim();
    if (postType) post.postType = postType;
    if (images) post.images = images;
    if (tags) post.tags = tags;
    if (visibility) post.visibility = visibility;
    
    post.isEdited = true;
    post.updatedAt = new Date();

    await post.save();

    // Populate and return updated post
    await post.populate('author', 'name email role profile.profileImage profile.currentCompany profile.currentPosition batch');
    await post.populate('tags', 'name email profile.profileImage');

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post
    });

  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to update post"
    });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid post ID"
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found"
      });
    }

    // Check if user is the author or admin
    const user = await userModel.findById(userId);
    if (post.author.toString() !== userId && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: "You can only delete your own posts"
      });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully"
    });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to delete post"
    });
  }
};

// Like/Unlike post
export const toggleLikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid post ID"
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found"
      });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const isLiked = post.likes.includes(userObjectId);

    if (isLiked) {
      // Unlike the post
      post.likes = post.likes.filter(id => !id.equals(userObjectId));
    } else {
      // Like the post
      post.likes.push(userObjectId);
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: isLiked ? "Post unliked" : "Post liked",
      isLiked: !isLiked,
      likeCount: post.likes.length
    });

  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to toggle like"
    });
  }
};

// Add comment to post
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid post ID"
      });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Comment content is required"
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found"
      });
    }

    const newComment = {
      author: userId,
      content: content.trim(),
      likes: [],
      replies: []
    };

    post.comments.push(newComment);
    await post.save();

    // Populate the new comment
    await post.populate('comments.author', 'name profile.profileImage');

    const addedComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: addedComment
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to add comment"
    });
  }
};

// Get user's posts
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID"
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await Post.find({ author: userId })
      .populate('author', 'name email role profile.profileImage profile.currentCompany profile.currentPosition batch')
      .populate('tags', 'name email profile.profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalPosts = await Post.countDocuments({ author: userId });
    const totalPages = Math.ceil(totalPosts / parseInt(limit));

    res.status(200).json({
      success: true,
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalPosts,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user posts"
    });
  }
};

// Search posts
export const searchPosts = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Search query is required"
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Search in post content and author name
    const posts = await Post.find({
      $or: [
        { content: { $regex: query, $options: 'i' } },
        // We'll populate author and search in name later
      ]
    })
    .populate('author', 'name email role profile.profileImage profile.currentCompany profile.currentPosition batch')
    .populate('tags', 'name email profile.profileImage')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    // Filter posts that match author name
    const filteredPosts = posts.filter(post => 
      post.content.toLowerCase().includes(query.toLowerCase()) ||
      post.author.name.toLowerCase().includes(query.toLowerCase())
    );

    res.status(200).json({
      success: true,
      posts: filteredPosts,
      searchQuery: query
    });

  } catch (error) {
    console.error('Search posts error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to search posts"
    });
  }
};
