// Import needed package
import fs from 'fs';

function removeUnAuthorizedImage(path) {
  // Remove the unauthorized image
  fs.unlink(path, (error) => {
    if (error) console.error(`removeUnAuthorizedImage Error: ${error.message}`);
  });
}

// Export the function
export default removeUnAuthorizedImage;
