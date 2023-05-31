// Import needed models
import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import Reaction from '../models/reactionModel.js';

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

async function postReaction(req, res) {
  try {
    const { postId, react } = req.body;
    const check = await Reaction.findOne({
      postRef: postId,
      reactBy: req.user.id,
    });

    if (check && check.react === react) {
      // L'utilisateur a déjà réagi de cette manière au post,
      // donc nous supprimons la réaction.
      await Reaction.findByIdAndDelete(check._id);

      // Supprimer également la réaction de la collection des posts
      if (react === 'like') {
        await Post.findByIdAndUpdate(
          { _id: postId },
          {
            $pull: { likes: { like: req.user.id } },
          }
        );

        await User.findByIdAndUpdate(
          { _id: req.user.id },
          {
            $pull: { likedPosts: { post: postId } },
          }
        );
      } else {
        await Post.findByIdAndUpdate(
          { _id: postId },
          {
            $pull: { recommends: { recommend: req.user.id } },
          }
        );

        await User.findByIdAndUpdate(
          { _id: req.user.id },
          {
            $pull: { recommendedPosts: { post: postId } },
          }
        );
      }
      
      return res.json({ message: 'User unreacted post successfully' });
    } else {
      // Ajouter la réaction à la collection des réactions
      const newReact = new Reaction({
        react: react,
        postRef: postId,
        reactBy: req.user.id,
      });

      await newReact.save();

      // Ajouter également la réaction à la collection des posts
      if (react === 'like') {
        await Post.findByIdAndUpdate(
          { _id: postId },
          {
            $push: { likes: { like: req.user.id, likeAt: new Date() } },
          }
        );

        await User.findByIdAndUpdate(
          { _id: req.user.id },
          {
            $push: { likedPosts: { post: postId, likedAt: new Date() } },
          }
        );
      } else {
        await Post.findByIdAndUpdate(
          { _id: postId },
          {
            $push: { recommends: { recommend: req.user.id, recommendAt: new Date() } },
          }
        );

        await User.findByIdAndUpdate(
          { _id: req.user.id },
          {
            $push: {
              recommendedPosts: {
                post: postId,
                recommendedAt: new Date(),
              },
            },
          }
        );
      }
      
      return res.json({ message: 'User reacted post successfully' });
    }
  } catch (error) {
    console.error(`postReaction Error: ${error.message}`);
  }
}

async function getAllPostsLiked(req, res) {
  try {
    // Trouver l'utilisateur par son nom d'utilisateur
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    //console.log('User:', user);

    // Obtenir la liste des posts sauvegardés
    const likedPostIds = user.likedPosts.map(
      (likedPostObj) => likedPostObj.post
    );
    const likedPosts = await Post.find({ _id: { $in: likedPostIds } })
      .populate('user', 'username picture')
      .populate('comments.commentBy', 'username picture')
      .sort({ createdAt: -1 });

    console.log('liked Posts:', likedPosts);

    // Renvoyer la liste des posts sauvegardés
    res.status(200).json(likedPosts);
  } catch (error) {
    //console.error('Error:', error);

    res.status(500).json({ message: error.message });
  }
}

async function getAllPostsRecommended(req, res) {
  try {
    // Trouver l'utilisateur par son nom d'utilisateur
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    //console.log('User:', user);

    // Obtenir la liste des posts sauvegardés
    const recommendedPostIds = user.recommendedPosts.map(
      (recommendedPostObj) => recommendedPostObj.post
    );
    const recommendedPosts = await Post.find({
      _id: { $in: recommendedPostIds },
    })
      .populate('user', 'username picture')
      .populate('comments.commentBy', 'username picture')
      .sort({ createdAt: -1 });

    console.log('recommended Posts:', recommendedPosts);

    // Renvoyer la liste des posts sauvegardés
    res.status(200).json(recommendedPosts);
  } catch (error) {
    //console.error('Error:', error);

    res.status(500).json({ message: error.message });
  }
}

async function getPostLikes(req, res) {
  try {
    // Find the post by postId and populate the 'likes' field with user documents
    const currentPost = await Post.findById(req.body.postId)
      .select('likes.like')
      .populate('likes.like', 'username picture');

    // Send back the current user followers
    res.json({ likes: currentPost.likes });
  } catch (error) {
    console.error(`getPostLikes Error: ${error}`);
  }
}

async function getPostRecommended(req, res) {
  try {
    // Find the post by postId and populate the 'likes' field with user documents
    const post = await Post.findById(req.body.postId)
      .select('recommends.recommend')
      .populate('recommends.recommend', 'username picture');

    // Send back the current user followers
    res.json({ recommends: currentPost.recommends });
  } catch (error) {
    console.error(`getPostRecommended Error: ${error}`);
  }
}

async function getPostbyId(req, res) {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    console.log('post:', postId); //undefined
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);

  } catch (error) {
    console.error(`getPostbyId Error: ${error}`);
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
  postReaction,
  getAllPostsRecommended,
  getAllPostsLiked,
  getPostLikes,
  getPostRecommended,
  getPostbyId,
};
