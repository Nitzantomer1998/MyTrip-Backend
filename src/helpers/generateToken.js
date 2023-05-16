// Import needed packages
import jwt from 'jsonwebtoken';

function generateToken(payload, expired) {
  try {
    // Generate token and return it
    return jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: expired,
    });
  } catch (error) {
    console.error(`Error generating token: ${error.message}`);
    return null;
  }
}

// Export the function
export default generateToken;
