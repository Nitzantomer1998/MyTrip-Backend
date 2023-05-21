// Import needed functions
import userMiddleware from '../middlwares/userMiddleware.js';
import { Router } from 'express';
import {
  getAllPosts,
  createPost,
  commentPost,
  savePost,
  deletePost,
  getPostsByLocation,
  getUniqueLocations,
  getAllPostsSaved,
} from '../controllers/postController.js';

// Define router
const router = Router();

// Define Get routes
router.get('/getAllPosts', userMiddleware, getAllPosts);
//add this one
router.get('/posts/location/:location', userMiddleware, getPostsByLocation);
router.get('/posts/locations', getUniqueLocations);
router.get('/getAllPostsSaved/:username', getAllPostsSaved);

// Define POST routes
router.post('/createPost', userMiddleware, createPost);

// Define PUT routes
router.put('/commentPost', userMiddleware, commentPost);
router.put('/savePost/:id', userMiddleware, savePost);

// Define DELETE routes
router.delete('/deletePost/:id', userMiddleware, deletePost);

// Export the router
export default router;
