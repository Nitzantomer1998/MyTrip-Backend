// Import needed package
import cloudinary from 'cloudinary';

// Import needed function
import removeUnAuthorizedImage from '../helpers/removeUnAutherizedImage.js';

// Set up cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

async function listImages(req, res) {
  try {
    // Get user posts from cloudinary
    const userPosts = await cloudinary.v2.search
      .expression(`${req.body.path}`)
      .sort_by('created_at', `${req.body.sort}`)
      .max_results(req.body.max)
      .execute();

    // Send back the user posts
    res.json(userPosts);
  } catch (error) {
    console.error(`listImages Error: ${error.message}`);
  }
}

async function uploadImages(req, res) {
  try {
    console.log("file" + req);
    // Get all files from request
    const files = Object.values(req.files).flat();

    // Upload images to cloudinary
    const imageUploadPromises = files.map(async (file) => {
      try {
        const url = await uploadToCloudinary(file, req.body.path);
        removeUnAuthorizedImage(file.tempFilePath);
        return url;
      } catch (error) {
        console.error(`uploadImages Error: ${error.message}`);
        removeUnAuthorizedImage(file.tempFilePath);
        return null;
      }
    });

    // Wait for all promises to resolve
    const uploadedImages = await Promise.all(imageUploadPromises);
    const validImages = uploadedImages.filter((url) => url !== null);

    // Send back the uploaded images
    res.json(validImages);
  } catch (error) {
    console.error(`uploadImages Error: ${error.message}`);
  }
}

async function uploadToCloudinary(file, path) {
  try {
    // Upload image to cloudinary
    const imageUrl = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: path,
    });

    // Return the image url
    return { url: imageUrl.secure_url };
  } catch (error) {
    removeUnAuthorizedImage(file.tempFilePath);
    console.error(`uploadToCloudinary Error: ${error.message}`);
    throw new Error('Error: Image upload failed');
  }
}

// Export the functions
export { listImages, uploadImages };
