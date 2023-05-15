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
    // Destructure req.user to get needed fields
    const { id } = req.user;

    // Getting the user search history
    const currentUser = await User.findById(id)
      .select('search')
      .populate('search.user', 'username picture');

    // Send back user search history
    res.json(currentUser.search);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



async function registerUser(req, res) {
  try {
    // Destructure req.body to get needed fields
    const { username, email, password, gender } = req.body;

    // Username is already taken, return accordingly
    if (await User.findOne({ username })) {
      return res.status(400).json({ message: 'Username Already Taken' });
    }

    // Email is already taken, return accordingly
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email Address Already Taken' });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password: await bcrypt.hash(password, 12),
      gender,
    });

    // Send back user info and token
    res.status(201).send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      token: generateToken({ id: user._id.toString() }, '1d'),
      message: 'Registered Successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function userLogin(req, res) {
  try {
    // Destructure req.body to get needed fields
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Email doesnt exist, return accordingly
    if (!user) {
      return res.status(401).json({ message: 'Email Doesnt Exist' });
    }

    // Password is incorrect, return accordingly
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid Password' });
    }

    // Send back user info and token
    res.status(201).send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      token: generateToken({ id: user._id.toString() }, '1d'),
      message: 'Logged In Successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



async function searchUser(req, res) {
  try {
    // Destructure req.params to get needed fields
    const { searchTerm } = req.params;

    // Find user by searchTerm and get his username and picture
    const searchedUser = await User.find({
      username: new RegExp(`^${searchTerm}`, 'i'),
    }).select('username picture');

    // Send back searched user
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
    if (!sender.following.includes(receiver._id)) {
      await sender.updateOne({
        $push: { following: receiver._id },
      });
      console.log(`${sender} following`);
    }

    // Add the sender to the receiver followers
    if (!receiver.followers.includes(sender._id)) {
      await receiver.updateOne({
        $push: { followers: sender._id },
      });
      console.log(`${receiver} followers`);
    }

    // Send back success message
    res.json({ message: 'User Is Following Successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function unfollowUser(req, res) {
  try {
    // Getting the sender and receiver
    const sender = await User.findById(req.user.id);
    const receiver = await User.findById(req.params.id);

    // Remove the receiver to the sender following
    if (sender.following.includes(receiver._id)) {
      await sender.updateOne({
        $pull: { following: receiver._id },
      });
      console.log(`${sender} unfollowing`);
    }

    // Remove the sender to the receiver followers
    if (receiver.followers.includes(sender._id)) {
      await receiver.updateOne({
        $pull: { followers: sender._id },
      });
      console.log(`${receiver} unfollowers`);
    }

    // Send back success message
    res.json({ message: 'User Is UnFollowing Successfully' });
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
  unfollowUser,
  addUserToSearchHistory,
  removeUserFromSearch,
};
