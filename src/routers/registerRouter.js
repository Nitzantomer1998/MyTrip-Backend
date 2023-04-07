import express from 'express';
import Register from '../models/registerModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const register = await Register.create(req.body);
    res.status(201).json(register);
  } catch (error) {
    console.log(error.message);
    if (error.name === 'MongoError' && error.code === 11000) {
      res.status(409).json({ message: 'Email already registered' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

export default router;
