// Import needed models
import Reaction from '../models/reactionModel.js';
import User from '../models/userModel.js';

async function getUserTotalLikes(req, res) {
  try {
    // Get all posts of the user
    const userPosts = await Post.find({ user: req.params.id });

    let totalLikes = 0;

    // For each post, get the number of likes
    for (let i = 0; i < userPosts.length; i++) {
      const postReacts = await React.find({
        postRef: userPosts[i]._id,
        react: 'like', // assuming 'like' is the name of the like reaction
      });
      totalLikes += postReacts.length;
    }

    console.log('Total Likes:', totalLikes); // ajouter cette ligne

    res.json({ totalLikes });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function postReaction(req, res) {
  try {
    const { postId, react } = req.body;
    const check = await React.findOne({
      postRef: postId,
      reactBy: mongoose.Types.ObjectId(req.user.id),
    });
    if (check == null) {
      const newReact = new React({
        react: react,
        postRef: postId,
        reactBy: req.user.id,
      });
      await newReact.save();
    } else {
      if (check.react == react) {
        await React.findByIdAndRemove(check._id);
      } else {
        await React.findByIdAndUpdate(check._id, {
          react: react,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getPostReactions(req, res) {
  try {
    const reactsArray = await Reaction.find({ postRef: req.params.id });

    /*
    const check1 = reacts.find(
      (x) => x.reactBy.toString() == req.user.id
    )?.react;
    */
    const newReacts = reactsArray.reduce((group, react) => {
      let key = react['react'];
      group[key] = group[key] || [];
      group[key].push(react);
      return group;
    }, {});

    const reacts = [
      {
        react: 'like',
        count: newReacts.like ? newReacts.like.length : 0,
      },
      {
        react: 'recommend',
        count: newReacts.recommend ? newReacts.recommend.length : 0,
      },
      {
        react: 'haha',
        count: newReacts.haha ? newReacts.haha.length : 0,
      },
      {
        react: 'sad',
        count: newReacts.sad ? newReacts.sad.length : 0,
      },
      {
        react: 'wow',
        count: newReacts.wow ? newReacts.wow.length : 0,
      },
      {
        react: 'angry',
        count: newReacts.angry ? newReacts.angry.length : 0,
      },
    ];

    const check = await Reaction.findOne({
      postRef: req.params.id,
      reactBy: req.user.id,
    });
    const user = await User.findById(req.user.id);
    const checkSaved = user?.savedPosts.find(
      (x) => x.post.toString() === req.params.id
    );
    res.json({
      reacts,
      check: check?.react,
      total: reactsArray.length,
      checkSaved: checkSaved ? true : false,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Export the functions
export { getPostReactions, postReaction, getUserTotalLikes };
