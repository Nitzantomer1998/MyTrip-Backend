// Import needed packages
import bcrypt from 'bcrypt';

// Import needed models
import User from '../models/userModel.js';
import Post from '../models/postModel.js';

// Import needed functions
import generateToken from '../helpers/tokens.js';

async function getUserProfile(req, res) {
  try {
    // Destructuring needed fields
    const { username } = req.params;
    const { id } = req.user;

    // Find user by username without password
    const searchProfile = await User.findOne({ username }).select('-password');

    // Find user by id
    const currentUser = await User.findById(id);

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
    // Destructuring needed fields
    const { id } = req.user;

    // Getting the current user search history
    const currentUser = await User.findById(id)
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
      password: await bcrypt.hash(password, 12),
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
    if (!(await bcrypt.compare(password, foundUser.password)))
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
    // Destructure req to get needed fields
    const { searchUser } = req.body;
    const { id } = req.user;

    // Find user by id
    const user = await User.findById(id);

    // Create new search
    const search = {
      user: searchUser,
      createdAt: new Date(),
    };

    const check = user.search.find((x) => x.user.toString() === searchUser);
    if (check) {
      await User.updateOne(
        {
          _id: id,
          'search._id': check._id,
        },
        {
          $set: { 'search.$.createdAt': new Date() },
        }
      );
    } else {
      await User.findByIdAndUpdate(id, {
        $push: {
          search,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function removeUserFromSearch(req, res) {
  try {
    // Destructure req to get needed fields
    const { searchUser } = req.body;
    const { id } = req.user;

    // Find user by id filter
    const filter = { _id: id };

    // Find user by id update
    const update = { $pull: { search: { user: searchUser } } };

    // Find user by id and remove search
    await User.updateOne(filter, update);

    // Send back success message
    res.status(200).json({ message: 'User Removed From Search Successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}










export {
 getUserProfile,
 getUserSearchHistory,
  registerUser,
  userLogin,
  searchUser,
  followUser,
  unFollowUser,
  addUserToSearchHistory,
  removeUserFromSearch,
};
