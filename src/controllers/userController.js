import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

async function registerUser(req, res) {
  const { username, email, password, gender } = req.body;
  const errors = {};

  if (await User.findOne({ username })) {
    errors.username = 'Already exists';
  }

  if (await User.findOne({ email })) {
    errors.email = 'Already exists';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: errors });
  }

  const newUser = await User.create({
    username,
    email,
    password: await bcrypt.hash(password, 10),
    gender,
  });

  return res
    .status(201)
    .json({ message: 'User registered successfully', user: newUser });
}

async function authenticateUser(req, res) {
  const { email, password } = req.body;
  const errors = {};

  const foundUser = await User.findOne({ email });

  if (!foundUser) {
    errors.email = 'Doesnt exists';
  }

  if (!(await bcrypt.compare(password, foundUser.password))) {
    errors.password = 'Doesnt match';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(401).json({ message: errors });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET);
  return res.status(200).json({ message: 'Login successful', token });
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
};

export { registerUser, authenticateUser };
