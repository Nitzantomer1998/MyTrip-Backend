// Import needed function
import { verify } from 'jsonwebtoken';

async function userMiddleware(req, res, next) {
  try {
    // Get token from header
    const authenticateHeader = req.header('Authorization');

    // Check if token exists
    const token = authenticateHeader?.slice(7);

    // Token is invalid or doesn't exist, return accordingly
    if (!token)
      return res.status(401).json({ message: 'Invalid Authentication' });

    // Verify token, for accessing protected routes
    verify(token, process.env.TOKEN_SECRET, (error, user) => {
      if (error)
        return res.status(401).json({ message: 'Invalid Authentication' });

      // Token is valid, continue
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Export the function
export default userMiddleware;
