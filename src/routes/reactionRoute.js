// Import needed functions
import userMiddleware from '../middlwares/userMiddleware.js';
import { Router } from 'express';
import {
  getPostReactions,
  postReaction,
} from '../controllers/reactionController.js';

// Define router
const router = Router();

// Define GET routes
router.get('/getPostReactions/:id', userMiddleware, getPostReactions);

// Define PUT routes
router.put('/postReaction', userMiddleware, postReaction);

// Export the router
export default router;
