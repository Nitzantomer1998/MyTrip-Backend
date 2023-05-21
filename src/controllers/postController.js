// Import needed models
import User from '../models/userModel.js';
import Post from '../models/postModel.js';

async function getAllPosts(req, res) {
  try {
    // Get the current user's following list
    const currentUser = await User.findById({ _id: req.user.id }).select(
      'following'
    );

    // Get posts from user following
    const followingPostsPromise = Post.find({
      user: { $in: currentUser.following },
    })
      .populate('user', 'username picture')
      .populate('comments.commentBy', 'username picture')
      .sort('-createdAt')
      .limit(10)
      .lean();

    // Get posts from user
    const userPostsPromise = Post.find({ user: req.user.id })
      .populate('user', 'username picture')
      .populate('comments.commentBy', 'username picture')
      .sort('-createdAt')
      .limit(10)
      .lean();

    // Wait for both queries to complete
    const [followingPosts, userPosts] = await Promise.all([
      followingPostsPromise,
      userPostsPromise,
    ]);

    // Combine and sort posts
    const posts = [...followingPosts, ...userPosts].sort(
      (postA, postB) => postB.createdAt - postA.createdAt
    );

    // Send back the posts
    res.json(posts);
  } catch (error) {
    console.error(`getAllPosts Error: ${error.message}`);
  }
}

async function createPost(req, res) {
  try {
    // Create the new post
    const newPost = await Post.create({
      user: req.user.id,
      location: req.body.location,
      text: req.body.text,
      images: req.body.images,
      type: req.body.type,
      background: req.body.background,
    });

    // Populate the new post with user info
    const populatedPost = await newPost.populate('user', 'username picture');

    // Send back the created post
    res.json(populatedPost);
  } catch (error) {
    console.error(`createPost Error: ${error.message}`);
  }
}

async function commentPost(req, res) {
  try {
    // Find post and insert the comment, then populate the commentBy field
    const newComments = await Post.findByIdAndUpdate(
      { _id: req.body.postId },
      {
        $push: {
          comments: {
            comment: req.body.comment,
            commentBy: req.user.id,
            commentAt: new Date(),
          },
        },
      },
      {
        new: true,
      }
    ).populate('comments.commentBy', 'username picture');

    // Send back the new comments
    res.json(newComments.comments);
  } catch (error) {
    console.error(`commentPost Error: ${error.message}`);
  }
}

async function deletePost(req, res) {
  try {
    // Get the post and delete it
    await Post.findByIdAndRemove({ _id: req.params.id });

    // Send back success message
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(`deletePost Error: ${error.message}`);
  }
}

const savePost = async (req, res) => {
  try {
    // Destructuring needed fields
    const postId = req.params.id;
    const user = await User.findById(req.user.id);
    const check = user?.savedPosts.find(
      (post) => post.post.toString() == postId
    );
    if (check) {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: {
          savedPosts: {
            _id: check._id,
          },
        },
      });
    } else {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          savedPosts: {
            post: postId,
            savedAt: new Date(),
          },
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

async function getPostsByLocation(req, res) {
  const location = req.params.location;

  try {
    console.log(location + 'backend getpostsbylocation');
    const posts = await Post.find({ location: location })
      .populate('user')
      .populate('comments.commentBy');

    if (posts.length === 0) {
      return res
        .status(404)
        .json({ message: 'No posts found with this location.' });
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getUniqueLocations(req, res) {
  try {
    const locations = await Post.distinct('location');

    if (locations.length === 0) {
      return res.status(404).json({ message: 'No locations found.' });
    }

    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function searchPostByLocation(req, res) {
  try {
    // Destructuring needed fields
    const { searchTerm } = req.params;

    // Find posts by searchTerm and get the location
    const searchedPost = await Post.find({
      location: new RegExp(`^${searchTerm}`, 'i'),
    });

    // Send back the searched posts
    res.status(200).json(searchedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getAllPostsSaved(req, res) {
  try {
    // Trouver l'utilisateur par son nom d'utilisateur
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    //console.log('User:', user);

    // Obtenir la liste des posts sauvegardés
    const savedPostIds = user.savedPosts.map(
      (savedPostObj) => savedPostObj.post
    );
    const savedPosts = await Post.find({ _id: { $in: savedPostIds } })
      .populate('user', 'first_name last_name picture username cover')
      .populate('comments.commentBy', 'first_name last_name picture username')
      .sort({ createdAt: -1 });

    console.log('Saved Posts:', savedPosts);

    // Renvoyer la liste des posts sauvegardés
    res.status(200).json(savedPosts);
  } catch (error) {
    //console.error('Error:', error);

    res.status(500).json({ message: error.message });
  }
}

// Export the functions
export {
  getAllPosts,
  createPost,
  commentPost,
  deletePost,
  savePost,
  getPostsByLocation,
  getUniqueLocations,
  getAllPostsSaved,
};
