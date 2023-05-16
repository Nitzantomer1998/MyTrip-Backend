// Import needed functions
import { Schema, ObjectId, model } from 'mongoose';

// Create post schema
const postSchema = Schema(
  {
    user: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['profilePicture', null],
      default: null,
    },
    background: {
      type: String,
    },
    text: {
      type: String,
    },
    images: {
      type: Array,
    },

    sharedFrom: {
      type: ObjectId,
      ref: 'Post',
      default: null,
    },
    originalUser: {
      username: {
        type: String,
      },
    },
    sharingUser: {
      username: {
        type: String,
        default: null,
      },
    },

    comments: [
      {
        comment: {
          type: String,
        },

        commentBy: {
          type: ObjectId,
          ref: 'User',
        },
        commentAt: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create post model
const Post = model('Post', postSchema);

// Export the model
export default Post;
