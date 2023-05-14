// Import needed packages
import express from 'express';

// Import needed functions
import userMiddleware from '../middlwares/userMiddleware.js';
import {
  getUserProfile,
  getUserSearchHistory,
  registerUser,
  userLogin,
  searchUser,
  followUser,
  unFollowUser,
  addUserToSearchHistory,
  removeUserFromSearchHistory,
} from '../controllers/userController.js';

// Define router
const router = express.Router();

// Define GET routes
router.get('/getUserProfile/:username', userMiddleware, getUserProfile); // Get rid of "freindship"
router.get('/getUserSearchHistory', userMiddleware, getUserSearchHistory);

// Define POST routes
router.post('/registerUser', registerUser);
router.post('/userLogin', userLogin);
router.post('/searchUser/:searchTerm', userMiddleware, searchUser);

// Define PUT routes
router.put('/followUser/:id', userMiddleware, followUser);
router.put('/unFollowUser/:id', userMiddleware, unFollowUser);
router.put('/addUserToSearchHistory', userMiddleware, addUserToSearchHistory);
router.put('/removeUserFromSearch', userMiddleware, removeUserFromSearch);
router.put('/removeUserFromSearchHistory', userMiddleware, removeUserFromSearchHistory);

// Export router
export default router;

