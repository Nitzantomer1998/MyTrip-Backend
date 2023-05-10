// Import needed packages
import express from 'express';

// Import needed functions
import userMiddleware from '../middlwares/userMiddleware.js';
import imageUploadMiddleware from '../middlwares/imageUploadMiddleware.js';
import { uploadImages, listImages } from '../controllers/uploadController.js';

// Define router
const router = express.Router();

// Define POST routes
router.post(
  '/uploadImages',
  userMiddleware,
  imageUploadMiddleware,
  uploadImages
);
router.post('/listImages', userMiddleware, listImages);

// Export router
export default router;
