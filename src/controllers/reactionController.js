// Import needed models
import Reaction from '../models/reactionModel.js';
import User from '../models/userModel.js';

async function getReactions(req, res) {
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

async function getPostReactions(req, res) {
  try {
    const postObj = await Post.findOne({ _id: req.params.id });
    console.log('[FOUND POST WITH TEXT]\t', postObj.text);
    const usersLiked = await Promise.all(
      postObj.likes.map(async (like) => {
        return await User.findOne({ _id: like.like });
      })
    );

    const usersRecommend = await Promise.all(
      postObj.recommends.map(async (like) => {
        return await User.findOne({ _id: like.like });
      })
    );

    const totalLikesCount = usersLiked.length + usersRecommend.length;

    up[key] = group[key] || [];
    wReacts.haha ? newReacts.haha.length : 0,
      res.json({
        likedUsers: usersLiked,
        recommendedUsers: usersRecommend,
        total: totalLikesCount,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Export the functions
export { getPostReactions, getReactions };
