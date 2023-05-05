import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  pictures: [String],
  location: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Like', // Fait référence au modèle Like
    },
  ],
  recommend: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PostRecommendation',
    },
  ],
  share: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SharedPost', 
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment', 
    },
  ],
});

const Post = mongoose.model('Post', postSchema);

export default Post;
