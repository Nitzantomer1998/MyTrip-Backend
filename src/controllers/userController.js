// Import needed models
import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import Reaction from '../models/reactionModel.js';

// Import needed package
import bcrypt from 'bcrypt';

// Import needed function
import generateToken from '../helpers/generateToken.js';

async function getUserProfile(req, res) {
  try {
    // Get the search profile user
    const searchedProfile = await User.findOne({
      username: req.params.username,
    });

    // Get the current user
    const currentUser = await User.findById({ _id: req.user.id });

    // Get the search profile posts
    const posts = await Post.find({ user: searchedProfile._id })
      .populate('user', 'username picture')
      .populate('comments.commentBy', 'username picture commentAt')
      .sort({ createdAt: -1 });

    // Send back the search profile page
    res.json({
      ...searchedProfile.toObject(),
      posts,
      friendship: {
        following: currentUser.following.includes(searchedProfile._id),
      },
    });
  } catch (error) {
    console.error(`GetUserProfile Error: ${error}`);
  }
}

async function getUserSearchHistory(req, res) {
  try {
    // Get the current user search history
    const currentUser = await User.findById({ _id: req.user.id })
      .select('search')
      .populate('search.user', 'username picture');

    // Send back the user search history
    res.json(currentUser.search);
  } catch (error) {
    console.error(`GetUserSearchHistory Error: ${error}`);
  }
}

async function getUserFollowersPage(req, res) {
  try {
    // Get the current user followers
    const currentUser = await User.findById({ _id: req.params.id })
      .select('followers')
      .populate('followers', 'username picture');

    // Send back the current user followers
    res.json({ followers: currentUser.followers });
  } catch (error) {
    console.error(`GetUserFollowersPageInfos Error: ${error}`);
  }
}

async function getUserFollowingPage(req, res) {
  try {
    // Get the current user following
    const currentUser = await User.findById({ _id: req.params.id })
      .select('following')
      .populate('following', 'username picture');

    // Send back the current user following
    res.json({ following: currentUser.following });
  } catch (error) {
    console.error(`GetUserFollowingPageInfos Error: ${error}`);
  }
}

async function registerUser(req, res) {
  try {
    // Username is already taken, return accordingly
    if (await User.findOne({ username: req.body.username }))
      return res.status(400).json({ message: 'Username already taken' });

    // Email is already taken, return accordingly
    if (await User.findOne({ email: req.body.email }))
      return res.status(400).json({ message: 'Email already taken' });

    // Create and save the new user
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 12),
      gender: req.body.gender,
    });

    // Send back the new user info and token
    res.json({
      id: newUser._id,
      username: newUser.username,
      picture: newUser.picture,
      token: generateToken({ id: newUser._id.toString() }),
      message: 'User registered successfully',
    });
  } catch (error) {
    console.log(`RegisterUser Error: ${error}`);
  }
}

async function userLogin(req, res) {
  try {
    // Get the current user by email
    const currentUser = await User.findOne({ email: req.body.email });

    // Email doesnt exist, return accordingly
    if (!currentUser)
      return res.status(400).json({ message: 'Email does not exist' });

    // Incorrect password, return accordingly
    if (!(await bcrypt.compare(req.body.password, currentUser.password)))
      return res.status(400).json({ message: 'Unmatched password' });

    // Send back the current user info and token
    res.json({
      id: currentUser._id,
      username: currentUser.username,
      picture: currentUser.picture,
      token: generateToken({ id: currentUser._id.toString() }),
      message: 'User logged in successfully',
    });
  } catch (error) {
    console.error(`UserLogin Error: ${error}`);
  }
}

async function searchUser(req, res) {
  try {
    // Get users by username
    const searchedUser = await User.find({
      username: new RegExp(`^${req.params.username}`, 'i'),
    }).select('username picture');

    // Send back the searched user info
    res.json(searchedUser);
  } catch (error) {
    console.error(`SearchUser Error: ${error}`);
  }
}

async function changeUserPassword(req, res) {
  try {
    // Find user by id and update his password
    await User.findByIdAndUpdate(
      { _id: req.user.id },
      { password: await bcrypt.hash(req.body.password, 12) }
    );

    // Send back success message
    return res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(`ChangeUserPassword Error: ${error}`);
  }
}

async function shareUserPost(req, res) {
  try {
    // Destructing needed fields
    const { postId, userId } = req.params;

    // Find the original post
    const originalPost = await Post.findById(postId)
      .populate('comments')
      .populate({ path: 'user', select: 'username' });

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
    console.error(`ShareUserPost Error: ${error}`);
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

async function followUser(req, res) {
  try {
    // Get the sender and receiver
    const sender = await User.findById({ _id: req.user.id });
    const receiver = await User.findById({ _id: req.params.id });

    // Add the receiver to the sender following
    await sender.updateOne({ $push: { following: receiver._id } });

    // Add the sender to the receiver followers
    await receiver.updateOne({ $push: { followers: sender._id } });

    // Send back success message
    res.json({ message: 'User is following successfully' });
  } catch (error) {
    console.error(`FollowUser Error: ${error}`);
  }
}

async function unFollowUser(req, res) {
  try {
    // Get the sender and receiver
    const sender = await User.findById({ _id: req.user.id });
    const receiver = await User.findById({ _id: req.params.id });

    // Remove the receiver to the sender following
    await sender.updateOne({ $pull: { following: receiver._id } });

    // Remove the sender to the receiver followers
    await receiver.updateOne({ $pull: { followers: sender._id } });

    // Send back success message
    res.json({ message: 'User is unfollowing successfully' });
  } catch (error) {
    console.error(`UnFollowUser Error: ${error}`);
  }
}

async function updateUserProfilePicture(req, res) {
  try {
    // Update the current user profile picture
    await User.findByIdAndUpdate(
      { _id: req.user.id },
      { picture: req.body.url }
    );

    // Send back success message
    res.json({ message: 'Profile picture updated successfully' });
  } catch (error) {
    console.error(`UpdateUserProfilePicture Error: ${error}`);
  }
}

async function addUserToSearchHistory(req, res) {
  try {
    // Find the user and update the search history
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id, 'search.user': req.body.searchUser },
      { $set: { 'search.$.createdAt': new Date() } }
    );

    // If the user doesn't exist in the search history, add a new search item
    if (!updatedUser) {
      await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          $push: {
            search: { user: req.body.searchUser, createdAt: new Date() },
          },
        }
      );

      // Send back success message
      res.json({
        message: 'User been added to the search history successfully',
      });
    }
  } catch (error) {
    console.error(`AddUserToSearchHistory Error: ${error}`);
  }
}

async function removeUserFromSearchHistory(req, res) {
  try {
    // Find the user and remove him from the search history
    await User.updateOne(
      { _id: req.user.id },
      { $pull: { search: { user: req.body.searchUser } } }
    );

    // Send back success message
    res.json({ message: 'User removed from search history successfully' });
  } catch (error) {
    console.error(`RemoveUserFromSearchHistory Error: ${error}`);
  }
}

async function deleteUser(req, res) {
  try {
    // Delete the current user comments
    await Post.updateMany(
      { 'comments.commentBy': req.user.id },
      { $pull: { comments: { commentBy: req.user.id } } }
    );

    // Delete the current user reactions
    await Reaction.deleteMany({ reactBy: req.user.id });

    // Delete the current user following, followers and searched lists
    await User.updateMany(
      {
        $or: [{ following: req.user.id }, { followers: req.user.id }],
        $or: [{ 'search.user': req.user.id }],
      },
      {
        $pull: {
          following: req.user.id,
          followers: req.user.id,
          search: { user: req.user.id },
        },
      }
    );

    // Get the current user
    const deletedUser = await User.findById({ _id: req.user.id });

    // Delete the current user posts
    await Post.deleteMany({
      $or: [
        { 'originalUser.username': deletedUser.username },
        { user: req.user.id },
      ],
    });
    // Delete the current user
    await User.findByIdAndDelete({ _id: req.user.id });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(`DeleteUser Error: ${error}`);
  }
}

// Export the functions
export {
  getUserProfile,
  getUserSearchHistory,
  getUserFollowersPage,
  getUserFollowingPage,
  registerUser,
  userLogin,
  searchUser,
  changeUserPassword,
  shareUserPost,
  deleteUser,
  followUser,
  unFollowUser,
  updateUserProfilePicture,
  addUserToSearchHistory,
  removeUserFromSearchHistory,
  updateDetails,
};
