import express from 'express';
import {
  registerUser,
  authenticateUser,
  getAllUsers,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/sign-up', registerUser);
router.post('/sign-in', authenticateUser);
router.get('/search', getAllUsers);

export default router;
