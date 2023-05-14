// Import needed packages
import express from 'express';

// Import needed functions
import userMiddleware from '../middlwares/userMiddleware.js';
import {
  getUserProfile,
  getUserSearchHistory,
  registerUser,
  userLogin,
  findUser,
  searchUser,
  followUser,
  unfollowUser,
  addUserToSearchHistory,
  removeUserFromSearch,
  upadeteUserPassword,
  addFriend,
  updateDetails,
  updateCover,
  updateProfilePicture,
} from '../controllers/userController.js';

// Define router
const router = express.Router();

// Define GET routes
router.get('/getUserProfile/:username', userMiddleware, getUserProfile); // Works, but not perfect
router.get('/getUserSearchHistory', userMiddleware, getUserSearchHistory); // Finished

// Define POST routes
router.post('/registerUser', registerUser); // Finished
router.post('/userLogin', userLogin); // Finished
router.post('/findUser', findUser); // ??? Didnt found when its called -----------------
router.post('/searchUser/:searchTerm', userMiddleware, searchUser); // Finish

// Define PUT routes
router.put('/followUser/:id', userMiddleware, followUser); // Works, but not perfect ----- update after fix following/follow button
router.put('/unfollowUser/:id', userMiddleware, unfollowUser); // Works, but not perfect ----- update after fix following/follow button
router.put('/addUserToSearchHistory', userMiddleware, addUserToSearchHistory); // Works, but not perfect
router.put('/removeUserFromSearch', userMiddleware, removeUserFromSearch); // Finished

router.put('/updateProfilePicture', userMiddleware, updateProfilePicture);
router.post('/updateUserPassword', upadeteUserPassword);
router.put('/updateDetails', userMiddleware, updateDetails);

router.put('/updateCover', userMiddleware, updateCover);
router.put('/addFriend/:id', userMiddleware, addFriend);



// Export router
export default router;
