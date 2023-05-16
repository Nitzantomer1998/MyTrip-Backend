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

async function createPost(req, res) {
  try {
    const { user, type, background, text, images } = req.body;

    const newPost = await new Post({
      user,
      type,
      background,
      text,
      images,
    }).save();

    const populatedPost = await newPost.populate('user', 'username picture');

    res.status(201).json(populatedPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function commentPost(req, res) {
  try {
    const { comment, postId } = req.body;

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

    res.status(200).json(newComments.comments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const savePost = async (req, res) => {
  console.log('savePost function');
  console.log(`savePost req.body: ${JSON.stringify(req.body, null, 2)}`);
  console.log(`savePost req.user: ${JSON.stringify(req.user, null, 2)}`);
  try {
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
