import express from 'express';
import {
  userRegistration,
  userAuthentication,
} from '../controllers/userController.js';
const router = express.Router();

router.route('/register').post(userRegistration);
router.route('/login').post(userAuthentication);

export default router;
