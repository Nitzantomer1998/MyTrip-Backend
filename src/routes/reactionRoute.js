// Import needed functions
import userMiddleware from '../middlwares/userMiddleware.js';
import { Router } from 'express';
import {
  postReaction,
  getUserTotalLikes,
  getPostReactions,
} from '../controllers/reactionController.js';

// Define router
const router = Router();

// Define GET routes
router.get('/getPostReactions/:id', userMiddleware, getPostReactions);

router.put('/reactPost', userMiddleware, postReaction);
router.get('/getUserTotalLikes/:id', userMiddleware, getUserTotalLikes);

// Export the router
export default router;
