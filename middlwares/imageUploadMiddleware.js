// Import needed packages
import fs from 'fs';

async function imageUploadMiddleware(req, res, next) {
  // Supported image formats
  const supportedImageFormats = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  try {
    // No files were uploaded, send error message
    if (!req.files || Object.values(req.files).flat().length === 0) {
      return res.status(400).json({ message: 'No files have been selected' });
    }

    // Get all files (images)
    const files = Object.values(req.files).flat();

    // Verifying image format and size is within limits
    for (const file of files) {
      // Format is not supported, remove it and send error message
      if (!supportedImageFormats.includes(file.mimetype)) {
        removeUnauthorizedImage(file.tempFilePath);
        return res.status(400).json({ message: 'Unsupported image format' });
      }

      // Size is not supported, remove it and send error message
      if (file.size > 1024 * 1024 * 5) {
        removeUnauthorizedImage(file.tempFilePath);
        return res.status(400).json({ message: 'Image size is too large' });
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Assistant function to remove unauthorized images
function removeUnauthorizedImage(path) {
  // Remove the unauthorized image
  fs.unlink(path, (error) => {
    if (error) {
      console.error(`Error removing unauthorized image: ${error.message}`);
    }
  });
}

export default imageUploadMiddleware;
