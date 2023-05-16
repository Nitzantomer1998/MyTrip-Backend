// Import needed functions
import userMiddleware from '../middlwares/userMiddleware.js';
import imageUploadMiddleware from '../middlwares/imageUploadMiddleware.js';
import { Router } from 'express';
import { listImages, uploadImages } from '../controllers/uploadController.js';

// Define router
const router = Router();

// Define POST routes.
router.post('/listImages', userMiddleware, listImages);
router.post(
  '/uploadImages',
  userMiddleware,
  imageUploadMiddleware,
  uploadImages
);

// Export the router
export default router;
