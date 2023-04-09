import User from '../models/userModel.js';

const userRegistration = async (req, res, next) => {
  const { email, password } = req.body;
  const isUserExists = await User.findOne({ email });

  if (isUserExists) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  const newUser = await User.create({
    email,
    password,
  });

  res
    .status(201)
    .json({ message: 'User registered successfully', user: newUser });
};

const userAuthentication = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  } else if (user.password !== password) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  res.status(200).json({ message: 'Login successful' });
};

export { userRegistration, userAuthentication };
