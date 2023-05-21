// Import needed functions
import { Schema, ObjectId, model } from 'mongoose';

// Create reaction schema
const reactionSchema = Schema({
  react: {
    type: String,
    enum: ['like', 'recommend', 'haha', 'sad', 'angry', 'wow'],
    required: true,
  },
  postRef: {
    type: ObjectId,
    ref: 'Post',
  },
  reactBy: {
    type: ObjectId,
    ref: 'User',
  },
});
// Create reaction model
const Reaction = model('Reaction', reactionSchema);

// Export the model
export default Reaction;
