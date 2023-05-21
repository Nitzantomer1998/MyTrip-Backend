// Import needed package
import express from 'express';

// Import needed functions
import userMiddleware from '../middlwares/userMiddleware.js';
import {
  getUserProfile,
  getUserSearchHistory,
  getUserFollowersPage,
  getUserFollowingPage,
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
router.get('/getUserFollowersPage/:id', getUserFollowersPage); //Why userMiddleware doesnt work
router.get('/getUserFollowingPage/:id', getUserFollowingPage); //Why userMiddleware doesnt work

// Set up POST routes
router.post('/registerUser', registerUser); // cancel sending back error messages
router.post('/userLogin', userLogin); // cancel sending back error messages
router.post('/searchUser/:username', userMiddleware, searchUser); // Finished
router.post('/changeUserPassword', userMiddleware, changeUserPassword); // Finished
router.post('/shareUserPost/:postId/:userId', userMiddleware, shareUserPost); // First mockup, will be need alot of adjustment later

// Set up PUT routes
router.put('/updateDetails', userMiddleware, updateDetails); // Update in the future -> details field is useless
router.put('/followUser/:id', userMiddleware, followUser); // Finished
router.put('/unFollowUser/:id', userMiddleware, unFollowUser); // Finished
router.put(
  '/updateUserProfilePicture',
  userMiddleware,
  updateUserProfilePicture
); // Finished
router.put('/addUserToSearchHistory', userMiddleware, addUserToSearchHistory); // Finished
router.put(
  '/removeUserFromSearchHistory',
  userMiddleware,
  removeUserFromSearchHistory
); // Finished

// Set up DELETE routes
router.delete('/deleteUser', userMiddleware, deleteUser); // Finished

// Export the router
export default router;
