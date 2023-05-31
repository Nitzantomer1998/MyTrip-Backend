// Import needed package
import express from 'express';

// Import needed functions
import userMiddleware from '../middlwares/userMiddleware.js';
import {
  getAllPosts,
  createPost,
  commentPost,
  deletePost,
  savePost,
  getPostsByLocation,
  getUniqueLocations,
  getAllPostsSaved,
  postReaction,
  getAllPostsRecommended,
  getAllPostsLiked,
  getPostLikes,
  getPostRecommended,
  getPostbyId,
} from '../controllers/postController.js';

// Set up router
const router = express.Router();

// Set up GET routes
router.get('/getAllPosts', userMiddleware, getAllPosts); // Finished

// Set up POST routes
router.post('/createPost', userMiddleware, createPost); // Finished

// Set up PUT routes
router.put('/commentPost', userMiddleware, commentPost); // Finished

// Set up DELETE routes
router.delete('/deletePost/:id', userMiddleware, deletePost); // Finished

//add this one
router.get('/posts/location/:location', userMiddleware, getPostsByLocation);
router.get('/posts/locations', getUniqueLocations);
router.get('/getAllPostsSaved/:username', getAllPostsSaved);
router.put('/savePost/:id', userMiddleware, savePost);
router.put('/postReaction', userMiddleware, postReaction);
router.get('/getAllPostsRecommended/:username', getAllPostsRecommended);
router.get('/getAllPostsLiked/:username', getAllPostsLiked);
router.get('/getPostLikes/:id', getPostLikes);
router.get('/getPostRecommended/:id', getPostRecommended);
router.get('/getPostbyId/:id', getPostbyId);


// Export the router
export default router;
