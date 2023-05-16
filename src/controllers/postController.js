import User from '../models/userModel.js';
import Post from '../models/postModel.js';

async function getAllPosts(req, res) {
  try {
    const { id } = req.user;

    const user = await User.findById(id).select('following');

    const followingPostsPromises = user.following.map((user) => {
      return Post.find({ user })
        .populate('user', 'username picture')
        .populate('comments.commentBy', 'username picture')
        .sort('-createdAt')
        .limit(10);
    });

    const [followingPosts, userPosts] = await Promise.all([
      Promise.all(followingPostsPromises),
      Post.find({ user: id })
        .populate('user', 'username picture')
        .populate('comments.commentBy', 'username picture')
        .sort('-createdAt')
        .limit(10),
    ]);

    const posts = followingPosts.flat().concat(userPosts);
    posts.sort((postA, postB) => postB.createdAt - postA.createdAt);

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}
