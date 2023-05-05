import mongoose from 'mongoose';

const sharedPostSchema = mongoose.Schema({
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
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

sharedPostSchema.index({ userId: 1, postId: 1, timestamp: 1 });

const SharedPost = mongoose.model('SharedPost', sharedPostSchema);

export default SharedPost;
