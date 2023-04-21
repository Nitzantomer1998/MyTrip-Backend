import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const userRegistration = async (req, res) => {
  const { username, email, password, gender } = req.body;
  const isUserExists = await User.findOne({ username });
  const isEmailExists = await User.findOne({ email });

  if (isUserExists) {
    res.status(400).json({ message: 'Already exists' });
    return;
  }

  if (isEmailExists) {
    res.status(400).json({ message: 'Already exists' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    gender,
  });

  res
    .status(201)
    .json({ message: 'User registered successfully', user: newUser });
};

const userAuthentication = async (req, res) => {
  let { email, password } = req.body;

  email = await User.findOne({ email });

  if (!email) {
    res.status(401).json({ message: 'Invalid email' });
    return;
  }

  const isPasswordMatch = await bcrypt.compare(password, User.password);

  if (!isPasswordMatch) {
    res.status(401).json({ message: 'Invalid password' });
    return;
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET);

  res.status(200).json({ message: 'Login successful', token });
};

export { userRegistration, userAuthentication };
