import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const userRegistration = async (req, res) => {
  const { email, password } = req.body;
  const isUserExists = await User.findOne({ email });

  if (isUserExists) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
  });

  res
    .status(201)
    .json({ message: 'User registered successfully', user: newUser });
};

const userAuthentication = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401).json({ message: 'Invalid email' });
    return;
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    res.status(401).json({ message: 'Invalid password' });
    return;
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET);

  res.status(200).json({ message: 'Login successful', token });
};

export { userRegistration, userAuthentication };
