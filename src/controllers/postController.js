// Import needed models
import User from '../models/userModel.js';
import Post from '../models/postModel.js';

async function getAllPosts(req, res) {
  try {
    // Destructuring needed fields
    const { id } = req.user;

    // Find user by id and get his following
    const user = await User.findById(id).select('following');

    // Get posts from user following and user
    const followingPostsPromises = user.following.map((user) => {
      return Post.find({ user })
        .populate('user', 'username picture')
        .populate('comments.commentBy', 'username picture')
        .sort('-createdAt')
        .limit(10);
    });

    // Get user posts and populate them with user info and comments
    const [followingPosts, userPosts] = await Promise.all([
      Promise.all(followingPostsPromises),
      Post.find({ user: id })
        .populate('user', 'username picture')
        .populate('comments.commentBy', 'username picture')
        .sort('-createdAt')
        .limit(10),
    ]);

    // Concat and sort posts
    const posts = followingPosts.flat().concat(userPosts);
    posts.sort((postA, postB) => postB.createdAt - postA.createdAt);

    // Send back the posts
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function createPost(req, res) {
  try {
    // Destructuring needed fields
    const { user, type, background, text, images } = req.body;

    // Create new post
    const newPost = await new Post({
      user,
      type,
      background,
      text,
      images,
    }).save();

    // Populate the new post with user info
    const populatedPost = await newPost.populate('user', 'username picture');

    // Send back the created post
    res.status(201).json(populatedPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function commentPost(req, res) {
  try {
    // Destructuring needed fields
    const { comment, postId } = req.body;

    // Create new comment and push it to the post, finnaly populate it with user info
    const newComments = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            comment: comment,
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
    res.status(200).json(newComments.comments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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

async function deletePost(req, res) {
  try {
    // Find post by id and delete it
    await Post.findByIdAndRemove(req.params.id);

    // Send back success message
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Export the functions
export { getAllPosts, createPost, commentPost, savePost, deletePost };
