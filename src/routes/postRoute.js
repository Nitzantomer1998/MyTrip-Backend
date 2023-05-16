import userMiddleware from '../middlwares/userMiddleware.js';
import { Router } from 'express';
import {
  getAllPosts,
  createPost,
  commentPost,
  savePost,
  deletePost,
} from '../controllers/postController.js';

const router = Router();

router.get('/getAllPosts', userMiddleware, getAllPosts);

router.post('/createPost', userMiddleware, createPost);

router.put('/commentPost', userMiddleware, commentPost);
router.put('/savePost/:id', userMiddleware, savePost);

router.delete('/deletePost/:id', userMiddleware, deletePost);

export default router;
