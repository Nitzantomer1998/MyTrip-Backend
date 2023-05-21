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
    location: {
      type: String,
      default: null,
    },
    text: {
      type: String,
    },
    images: {
      type: Array,
    },
    type: {
      type: String,
      enum: ['profilePicture', null],
      default: null,
    },
    background: {
      type: String,
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
