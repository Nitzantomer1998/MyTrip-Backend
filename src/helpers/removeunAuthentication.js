// Import needed function
import { unlink } from 'fs';

function removeUnAuthorizedImage(path) {
  // Remove the unauthorized image
  unlink(path, (error) => {
    if (error)
      console.error(`Error removing unauthorized image: ${error.message}`);
  });
}

// Export the function
export default removeUnAuthorizedImage;
