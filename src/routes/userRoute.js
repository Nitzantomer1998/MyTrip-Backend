import express from 'express';
import {
  userRegistration,
  userAuthentication,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/sign-up', userRegistration);
router.post('/sign-in', userAuthentication);

export default router;
