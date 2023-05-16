// Import needed packages
import cloudinary from 'cloudinary';

// Import needed function
import removeUnAuthorizedImage from '../helpers/removeUnAutherizedImage.js';

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

async function listImages(req, res) {
  try {
    // Destructuring needed fields
    const { path, sort, max } = req.body;

    // Find user by searchTerm and get his username and picture
    const userPosts = await cloudinary.v2.search
      .expression(`${path}`)
      .sort_by('created_at', `${sort}`)
      .max_results(max)
      .execute();

    // Send back the user posts
    res.status(200).json(userPosts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const uploadImages = async (req, res) => {
  try {
    // Destructuring needed fields
    const { path } = req.body;
    const files = Object.values(req.files).flat();

    // Upload images to cloudinary
    const imageUploadPromises = files.map(async (file) => {
      try {
        const url = await uploadToCloudinary(file, path);
        removeUnAuthorizedImage(file.tempFilePath);
        return url;
      } catch (error) {
        console.error(error);
        removeUnAuthorizedImage(file.tempFilePath);
        return null;
      }
    });

    // Wait for all promises to resolve
    const uploadedImages = await Promise.all(imageUploadPromises);
    const validImages = uploadedImages.filter((url) => url !== null);

    // Send back the uploaded images
    res.status(200).json(validImages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

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
    throw new Error('Error: Image upload failed');
  }
}

// Export the functions
export { listImages, uploadImages };
