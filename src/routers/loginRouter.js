import express from 'express';
import Login from '../models/loginModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Register.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    if (user.password !== password) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
