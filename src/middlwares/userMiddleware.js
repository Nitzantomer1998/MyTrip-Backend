// Import needed package
import jwt from 'jsonwebtoken';

async function userMiddleware(req, res, next) {
  try {
    // Get token from header
    const authenticateHeader = req.header('Authorization');

    // Extract token from header and remove prefix
    const token = authenticateHeader?.slice(process.env.TOKEN_PREFIX);

    // Token is invalid or doesn't exist, return accordingly
    if (!token)
      return res.status(401).json({ message: 'Invalid Authentication' });

    // Verify token, for accessing protected routes
    jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
      if (error)
        return res.status(401).json({ message: 'Invalid Authentication' });

      // Token is valid, continue
      req.user = user;
      next();
    });
  } catch (error) {
    console.error(`userMiddleware Error: ${error.message}`);
  }
}

// Export the function
export default userMiddleware;
