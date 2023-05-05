import mongoose from 'mongoose';

const postRecommendationSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
});

postRecommendationSchema.index({ userId: 1, postId: 1 }, { unique: true });

const PostRecommendation = mongoose.model(
  'PostRecommendation',
  postRecommendationSchema
);

export default PostRecommendation;
