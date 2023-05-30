// Import needed package
import express from 'express';

// Import needed functions
import userMiddleware from '../middlwares/userMiddleware.js';
import {
  getUserProfile,
  getUserSearchHistory,
  getUserFollowersPage,
  getUserFollowingPage,
  getUserStatistics,
  registerUser,
  userLogin,
  searchUser,
  changeUserPassword,
  shareUserPost,
  updateDetails,
  followUser,
  unFollowUser,
  addUserToSearchHistory,
  removeUserFromSearchHistory,
  updateUserProfilePicture,
  deleteUser,
} from '../controllers/userController.js';

// Set up router
const router = express.Router();

// Set up GET routes
router.get('/getUserProfile/:username', userMiddleware, getUserProfile); // Get rid of "freindship", the return profile page contain all the user information = BAD!!!!
router.get('/getUserSearchHistory', userMiddleware, getUserSearchHistory); // Finished
router.get('/getUserFollowersPage/:id', userMiddleware, getUserFollowersPage); // Finished
router.get('/getUserFollowingPage/:id', userMiddleware, getUserFollowingPage); // Finished
router.get('/getUserStatistics/:id', userMiddleware, getUserStatistics); // Will change alot in the future

// Set up POST routes
router.post('/registerUser', registerUser); // cancel sending back error messages
router.post('/userLogin', userLogin); // cancel sending back error messages
router.post('/searchUser/:username', userMiddleware, searchUser); // Finished
router.post('/changeUserPassword', userMiddleware, changeUserPassword); // Finished
router.post('/shareUserPost/:postId/:userId', userMiddleware, shareUserPost); // Finished

// Set up PUT routes
router.put('/updateDetails', userMiddleware, updateDetails); // Update in the future -> details field is useless
router.put('/followUser/:id', userMiddleware, followUser); // Finished
router.put('/unFollowUser/:id', userMiddleware, unFollowUser); // Finished
router.put(
  '/updateUserProfilePicture',
  userMiddleware,
  updateUserProfilePicture
); // Finished
router.put('/addUserToSearchHistory', userMiddleware, addUserToSearchHistory); // Can be shorter
router.put(
  '/removeUserFromSearchHistory',
  userMiddleware,
  removeUserFromSearchHistory
); // Finished

// Set up DELETE routes
router.delete('/deleteUser', userMiddleware, deleteUser); // Finished

// Export the router
export default router;
