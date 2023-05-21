// Import needed packages
import jwt from 'jsonwebtoken';

function generateToken(payload) {
  try {
    // Generate a token and return it
    return jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });
  } catch (error) {
    console.error(`Error generating token: ${error.message}`);
    return null;
  }
}

// Export the function
export default generateToken;
