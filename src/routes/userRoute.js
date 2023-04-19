import express from 'express';
import {
  userRegistration,
  userAuthentication,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', userRegistration);
router.post('/login', userAuthentication);

export default router;
