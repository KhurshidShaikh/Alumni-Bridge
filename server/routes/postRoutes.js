import express from 'express';
import { AuthUser } from '../middlewere/userAuth.js';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  toggleLikePost,
  addComment,
  getUserPosts,
  searchPosts
} from '../controllers/Post.js';

const router = express.Router();

// All routes require authentication
router.use(AuthUser);

// Post CRUD routes
router.post('/', createPost);                    // Create new post
router.get('/', getPosts);                       // Get all posts (feed)
router.get('/search', searchPosts);              // Search posts
router.get('/user/:userId', getUserPosts);       // Get user's posts
router.get('/:postId', getPost);                 // Get single post
router.put('/:postId', updatePost);              // Update post
router.delete('/:postId', deletePost);           // Delete post

// Social interaction routes
router.put('/:postId/like', toggleLikePost);     // Like/unlike post
router.post('/:postId/comment', addComment);     // Add comment to post

export default router;
