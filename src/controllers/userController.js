// Import needed models
import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import { hash, compare } from 'bcrypt';

// Import needed functions
import generateToken from '../helpers/generateToken.js';

async function getUserProfile(req, res) {
  try {
    // Destructuring needed fields
    const { username } = req.params;

    // Find user by username without password
    const searchProfile = await User.findOne({ username }).select('-password');

    // Find user by id
    const currentUser = await User.findById(req.user.id);

    // Get the search profile posts and populate them with user info and comments
    const posts = await Post.find({ user: searchProfile._id })
      .populate('user')
      .populate('comments.commentBy', 'username picture commentAt')
      .sort({ createdAt: -1 });

    // Populate the searched profile
    await searchProfile.populate('username picture');

    // Send back the search profile info, posts and friendship
    res.status(200).json({
      ...searchProfile.toObject(),
      posts,
      friendship: {
        friends: false,
        following: currentUser.following.includes(searchProfile._id),
        requestSent: false,
        requestReceived: false,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getUserSearchHistory(req, res) {
  try {
    // Getting the current user search history
    const currentUser = await User.findById(req.user.id)
      .select('search')
      .populate('search.user', 'username picture');

    // Send back the user search history
    res.status(200).json(currentUser.search);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function registerUser(req, res) {
  try {
    // Destructuring needed fields
    const { username, email, password, gender } = req.body;

    // Username is already taken, return accordingly
    if (await User.findOne({ username }))
      return res.status(400).json({ message: 'Username already taken' });

    // Email is already taken, return accordingly
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already taken' });

    // Creating new user
    const newUser = await new User({
      username,
      email,
      password: await hash(password, 12),
      gender,
    });

    // Saving the new user
    await newUser.save();

    // Send back the new user info and token
    res.status(201).send({
      id: newUser._id,
      username: newUser.username,
      picture: newUser.picture,
      token: generateToken({ id: newUser._id.toString() }, '7d'),
      message: 'User registered successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function userLogin(req, res) {
  try {
    // Destructuring needed fields
    const { email, password } = req.body;

    // Find user by email
    const foundUser = await User.findOne({ email });

    // Email doesnt exist, return accordingly
    if (!foundUser)
      return res.status(400).json({ message: 'Email does not exist' });

    // Incorrect password, return accordingly
    if (!(await compare(password, foundUser.password)))
      return res.status(400).json({ message: 'Unmatched password' });

    // Send back the found user info and token
    res.status(201).send({
      id: foundUser._id,
      username: foundUser.username,
      picture: foundUser.picture,
      token: generateToken({ id: foundUser._id.toString() }, '7d'),
      message: 'User logged in successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function searchUser(req, res) {
  try {
    // Destructuring needed fields
    const { searchTerm } = req.params;

    // Find user by searchTerm and get his username and picture
    const searchedUser = await User.find({
      username: new RegExp(`^${searchTerm}`, 'i'),
    }).select('username picture');

    // Send back the searched user info
    res.status(200).json(searchedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function followUser(req, res) {
  try {
    // Getting the sender and receiver
    const sender = await User.findById(req.user.id);
    const receiver = await User.findById(req.params.id);

    // Add the receiver to the sender following
    await sender.updateOne({ $push: { following: receiver._id } });

    // Add the sender to the receiver followers
    await receiver.updateOne({ $push: { followers: sender._id } });

    // Send back success message
    res.status(200).json({ message: 'User is following successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function unFollowUser(req, res) {
  try {
    // Getting the sender and receiver
    const sender = await User.findById(req.user.id);
    const receiver = await User.findById(req.params.id);

    // Remove the receiver to the sender following
    await sender.updateOne({ $pull: { following: receiver._id } });

    // Remove the sender to the receiver followers
    await receiver.updateOne({ $pull: { followers: sender._id } });

    // Send back success message
    res.status(200).json({ message: 'User is unfollowing successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function addUserToSearchHistory(req, res) {
  try {
    // Destructuring needed fields
    const { searchUser } = req.body;
    const { id: currentUser } = req.user;

    // Find the user by ID and update the search history
    const updatedUser = await User.findOneAndUpdate(
      { _id: currentUser, 'search.user': searchUser },
      { $set: { 'search.$.createdAt': new Date() } },
      { new: true }
    );

    // If the user doesn't exist in the search history, add a new search item
    if (!updatedUser) {
      await User.findOneAndUpdate(
        { _id: currentUser },
        { $push: { search: { user: searchUser, createdAt: new Date() } } },
        { new: true, upsert: true }
      );

      // Send back success message
      res.status(200).json({
        message: 'User been added to the search history successfully',
      });
    } else {
      res
        .status(200)
        .json({ message: 'User been updated in search history successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function removeUserFromSearchHistory(req, res) {
  try {
    // Destructuring needed fields
    const { searchUser } = req.body;
    const { id: currentUser } = req.user;

    // Find user by id
    const foundUser = { _id: currentUser };

    // Remove user from search history
    const removeUser = { $pull: { search: { user: searchUser } } };

    // Update user search history
    await User.updateOne(foundUser, removeUser);

    // Send back success message
    res
      .status(200)
      .json({ message: 'User removed from search history successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Export the functions
export {
  getUserProfile,
  getUserSearchHistory,
  registerUser,
  userLogin,
  searchUser,
  followUser,
  unFollowUser,
  addUserToSearchHistory,
  removeUserFromSearchHistory,
};
