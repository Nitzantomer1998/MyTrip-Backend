// Import needed function
import removeUnAuthorizedImage from '../helpers/removeUnAutherizedImage.js';

async function imageUploadMiddleware(req, res, next) {
  try {
    // Supported image formats
    const supportedImageFormats = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    // Max file size in bytes (5MB)
    const MAX_FILE_SIZE_BYTES = 1024 * 1024 * 5;

    // No files were uploaded, send error message
    if (!req.files || Object.values(req.files).flat().length === 0)
      return res.status(422).json({ message: 'No files have been selected' });

    // Get all files (images)
    const files = Object.values(req.files).flat();

    // Verifying image format and size is within limits
    for (const file of files) {
      // Format is not supported, remove it and send error message
      if (!supportedImageFormats.includes(file.mimetype)) {
        removeUnAuthorizedImage(file.tempFilePath);
        return res.status(400).json({ message: 'Unsupported image format' });
      }

      // Size is not supported, remove it and send error message
      if (file.size > MAX_FILE_SIZE_BYTES) {
        removeUnAuthorizedImage(file.tempFilePath);
        return res.status(400).json({ message: 'Image size is too large' });
      }
    }

    // All files are valid, continue
    next();
  } catch (error) {
    console.error(`imageUploadMiddleware Error: ${error.message}`);
  }
}

// Export the function
export default imageUploadMiddleware;
