import express from 'express';
import {
  registerUser,
  authenticateUser,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/sign-up', registerUser);
router.post('/sign-in', authenticateUser);

export default router;
