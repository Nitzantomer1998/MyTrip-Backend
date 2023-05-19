// Import needed functions
import userMiddleware from '../middlwares/userMiddleware.js';
import { Router } from 'express';
import {
  getUserProfile,
  getUserSearchHistory,
  registerUser,
  userLogin,
  searchUser,
  changePassword,
  shareUserPost,
  followUser,
  unFollowUser,
  addUserToSearchHistory,
  removeUserFromSearchHistory,
  updateProfilePicture,
  getFollowingPageInfos,
  getFollowersPageInfos,
  updateDetails,
  getFollowersPageInfosId,
  getFollowingPageInfosId,
  getFriendsPageInfos,
} from '../controllers/userController.js';

// Define router
const router = Router();

// Define GET routes
router.get('/getUserProfile/:username', userMiddleware, getUserProfile); // Get rid of "freindship"
router.get('/getUserSearchHistory', userMiddleware, getUserSearchHistory);

// Define POST routes
router.post('/registerUser', registerUser);
router.post('/userLogin', userLogin);
router.post('/searchUser/:searchTerm', userMiddleware, searchUser);
router.post('/changePassword', changePassword);
router.post('/shareUserPost/:postId/:userId', userMiddleware, shareUserPost);

// Define PUT routes
router.put('/followUser/:id', userMiddleware, followUser);
router.put('/unFollowUser/:id', userMiddleware, unFollowUser);
router.put('/updateProfilePicture', userMiddleware, updateProfilePicture);
router.put('/addUserToSearchHistory', userMiddleware, addUserToSearchHistory);
router.put(
  '/removeUserFromSearchHistory',
  userMiddleware,
  removeUserFromSearchHistory
);

// Need to improve this route
router.get('/getFollowersPageInfos', userMiddleware, getFollowersPageInfos);
router.get('/getFollowingPageInfos', userMiddleware, getFollowingPageInfos);
router.put('/updateDetails', userMiddleware, updateDetails);

router.get('/getFriendsPageInfos', userMiddleware, getFriendsPageInfos);

router.get(
  '/getFollowersPageInfosId/:id',
  userMiddleware,
  getFollowersPageInfosId
); //
router.get(
  '/getFollowingPageInfosId/:id',
  userMiddleware,
  getFollowingPageInfosId
); //

// Export the router
export default router;
