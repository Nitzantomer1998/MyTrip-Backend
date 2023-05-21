// Import needed functions
import userMiddleware from '../middlwares/userMiddleware.js';
import { Router } from 'express';
import { getPostReactions } from '../controllers/reactionController.js';

// Define router
const router = Router();

// Define GET routes
router.get('/getPostReactions/:id', userMiddleware, getPostReactions);

// Export the router
export default router;
