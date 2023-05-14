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
  unfollowUser,
  addUserToSearchHistory,
  removeUserFromSearch,
} from '../controllers/userController.js';

// Define router
const router = express.Router();

// Define GET routes
router.get('/getUserProfile/:username', userMiddleware, getUserProfile); // Get rid of "freindship"
router.get('/getUserSearchHistory', userMiddleware, getUserSearchHistory);

// Define POST routes
router.post('/registerUser', registerUser);
router.post('/userLogin', userLogin);
router.post('/searchUser/:searchTerm', userMiddleware, searchUser); // Finish

// Define PUT routes
router.put('/followUser/:id', userMiddleware, followUser); // Works, but not perfect ----- update after fix following/follow button
router.put('/unfollowUser/:id', userMiddleware, unfollowUser); // Works, but not perfect ----- update after fix following/follow button
router.put('/addUserToSearchHistory', userMiddleware, addUserToSearchHistory); // Works, but not perfect
router.put('/removeUserFromSearch', userMiddleware, removeUserFromSearch); // Finished




// Export router
export default router;
