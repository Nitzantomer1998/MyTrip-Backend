import mongoose from 'mongoose';

const followSchema = mongoose.Schema({
  user1Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  user2Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

followSchema.index({ user1Id: 1, user2Id: 1 }, { unique: true });

const Follow = mongoose.model('Follow', followSchema);

export default Follow;
