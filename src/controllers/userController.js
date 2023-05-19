// Import needed models
import User from '../models/userModel.js';
import Post from '../models/postModel.js';

// Import needed functions
import generateToken from '../helpers/generateToken.js';
import { hash, compare } from 'bcrypt';

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

async function changePassword(req, res) {
  try {
    // Destructuring needed fields
    const { userInfos, password } = req.body;
    const { id } = userInfos.user;

    // Find user by id and update his password
    await User.findByIdAndUpdate(
      id,
      {
        password: await hash(password, 12),
      },
      {
        new: true,
      }
    );

    // Send back success message
    return res.status(200).json({ message: 'ok' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function shareUserPost(req, res) {
  try {
    // Destructing needed fields
    const { postId, userId } = req.params;

    // Find the original post
    const originalPost = await Post.findById(postId)
      .populate('comments')
      .populate({
        path: 'user',
        select: 'username',
      });

    // Find the user who shared the post
    const sharingUser = await User.findById(userId, 'username');

    // Create new post
    const newPost = new Post({
      post: postId,
      user: userId,
      sharedFrom: postId,
      text: originalPost.text,
      images: originalPost.images,
      background: originalPost.background,
      originalUser: {
        username: originalPost.user.username,
      },
      sharingUser: {
        username: sharingUser.username,
      },
    });

    // Save the new post
    await newPost.save();

    // Send back the new post
    res.json(newPost);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to share post' });
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

async function updateProfilePicture(req, res) {
  try {
    // Deconstructing needed fields
    const { url } = req.body;

    // Update user profile picture
    await User.findByIdAndUpdate(req.user.id, {
      picture: req.body.url,
    });

    // Send back success message
    res.status(200).json({ message: 'Profile picture updated successfully' });
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

async function getFollowingPageInfos(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select('following')
      .populate('following', 'username picture');

    res.json({
      following: user.following,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getFollowersPageInfos(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select('followers')
      .populate('followers', 'username picture');

    res.json({
      followers: user.followers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateDetails(req, res) {
  try {
    const { infos } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        details: infos,
      },
      {
        new: true,
      }
    );
    res.json(updated.details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function getFollowersPageInfosId(req, res) {
  console.log('REACHED GETFOLLOWERSPAGEINFOID');
  console.log(req.params.id);
  try {
    const user = await User.findById(req.params.id)
      .select('followers')
      .populate('followers', 'username picture');
    res.json({ followers: user.followers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
} //

async function getFollowingPageInfosId(req, res) {
  console.log('REACHED GETFOLLOWINGPAGEINFOID');
  console.log(req.params.id);
  try {
    const user = await User.findById(req.params.id)
      .select('following')
      .populate('following', 'picture username');
    res.json({ following: user.following });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
} //

async function getFriendsPageInfos(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select('friends requests')
      .populate('friends', 'picture username')
      .populate('requests', 'picture username');
    const sentRequests = await User.find({
      requests: mongoose.Types.ObjectId(req.user.id),
    }).select('picture username');
    res.json({
      friends: user.friends,
      requests: user.requests,
      sentRequests,
    });
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
  changePassword,
  shareUserPost,
  followUser,
  unFollowUser,
  updateProfilePicture,
  addUserToSearchHistory,
  removeUserFromSearchHistory,
  getFollowingPageInfos,
  getFollowersPageInfos,
  updateDetails,
  getFollowersPageInfosId,
  getFriendsPageInfos,
  getFollowingPageInfosId,
};
